import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { COMPREHENSIVE_DICTIONARY, findMeaningInDict } from './src/utils/koreanDictionary';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to lazily initialize Gemini Client safely
function getAiClient(): GoogleGenAI | null {
  if (process.env.GEMINI_API_KEY) {
    try {
      return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Gemini API client:', err);
    }
  }
  return null;
}

// Dynamic fallback comment generator when API is unreachable or rate limited
function generateDynamicFallbackComment(userWord: string, aiWord: string): string {
  const scienceKeywords = ['양자', '원자', '중력', '상대성', '전자', '분자', '물리', '화학', '생물', '우주', '은하', '행성', '에너지', '파동', '속도', '가속도', '유전자', '세포', '뉴턴', '아인슈타인', '질량', '광자', '블랙홀', '태양', '달', '지구', '실험', '가설', '연구', '빛', '열', '자기', '역학', '천문', '원소', '주기율', '미생물', '진화'];
  const techKeywords = ['컴퓨터', '로봇', '코드', '데이터', '인공지능', '알고리즘', '인터넷', '소프트웨어', '하드웨어', '네트워크', '서버', '해킹', '디지털', '스마트', '모바일', '프로그램', '전자', '회로', '지능', '기계'];
  const foodKeywords = ['사과', '바나나', '포도', '김치', '라면', '수박', '고기', '밥', '빵', '커피', '우유', '치즈', '초콜릿', '과자', '음식', '요리', '식당', '과일', '채소', '상추', '고추'];
  const natureKeywords = ['나무', '꽃', '바다', '산', '강', '하늘', '구름', '비', '눈', '바람', '호랑이', '사자', '고양이', '강아지', '새', '물고기', '자연', '식물', '동물', '숲', '들판', '파도'];

  const hash = Array.from(userWord + aiWord).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (scienceKeywords.some(k => userWord.includes(k))) {
    const scienceComments = [
      `'${userWord}'에 담긴 깊은 과학적 원리와 자연의 이치가 흥미롭군요! 저는 '${aiWord}'(으)로 이어서 맞대응합니다.`,
      `오호, 탐구심이 돋보이는 과학 어휘 '${userWord}'! 깊이 있는 기세에 맞춰 '${aiWord}'(으)로 응수합니다.`,
      `'${userWord}'의 학술적 맥락과 원리를 살린 지적인 어휘군요! 저는 바로 '${aiWord}'(으)로 받아치지요.`
    ];
    return scienceComments[hash % scienceComments.length];
  }

  if (techKeywords.some(k => userWord.includes(k))) {
    const techComments = [
      `디지털과 알고리즘의 핵심인 '${userWord}'! AI인 저에게 가슴 와닿는 반가운 단어군요. '${aiWord}'(으)로 이어서 공격합니다!`,
      `'${userWord}'(이)라는 첨단 기술 어휘라니! 연산 능력을 총동원해 '${aiWord}'(으)로 단단히 방어해냅니다.`
    ];
    return techComments[hash % techComments.length];
  }

  if (foodKeywords.some(k => userWord.includes(k))) {
    const foodComments = [
      `'${userWord}'! 만유인력의 영감이 된 뉴턴의 사과나 풍부한 영양 요소가 생각나는 유쾌한 어휘군요! 제 답은 '${aiWord}'입니다.`,
      `맛있고 풍성한 의미를 지닌 '${userWord}' 단어로 공격하시다니! 저는 '${aiWord}'(으)로 기분 좋게 받아쳐 드립니다.`
    ];
    return foodComments[hash % foodComments.length];
  }

  if (natureKeywords.some(k => userWord.includes(k))) {
    const natureComments = [
      `대자연의 생동감과 기운이 느껴지는 '${userWord}' 어휘군요! 저는 '${aiWord}'(으)로 차분하게 이어나갑니다.`,
      `'${userWord}'이(가) 지닌 고유한 매력과 자연의 순환이 돋보입니다! 바로 '${aiWord}'(으)로 응수하지요.`
    ];
    return natureComments[hash % natureComments.length];
  }

  const generalTemplates = [
    `'${userWord}'(이)라는 단어의 맥락과 특징이 돋보이네요! 저는 '${aiWord}'(으)로 이어서 받아칩니다.`,
    `'${userWord}'을(를) 떠올리신 깊은 어휘력이 인상적입니다! 제 다음 단어는 바로 '${aiWord}'입니다.`,
    `'${userWord}'이(가) 지닌 고유한 의미와 상상을 이어받아, '${aiWord}'(으)로 받아쳐 드리죠.`
  ];
  return generalTemplates[hash % generalTemplates.length];
}

