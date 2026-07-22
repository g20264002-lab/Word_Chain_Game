import { DifficultyLevel, GameRuleOptions, HintItem } from '../types';
import { getValidNextSyllables, isValidHangulWord } from './koreanUtils';

export interface PlayResult {
  valid: boolean;
  errorReason?: string;
  userWord?: string;
  userWordMeaning?: string;
  aiWord?: string | null;
  aiWordMeaning?: string;
  aiComment?: string;
  giveUp?: boolean;
}

interface DictEntry {
  word: string;
  meaning: string;
  level: DifficultyLevel;
}

// Built-in safe client-side fallback dictionary for Korean word chain
export const LOCAL_DICTIONARY: Record<string, DictEntry[]> = {
  '가': [
    { word: '가방', meaning: '물건을 넣어 들거나 어깨에 메는 용구', level: 'EASY' },
    { word: '가을', meaning: '여름과 겨울 사이의 계절', level: 'EASY' },
    { word: '가수', meaning: '노래 부르는 것을 직업으로 하는 사람', level: 'EASY' },
    { word: '가구', meaning: '집안에서 쓰는 수장 용구', level: 'EASY' },
    { word: '가람', meaning: '강의 옛말 또는 사찰의 배치', level: 'MEDIUM' },
    { word: '가교', meaning: '다리를 놓음. 어떤 일을 중간에서 연결함', level: 'HARD' }
  ],
  '각': [
    { word: '각도', meaning: '한 점에서 그은 두 반직선이 이루는 도형의 크기', level: 'EASY' },
    { word: '각목', meaning: '단면이 네모진 기다란 나무', level: 'MEDIUM' },
    { word: '각오', meaning: '앞으로 일어날 일에 대하여 마음을 단단히 먹음', level: 'MEDIUM' },
    { word: '각축', meaning: '서로 이기려고 다툼', level: 'HARD' }
  ],
  '간': [
    { word: '간식', meaning: '정식 식사 외에 비정기적으로 먹는 음식', level: 'EASY' },
    { word: '간판', meaning: '가게나 기관 따위의 이름을 써서 내건 판', level: 'EASY' },
    { word: '간호사', meaning: '환자의 간호나 진료 보조를 맡아 하는 전문 직종', level: 'EASY' },
    { word: '간격', meaning: '사물이나 시간 사이의 떨어진 거리', level: 'MEDIUM' }
  ],
  '갈': [
    { word: '갈대', meaning: '습지나 호숫가에 자라는 벼과의 다년생 식물', level: 'EASY' },
    { word: '갈고리', meaning: '끝이 뾰족하고 굽은 도구', level: 'EASY' },
    { word: '갈망', meaning: '간절히 바람', level: 'HARD' }
  ],
  '감': [
    { word: '감자', meaning: '땅속 덩이줄기를 식용하는 가지과의 식물', level: 'EASY' },
    { word: '감사', meaning: '고마움을 나타내는 인사의 말', level: 'EASY' },
    { word: '감정', meaning: '어떤 현상이나 일에 대하여 일어나는 마음이나 기분', level: 'MEDIUM' },
    { word: '감옥', meaning: '죄인을 가두어 두는 시설', level: 'EASY' }
  ],
  '갑': [
    { word: '갑옷', meaning: '싸움터에서 몸을 보호하기 위하여 입던 옷', level: 'EASY' },
    { word: '갑판', meaning: '배 위쪽에 깐 넓고 평평한 바닥', level: 'MEDIUM' }
  ],
  '강': [
    { word: '강아지', meaning: '개 또는 개과의 어린 동물', level: 'EASY' },
    { word: '강당', meaning: '많은 사람이 모여 강연이나 집회를 여는 넓은 방', level: 'EASY' },
    { word: '강변', meaning: '강가의 땅', level: 'EASY' },
    { word: '강인함', meaning: '의지나 마음이 강하고 억셈', level: 'HARD' }
  ],
  '개': [
    { word: '개구리', meaning: '양서류 개구리목의 동물', level: 'EASY' },
    { word: '개미', meaning: '곤충강 벌목 개밋과의 총칭', level: 'EASY' },
    { word: '개성', meaning: '다른 사람과 구별되는 그 사람 고유의 특성', level: 'MEDIUM' },
    { word: '개혁', meaning: '제도나 기구 따위를 새로 고침', level: 'HARD' }
  ],
  '거': [
    { word: '거북이', meaning: '파충류 거북목의 총칭', level: 'EASY' },
    { word: '거울', meaning: '물체의 모습을 반사하여 보여 주는 도구', level: 'EASY' },
    { word: '거미', meaning: '거미목에 속하는 절지동물', level: 'EASY' },
    { word: '거장', meaning: '어떤 분야에서 기술이나 예술이 아주 뛰어난 사람', level: 'HARD' }
  ],
  '건': [
    { word: '건물', meaning: '사람이 들어살거나 일을 하기 위해 지은 구조물', level: 'EASY' },
    { word: '건강', meaning: '몸과 마음이 무탈하고 튼튼한 상태', level: 'EASY' },
    { word: '건축', meaning: '집이나 다리 따위의 구조물을 설계하여 지음', level: 'MEDIUM' },
    { word: '건전지', meaning: '전기를 저장하여 쓰는 화학 전지', level: 'EASY' }
  ],
  '나': [
    { word: '나비', meaning: '나비목에 속하는 곤충의 총칭', level: 'EASY' },
    { word: '나무', meaning: '줄기나 가지가 목질로 된 다년생 식물', level: 'EASY' },
    { word: '나침반', meaning: '지구의 자석 성질을 이용해 방향을 가리키는 도구', level: 'MEDIUM' }
  ],
  '낙': [
    { word: '낙엽', meaning: '계절에 따라 떨어지는 나뭇잎', level: 'EASY' },
    { word: '낙원', meaning: '아무런 걱정이나 근심 없이 행복하게 살 수 있는 곳', level: 'MEDIUM' }
  ],
  '난': [
    { word: '난로', meaning: '불을 피워 방 안을 따뜻하게 하는 장치', level: 'EASY' },
    { word: '난초', meaning: '난초과 식물의 총칭', level: 'MEDIUM' }
  ],
  '날': [
    { word: '날씨', meaning: '대기의 기온, 습도, 바람 따위의 상태', level: 'EASY' },
    { word: '날개', meaning: '새나 곤충 따위가 공중을 날아다니는 데 쓰는 기관', level: 'EASY' }
  ],
  '남': [
    { word: '남극', meaning: '지구 남쪽 끝의 극지방', level: 'EASY' },
    { word: '남산', meaning: '서울 중심부에 있는 산', level: 'EASY' }
  ],
  '다': [
    { word: '다람쥐', meaning: '다람쥐과의 조그마한 포유류', level: 'EASY' },
    { word: '다리', meaning: '몸을 받치거나 걷는 데 쓰는 기관, 또는 다리 교량', level: 'EASY' },
    { word: '다이아몬드', meaning: '탄소로 이루어진 매우 단단한 보석', level: 'MEDIUM' }
  ],
  '달': [
    { word: '달팽이', meaning: '껍데기를 가진 복족류 붕어목의 동물', level: 'EASY' },
    { word: '달력', meaning: '날짜와 요일을 적어 놓은 표', level: 'EASY' },
    { word: '달리기', meaning: '빠르게 달려가는 운동', level: 'EASY' }
  ],
  '당': [
    { word: '당근', meaning: '메꽃과의 비타민A가 풍부한 채소', level: 'EASY' },
    { word: '당구', meaning: '큐로 공을 쳐서 점수를 얻는 게임', level: 'EASY' }
  ],
  '대': [
    { word: '대나무', meaning: '벼과의 기다랗고 속이 빈 나무', level: 'EASY' },
    { word: '대통령', meaning: '민주공화국의 국가 원수', level: 'MEDIUM' },
    { word: '대한민국', meaning: '동아시아의 민주공화국 국가', level: 'EASY' }
  ],
  '도': [
    { word: '도서관', meaning: '책이나 자료를 모아 두는 시설', level: 'EASY' },
    { word: '도로', meaning: '차나 사람이 다니는 길', level: 'EASY' },
    { word: '도자기', meaning: '흙으로 구워 만든 그릇', level: 'MEDIUM' }
  ],
  '동': [
    { word: '동물원', meaning: '여러 동물을 모아 두고 구경할 수 있게 한 시설', level: 'EASY' },
    { word: '동전', meaning: '구리나 금속으로 만든 돈', level: 'EASY' },
    { word: '동화', meaning: '어린이를 위한 이야기', level: 'EASY' }
  ],
  '마': [
    { word: '마술', meaning: '눈속임으로 이상한 현상을 보여 주는 기술', level: 'EASY' },
    { word: '마을', meaning: '여러 가구가 모여 사는 리, 동 단위의 지역', level: 'EASY' }
  ],
  '바': [
    { word: '바다', meaning: '지구 위에서 소금물이 채워진 넓은 부분', level: 'EASY' },
    { word: '바나나', meaning: '열대 과일의 일종', level: 'EASY' },
    { word: '바람', meaning: '공기의 이동 현상', level: 'EASY' }
  ],
  '사': [
    { word: '사과', meaning: '사과나무의 과일', level: 'EASY' },
    { word: '사자', meaning: '고양이과의 야생 포유류', level: 'EASY' },
    { word: '사진', meaning: '카메라로 촬영한 정지 영상', level: 'EASY' }
  ],
  '아': [
    { word: '아침', meaning: '날이 새어 해가 떠오를 무렵부터 낮 전까지의 시간', level: 'EASY' },
    { word: '아파트', meaning: '여러 가구가 한 건물 안에서 각각 독립하여 살 수 있게 지은 공동 주택', level: 'EASY' },
    { word: '아이폰', meaning: '애플사에서 개발한 스마트폰', level: 'EASY' }
  ],
  '자': [
    { word: '자전거', meaning: '바퀴 두 개로 사람이 페달을 밟아 움직이는 탈것', level: 'EASY' },
    { word: '자연', meaning: '사람의 힘이 가해지지 않은 본래의 세상', level: 'EASY' },
    { word: '자동차', meaning: '원동기를 이용하여 바퀴를 굴려서 움직이는 차', level: 'EASY' }
  ],
  '차': [
    { word: '차량', meaning: '도로나 선로를 달리는 모든 종류의 차', level: 'EASY' },
    { word: '차표', meaning: '차를 탈 수 있는 표', level: 'EASY' }
  ],
  '카': [
    { word: '카메라', meaning: '사진이나 영상을 촬영하는 기기', level: 'EASY' },
    { word: '카드', meaning: '결제나 신분 확인용 직사각형 판', level: 'EASY' }
  ],
  '타': [
    { word: '타자기', meaning: '글자를 기계적으로 인쇄하는 장치', level: 'MEDIUM' },
    { word: '타이어', meaning: '바퀴 외곽에 둘러싸는 고무 테두리', level: 'EASY' }
  ],
  '파': [
    { word: '파도', meaning: '바다나 호수에서 일어나는 물결', level: 'EASY' },
    { word: '파인애플', meaning: '열대 과일의 일종', level: 'EASY' }
  ],
  '하': [
    { word: '하늘', meaning: '지구의 표면을 둘러싸고 있는 우주 공간', level: 'EASY' },
    { word: '학교', meaning: '학생들을 교육하는 기관', level: 'EASY' },
    { word: '하마', meaning: '아프리카의 대형 양서 포유류', level: 'EASY' }
  ]
};