// Korean Initial Sound Rule Helper (두음법칙)
function getValidNextSyllables(lastChar: string, allowRule: boolean): string[] {
  if (!lastChar) return [];
  const results = [lastChar];
  if (!allowRule) return results;

  const initialMap: Record<string, string[]> = {
    '녀': ['여'], '뇨': ['요'], '뉴': ['유'], '니': ['이'],
    '랴': ['야'], '려': ['여'], '례': ['예'], '료': ['요'], '류': ['유'], '리': ['이'],
    '라': ['나'], '래': ['내'], '로': ['노'], '뢰': ['뇌'], '루': ['누'], '르': ['느'],
    '량': ['양'], '령': ['영'], '룡': ['용'], '륭': ['융'], '릉': ['능'], '름': ['늠'],
    '률': ['율'], '렬': ['열'], '락': ['낙'], '란': ['난'], '람': ['남'], '랍': ['납']
  };

  if (initialMap[lastChar]) {
    results.push(...initialMap[lastChar]);
  }
  return Array.from(new Set(results));
}

// Helper function to find meaning from comprehensive dictionary
function findMeaningInFallback(word: string): string | null {
  return findMeaningInDict(word);
}

// Built-in Curated Fallback Korean Dictionary (Extensive Real Korean words from Standard Korean Dictionary)
const FALLBACK_DICTIONARY = COMPREHENSIVE_DICTIONARY;

// Known Unmatchable Terminal Syllables (한방 음절)
const IMPOSSIBLE_TERMINAL_SYLLABLES = new Set([
  '녁', '륨', '녑', '듐', '쁨', '옾', '탉', '갉', '곯', '갹', '걋', '댱', '덛', '뎠', '뎨',
  '돎', '돰', '됴', '둄', '뒈', '듸', '딮', '떰', '뗌', '똔', '뙈', '뚬', '뛔', '뜅', '랖',
  '럅', '렆', '롑', '뢔', '룅', '뤈', '륀', '릏', '맒', '먈', '멉', '몌', '뫄', '묄', '뮨',
  '믐', '뱁', '벎', '볌', '봔', '뵤', '붑', '뷘', '븜', '빰', '뺌', '뻬', '뼁', '뾔', '뿟',
  '삔', '샾', '섟', '셴', '솩', '쇈', '숌', '쉔', '슉', '싀', '쌉', '쏵', '쐬', '쑥', '쓩'
]);

// API Route: Word Chain AI Turn Processing
app.post('/api/wordchain/play', async (req, res) => {
  try {
    const { userWord, previousWord, historyWords = [], difficulty = 'MEDIUM', rules = {} } = req.body;

    if (!userWord || typeof userWord !== 'string') {
      return res.status(400).json({ valid: false, errorReason: '단어를 입력해주세요.' });
    }

    const trimmedUserWord = userWord.trim();

    // 1. Check Korean Hangul only (한글만 허용, 2자 이상)
    if (!/^[가-힣]+$/.test(trimmedUserWord)) {
      return res.status(400).json({ valid: false, errorReason: '한글 단어만 입력 가능합니다.' });
    }

    if (trimmedUserWord.length < 2) {
      return res.status(400).json({ valid: false, errorReason: '단어는 최소 2글자 이상이어야 합니다.' });
    }

    // 2. Check length rules
    const { wordLengthMode = 'ANY', allowInitialSoundRule = true } = rules;
    if (wordLengthMode === 'TWO_ONLY' && trimmedUserWord.length !== 2) {
      return res.status(400).json({ valid: false, errorReason: '2글자 단어만 사용 가능한 규칙입니다.' });
    }
    if (wordLengthMode === 'THREE_ONLY' && trimmedUserWord.length !== 3) {
      return res.status(400).json({ valid: false, errorReason: '3글자 단어만 사용 가능한 규칙입니다.' });
    }
    if (wordLengthMode === 'TWO_TO_FOUR' && (trimmedUserWord.length < 2 || trimmedUserWord.length > 4)) {
      return res.status(400).json({ valid: false, errorReason: '2글자~4글자 단어만 사용 가능한 규칙입니다.' });
    }

    // 3. Duplicate check
    const normalizedHistory = historyWords.map((w: string) => w.trim());
    if (normalizedHistory.includes(trimmedUserWord)) {
      return res.status(400).json({ valid: false, errorReason: `이미 사용된 단어입니다: '${trimmedUserWord}'` });
    }

    // 4. Initial Sound rule check if there's a previous word
    if (previousWord) {
      const lastChar = previousWord.charAt(previousWord.length - 1);
      const validStarts = getValidNextSyllables(lastChar, allowInitialSoundRule);
      const firstChar = trimmedUserWord.charAt(0);

      if (!validStarts.includes(firstChar)) {
        const rulesText = validStarts.length > 1 ? `'${validStarts.join("' 또는 '")}'` : `'${validStarts[0]}'`;
        return res.status(400).json({
          valid: false,
          errorReason: `'${previousWord}'의 끝말인 ${rulesText}(으)로 시작해야 합니다. ('${firstChar}'(으)로 시작함)`
        });
      }
    }

    // Calculate last char of user word for AI's turn
    const userLastChar = trimmedUserWord.charAt(trimmedUserWord.length - 1);
    const validAiStarts = getValidNextSyllables(userLastChar, allowInitialSoundRule);
    const IMPOSSIBLE_SYLLABLES = new Set(['녁', '륨', '녑', '듐', '쁨', '옾', '녘', '갹', '넙', '늣', '댱', '뤈', '랖', '릍', '뤕', '믜', '븨', '빋', '뺘', '뾔', '뿟', '얍', '옰', '윱', '읖', '읟', '쯧', '턍', '텬', '톺', '퓌', '픗', '햏']);
    const isTrulyImpossibleSyllable = validAiStarts.every(syl => IMPOSSIBLE_SYLLABLES.has(syl));

    // If Gemini API is available, ask Gemini to validate user word + generate AI response
    let isGeminiWorking = true;
    let geminiGeneratedComment: string | null = null;
    const aiClient = getAiClient();
    if (aiClient) {
      try {
        const prompt = `
당신은 대한민국 국립국어원 표준국어대사전 어휘 데이터베이스를 완벽히 탑재한 끝말잇기 게임 최고 수준 AI 대전 상대입니다.
설정 난이도: ${difficulty}

[난이도 및 어휘 지침]:
- 난이도(${difficulty})는 포기하는 확률이 절대 아닙니다! AI가 구사하는 **단어의 난이도/어휘 수준**을 나타냅니다.
  * EASY: 초등학생 및 일상 생활에서 매우 흔하고 친숙한 2~3글자 단어
  * MEDIUM: 풍부하고 대중적인 다양한 표준 명사 (절대 섣불리 포기하지 말고 끝까지 이을 단어를 찾으세요!)
  * HARD: 고급 어휘, 고사성어, 학술 용어, 문학적 어휘
  * MASTER: 최고 난이도 전문어, 희귀 어휘, 시사 및 학술 용어
- [포기 절대 금지!]: 음절 '${userLastChar}'${allowInitialSoundRule && validAiStarts.length > 1 ? ` (또는 두음법칙 '${validAiStarts.slice(1).join("', '")}')` : ''}(으)로 시작하는 한국어 명사 단어는 대한민국 사전에 무수히 존재합니다. 절대로 giveUp: true로 포기하지 말고 반드시 이을 단어를 제출하세요!
- giveUp: true는 '녁', '륨', '녑', '듐', '쁨', '옾' 같이 표준 한국어 단어가 사전에 전혀 존재하지 않는 한방 음절일 때만 허용됩니다.

게임 규칙:
- 두음법칙 적용: ${allowInitialSoundRule ? '예' : '아니오'}
- 글자 수 제한: ${wordLengthMode}
- 이미 사용된 단어 목록: [${normalizedHistory.join(', ')}]

플레이어가 제출한 단어: "${trimmedUserWord}"
플레이어 제출 단어가 시작해야 하는 음절: [${previousWord ? getValidNextSyllables(previousWord.slice(-1), allowInitialSoundRule).join(', ') : '자유'}]

과제:
1. 플레이어의 단어 "${trimmedUserWord}"가 국립국어원 표준국어대사전에 실제로 존재하는 올바른 명사인지 검증하세요. (사전에 없거나 억지 조어면 userWordValid: false)
2. 플레이어 단어 "${trimmedUserWord}"의 정확하고 명확한 사전적 뜻풀이(userWordMeaning)를 작성하세요.
3. 당신(AI)이 받아쳐서 이을 단어(aiWord)를 반드시 국립국어원 표준국어대사전 또는 우리말샘에 실제로 등재되어 있는 정식 명사(2글자~4글자) 중에서만 선택하세요.
   - [★절대주의★] 사전에 존재하지 않는 억지 조합 단어, 임의로 지어낸 신조어나 유령 어휘는 절대로 제출하지 마십시오! 실제로 존재하는 정식 명사만 허용됩니다. 만약 해당 음절로 시작하는 실존 단어가 생각이 나지 않거나 전혀 없는 경우, 절대로 단어를 지어내지 말고 giveUp: true 로 응답하세요.
   - 시작 음절 조건: '${userLastChar}'${allowInitialSoundRule && validAiStarts.length > 1 ? ` (또는 두음법칙 '${validAiStarts.slice(1).join("', '")}')` : ''} 음절로 시작!
   - 이미 사용된 단어 목록에 없어야 함!
   - 글자 수 제한 규칙 (${wordLengthMode}) 준수!
4. AI 단어의 정확한 사전적 뜻풀이(aiWordMeaning)를 작성하세요.
5. [AI 반응 코멘트(aiComment) 작성 지침 - 가장 중요!]:
   - 플레이어가 제출한 단어 "${trimmedUserWord}"가 속한 **주제 분야(과학, 기술, 자연, 음식, 역사, 스포츠, 문학 등)**나 **해당 단어의 과학적 원리, 배경 지식, 실시간 관련 정보**를 직접 언급하며 생생하게 생성하세요!
   - 예: 플레이어가 '양자' 입력 시 -> "'양자'의 신비로운 미시세계와 불확정성 원리가 떠오르는 지적인 어휘 공격이군요!"
   - 예: 플레이어가 '사과' 입력 시 -> "뉴턴에게 만유인력의 영감을 안겨준 '사과'처럼 상큼하고 알찬 단어네요!"
   - 예: 플레이어가 '컴퓨터' 입력 시 -> "'컴퓨터'라니! 데이터 연산으로 움직이는 AI인 저에게 가슴 와닿는 정겨운 어휘입니다."
   - 정형화된 틀 문구는 절대 사용 금지. 유네스코/과학/문화/자연 등 플레이어 단어의 특성을 직접 짚는 1문장 생성.

JSON 형식으로 응답하세요:
{
  "userWordValid": boolean,
  "invalidReason": string,
  "userWordMeaning": string,
  "aiWord": string | null,
  "aiWordMeaning": string,
  "aiComment": string,
  "giveUp": boolean
}
`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.8,
          }
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText.trim());

        if (!parsed.userWordValid) {
          return res.status(400).json({
            valid: false,
            errorReason: parsed.invalidReason || `'${trimmedUserWord}'은(는) 국립국어원 사전에 등록되지 않은 단어입니다.`
          });
        }

        if (parsed.aiComment && typeof parsed.aiComment === 'string' && parsed.aiComment.length > 2) {
          geminiGeneratedComment = parsed.aiComment.trim();
        }

        const fallbackUserM = findMeaningInFallback(trimmedUserWord);
        const userMeaningToReturn = parsed.userWordMeaning || (fallbackUserM ? `${trimmedUserWord} : ${fallbackUserM}` : `${trimmedUserWord} : 표준 한국어 어휘`);

        const cleanAiWord = parsed.aiWord ? String(parsed.aiWord).trim() : null;
        const isValidStart = cleanAiWord && validAiStarts.some(s => cleanAiWord.startsWith(s));
        const isValidKoreanFormat = cleanAiWord && isValidStart && /^[가-힣]{2,4}$/.test(cleanAiWord) && !normalizedHistory.includes(cleanAiWord);

        // If Gemini provided a valid word that matches starting syllable, use it directly!
        if (!parsed.giveUp && isValidKoreanFormat) {
          const fallbackAiM = findMeaningInFallback(cleanAiWord);
          const aiMeaningToReturn = parsed.aiWordMeaning || (fallbackAiM ? `${cleanAiWord} : ${fallbackAiM}` : `${cleanAiWord} : 표준 한국어 어휘`);

          return res.json({
            valid: true,
            userWord: trimmedUserWord,
            userWordMeaning: userMeaningToReturn,
            aiWord: cleanAiWord,
            aiWordMeaning: aiMeaningToReturn,
            aiComment: geminiGeneratedComment || generateDynamicFallbackComment(trimmedUserWord, cleanAiWord),
            giveUp: false
          });
        }

        // If Gemini mistakenly claimed giveUp on a truly impossible syllable:
        if (parsed.giveUp && isTrulyImpossibleSyllable) {
          return res.json({
            valid: true,
            userWord: trimmedUserWord,
            userWordMeaning: userMeaningToReturn,
            aiWord: null,
            aiWordMeaning: '',
            aiComment: geminiGeneratedComment || '더 이상 이을 수 있는 표준어가 생각나지 않네요. 당신의 승리입니다! 🎉',
            giveUp: true
          });
        }

      } catch (geminiError: any) {
        isGeminiWorking = false;
        console.warn('Gemini API call unavailable, using local dictionary engine.');
      }
    }

    // Fallback Step 1: Use Local Curated Dictionary
    let candidateList: { word: string; meaning: string; level: string }[] = [];
    for (const startSyl of validAiStarts) {
      if (FALLBACK_DICTIONARY[startSyl]) {
        candidateList.push(...FALLBACK_DICTIONARY[startSyl]);
      }
    }

    // Filter out used words & word length
    candidateList = candidateList.filter(c => !normalizedHistory.includes(c.word));
    if (wordLengthMode === 'TWO_ONLY') candidateList = candidateList.filter(c => c.word.length === 2);
    if (wordLengthMode === 'THREE_ONLY') candidateList = candidateList.filter(c => c.word.length === 3);

    const fallbackUserM = findMeaningInFallback(trimmedUserWord);
    const userMeaningToReturn = fallbackUserM ? `${trimmedUserWord} : ${fallbackUserM}` : `${trimmedUserWord} : 표준 한국어 어휘`;

    if (candidateList.length === 0) {
      // Genuinely impossible terminal syllable or no words left anywhere
      return res.json({
        valid: true,
        userWord: trimmedUserWord,
        userWordMeaning: userMeaningToReturn,
        aiWord: null,
        aiWordMeaning: '',
        aiComment: geminiGeneratedComment || '아! 더 이상 이을 단어가 생각나지 않네요. 당신의 승리입니다! 🎉',
        giveUp: true
      });
    }

    // Select candidate matching difficulty if possible
    let matched = candidateList.filter(c => c.level === difficulty);
    if (matched.length === 0) matched = candidateList;

    const chosen = matched[Math.floor(Math.random() * matched.length)];

    const finalComment = geminiGeneratedComment || generateDynamicFallbackComment(trimmedUserWord, chosen.word);

    return res.json({
      valid: true,
      userWord: trimmedUserWord,
      userWordMeaning: userMeaningToReturn,
      aiWord: chosen.word,
      aiWordMeaning: `${chosen.word} : ${chosen.meaning}`,
      aiComment: finalComment,
      giveUp: false
    });

  } catch (error: any) {
    console.error('Word chain API error:', error);
    res.status(500).json({ valid: false, errorReason: '서버 처리 중 오류가 발생했습니다.' });
  }
});