export function findLocalMeaning(word: string): string | null {
  for (const key of Object.keys(LOCAL_DICTIONARY)) {
    const list = LOCAL_DICTIONARY[key] || [];
    const found = list.find((item) => item.word === word);
    if (found) return found.meaning;
  }
  return null;
}

export function processFallbackWordChain(
  userWord: string,
  previousWord: string,
  historyWords: string[],
  difficulty: DifficultyLevel,
  rules: GameRuleOptions
): PlayResult {
  const trimmed = userWord ? userWord.trim() : '';

  if (!trimmed || !isValidHangulWord(trimmed)) {
    return { valid: false, errorReason: '한글 단어만 입력하실 수 있습니다.' };
  }

  if (trimmed.length < 2 || trimmed.length > 5) {
    return { valid: false, errorReason: '단어는 2자 이상, 5자 이하이어야 합니다.' };
  }

  if (rules.wordLengthMode === 'TWO_ONLY' && trimmed.length !== 2) {
    return { valid: false, errorReason: '현재 규칙은 2글자 단어만 가능합니다.' };
  }
  if (rules.wordLengthMode === 'THREE_ONLY' && trimmed.length !== 3) {
    return { valid: false, errorReason: '현재 규칙은 3글자 단어만 가능합니다.' };
  }

  if (previousWord) {
    const lastChar = previousWord.charAt(previousWord.length - 1);
    const validStarts = getValidNextSyllables(lastChar, rules.allowInitialSoundRule);
    const userStart = trimmed.charAt(0);
    if (!validStarts.includes(userStart)) {
      return {
        valid: false,
        errorReason: `'${validStarts.join("' 또는 '")}'(으)로 시작하는 단어야 합니다.`,
      };
    }
  }

  if (historyWords.includes(trimmed)) {
    return { valid: false, errorReason: '이미 사용된 단어입니다.' };
  }

  const userMeaning = findLocalMeaning(trimmed);
  const userMeaningText = userMeaning
    ? `${trimmed} : ${userMeaning}`
    : `${trimmed} : 표준 한국어 단어`;

  const aiStartChar = trimmed.charAt(trimmed.length - 1);
  const validAiStarts = getValidNextSyllables(
    aiStartChar,
    rules.allowInitialSoundRule
  );

  let candidates: DictEntry[] = [];
  for (const startSyl of validAiStarts) {
    const list = LOCAL_DICTIONARY[startSyl];
    if (list && Array.isArray(list)) {
      candidates.push(...list);
    }
  }

  candidates = candidates.filter((c) => !historyWords.includes(c.word) && c.word !== trimmed);

  if (rules.wordLengthMode === 'TWO_ONLY') {
    candidates = candidates.filter((c) => c.word.length === 2);
  } else if (rules.wordLengthMode === 'THREE_ONLY') {
    candidates = candidates.filter((c) => c.word.length === 3);
  }

  if (candidates.length === 0) {
    return {
      valid: true,
      userWord: trimmed,
      userWordMeaning: userMeaningText,
      aiWord: null,
      aiWordMeaning: '',
      aiComment: '더 이상 이을 수 있는 표준어가 생각나지 않네요! 당신의 승리입니다! 🎉',
      giveUp: true,
    };
  }

  let matched = candidates.filter((c) => c.level === difficulty);
  if (matched.length === 0) matched = candidates;

  const chosen = matched[Math.floor(Math.random() * matched.length)];
  const aiMeaningText = `${chosen.word} : ${chosen.meaning}`;

  const comments = [
    `'${trimmed}'(이)라는 멋진 단어군요! 저는 '${chosen.word}'(으)로 이어서 받아칩니다.`,
    `'${trimmed}'의 뒤를 이어 '${chosen.word}'(으)로 바로 응수합니다!`,
    `흥미로운 단어 '${trimmed}'입니다. 제 답은 '${chosen.word}'입니다!`,
    `'${trimmed}'을(를) 입력하셨군요! 저는 '${chosen.word}'(으)로 계속 진행해볼게요.`
  ];
  const comment = comments[Math.floor(Math.random() * comments.length)];

  return {
    valid: true,
    userWord: trimmed,
    userWordMeaning: userMeaningText,
    aiWord: chosen.word,
    aiWordMeaning: aiMeaningText,
    aiComment: comment,
    giveUp: false,
  };
}

export function getLocalHints(
  currentSyllable: string,
  allowInitialSoundRule: boolean,
  historyWords: string[]
): HintItem[] {
  const validStarts = getValidNextSyllables(currentSyllable, allowInitialSoundRule);
  let candidates: DictEntry[] = [];
  for (const syl of validStarts) {
    const list = LOCAL_DICTIONARY[syl];
    if (list && Array.isArray(list)) {
      candidates.push(...list);
    }
  }
  candidates = candidates.filter((c) => !historyWords.includes(c.word));

  return candidates.slice(0, 3).map((c) => ({
    word: c.word,
    clue: c.meaning,
  }));
}