// API Route: Get Hint
app.post('/api/wordchain/hint', async (req, res) => {
  try {
    const { currentSyllable, allowInitialSoundRule = true, historyWords = [] } = req.body;
    if (!currentSyllable) {
      return res.status(400).json({ error: '음절이 제공되지 않았습니다.' });
    }

    const validStarts = getValidNextSyllables(currentSyllable, allowInitialSoundRule);

    const aiClient = getAiClient();
    if (aiClient) {
      try {
        const prompt = `
한국어 끝말잇기 힌트 제공:
시작해야 하는 음절: [${validStarts.join(', ')}]
이미 사용된 단어: [${historyWords.join(', ')}]

플레이어가 사용할 수 있는 추천 단어 3개와 초성 힌트 및 간단한 힌트 설명을 만들어주세요.

JSON 형식:
{
  "hints": [
    { "word": "단어명", "initialConsonants": "ㄷㄹㅈ", "clue": "힌트 설명 (예: 조그마한 산람 동물의 일종)" }
  ]
}
`;
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        const parsed = JSON.parse(response.text || '{}');
        return res.json({ hints: parsed.hints || [] });
      } catch (err) {
        console.warn('Gemini hint error, using fallback:', err);
      }
    }

    // Local fallback hints
    let candidateList: { word: string; meaning: string }[] = [];
    for (const syl of validStarts) {
      if (FALLBACK_DICTIONARY[syl]) {
        candidateList.push(...FALLBACK_DICTIONARY[syl]);
      }
    }
    candidateList = candidateList.filter(c => !historyWords.includes(c.word));

    const hints = candidateList.slice(0, 3).map(c => ({
      word: c.word,
      clue: c.meaning
    }));

    return res.json({ hints });
  } catch (err) {
    res.status(500).json({ error: '힌트 생성 실패' });
  }
});

// Serve Vite frontend in development & built static files in production
if (process.env.NODE_ENV !== 'production') {
  createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then(vite => {
    app.use(vite.middlewares);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Development Server running on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Production Server running on http://localhost:${PORT}`);
  });
}
