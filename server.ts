import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

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

  // 두음법칙 변환 규칙
  // 녀, 뇨, 뉴, 니 -> 여, 요, 유, 이
  // 랴, 려, 례, 료, 류, 리 -> 야, 여, 예, 요, 유, 이
  // 라, 래, 로, 뢰, 루, 르 -> 나, 내, 노, 뇌, 누, 느
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

// Helper function to find meaning from fallback dictionary
function findMeaningInFallback(word: string): string | null {
  for (const key of Object.keys(FALLBACK_DICTIONARY)) {
    const found = FALLBACK_DICTIONARY[key].find(item => item.word === word);
    if (found && found.meaning) return found.meaning;
  }
  return null;
}

// Built-in Curated Fallback Korean Dictionary (Extensive Real Korean words from Standard Korean Dictionary)
const FALLBACK_DICTIONARY: Record<string, { word: string; meaning: string; level: 'EASY' | 'MEDIUM' | 'HARD' | 'MASTER' }[]> = {
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
  '검': [
    { word: '검도', meaning: '칼을 사용하여 승부를 다투는 격투 무술', level: 'EASY' },
    { word: '검찰', meaning: '범죄를 수사하고 공소를 제기하는 국가 기관', level: 'MEDIUM' },
    { word: '검은색', meaning: '빛이 없는 상태의 어두운 색', level: 'EASY' }
  ],
  '격': [
    { word: '격파', meaning: '부수어 깨뜨림', level: 'MEDIUM' },
    { word: '격려', meaning: '용기나 힘을 북돋워 줌', level: 'MEDIUM' },
    { word: '격언', meaning: '삶의 이치와 교훈을 담은 짧은 말', level: 'HARD' }
  ],
  '견': [
    { word: '견우', meaning: '칠월칠석 설화의 인물', level: 'EASY' },
    { word: '견본', meaning: '물품의 본보기', level: 'MEDIUM' },
    { word: '견문', meaning: '보고 들은 지식과 경험', level: 'HARD' }
  ],
  '결': [
    { word: '결혼', meaning: '남녀가 정식으로 부부 관계를 맺음', level: 'EASY' },
    { word: '결승', meaning: '우승을 가리는 마지막 경기', level: 'EASY' },
    { word: '결단', meaning: '결정을 내리는 의지', level: 'HARD' }
  ],
  '경': [
    { word: '경찰', meaning: '사회 질서를 유지하는 국가 기구', level: 'EASY' },
    { word: '경쟁', meaning: '이기거나 앞서려고 서로 다툼', level: 'EASY' },
    { word: '경치', meaning: '자연의 아름다운 모습', level: 'EASY' },
    { word: '경험', meaning: '자신이 직접 겪은 일이나 지식', level: 'MEDIUM' }
  ],
  '고': [
    { word: '고양이', meaning: '귀여운 소형 포유류', level: 'EASY' },
    { word: '고구마', meaning: '달콤한 덩이뿌리 식물', level: 'EASY' },
    { word: '고래', meaning: '바다에 사는 대형 포유류', level: 'EASY' },
    { word: '고궁', meaning: '옛날의 궁전', level: 'MEDIUM' },
    { word: '고전', meaning: '시대를 뛰어넘어 가치를 인정받는 작품', level: 'HARD' }
  ],
  '곡': [
    { word: '곡식', meaning: '사람이 식량으로 사용하는 벼, 보리, 콩 따위', level: 'EASY' },
    { word: '곡선', meaning: '굽은 선', level: 'EASY' },
    { word: '곡예', meaning: '신체나 도구를 사용하는 기묘한 예술', level: 'MEDIUM' }
  ],
  '공': [
    { word: '공책', meaning: '글씨를 쓸 수 있도록 묶은 종이', level: 'EASY' },
    { word: '공원', meaning: '사람들이 휴식할 수 있도록 꾸민 넓은 정원', level: 'EASY' },
    { word: '공룡', meaning: '중생대에 번성했던 거대한 파충류', level: 'EASY' },
    { word: '공기', meaning: '지구 대기를 구성하는 기체 혼합물', level: 'EASY' }
  ],
  '과': [
    { word: '과자', meaning: '곡식 가루나 설탕으로 만든 먹거리', level: 'EASY' },
    { word: '과일', meaning: '나무에서 얻는 먹는 열매', level: 'EASY' },
    { word: '과학', meaning: '자연 현상을 연구하는 학문', level: 'MEDIUM' },
    { word: '과정', meaning: '일이 일어나는 통로나 절차', level: 'MEDIUM' }
  ],
  '관': [
    { word: '관광', meaning: '경치나 문물을 구경하며 유람함', level: 'EASY' },
    { word: '관찰', meaning: '주의 깊게 살피어 봄', level: 'EASY' },
    { word: '관악기', meaning: '입으로 입김을 불어 소리를 내는 악기', level: 'MEDIUM' }
  ],
  '광': [
    { word: '광장', meaning: '많은 사람이 모일 수 있는 넓은 터', level: 'EASY' },
    { word: '광고', meaning: '상품이나 서비스를 널리 알림', level: 'EASY' },
    { word: '광물', meaning: '지각을 구성하는 자연물', level: 'MEDIUM' }
  ],
  '교': [
    { word: '교실', meaning: '수업이 이루어지는 방', level: 'EASY' },
    { word: '교과서', meaning: '학교에서 사용하는 규정 교재', level: 'EASY' },
    { word: '교통', meaning: '사람이나 화물이 오가는 일', level: 'MEDIUM' },
    { word: '교양', meaning: '학식과 사회적 예의', level: 'MEDIUM' }
  ],
  '구': [
    { word: '구름', meaning: '하늘에 떠 있는 수증기 덩어리', level: 'EASY' },
    { word: '구두', meaning: '가죽으로 만든 신발', level: 'EASY' },
    { word: '구조', meaning: '위급한 상황에서 건져냄', level: 'MEDIUM' },
    { word: '구슬', meaning: '둥글고 투명한 유리나 돌', level: 'EASY' }
  ],
  '국': [
    { word: '국수', meaning: '밀가루나 메밀 따위로 만든 면', level: 'EASY' },
    { word: '국가', meaning: '나라', level: 'EASY' },
    { word: '국민', meaning: '국가를 구성하는 사람', level: 'MEDIUM' },
    { word: '국채', meaning: '국가가 발행하는 채권', level: 'HARD' }
  ],
  '군': [
    { word: '군대', meaning: '국가를 방위하는 군사 조직', level: 'EASY' },
    { word: '군함', meaning: '해군이 쓰는 전투용 배', level: 'EASY' },
    { word: '군중', meaning: '수많은 사람의 무리', level: 'MEDIUM' }
  ],
  '궁': [
    { word: '궁궐', meaning: '임금이 거주하며 정무를 보던 집', level: 'EASY' },
    { word: '궁금증', meaning: '궁금하게 여기는 마음', level: 'EASY' },
    { word: '궁지', meaning: '막다른 매우 어려운 상황', level: 'HARD' }
  ],
  '권': [
    { word: '권투', meaning: '주먹에 글러브를 끼고 승부를 다투는 스포츠', level: 'EASY' },
    { word: '권력', meaning: '남을 복종시키는 국가적 지배력', level: 'MEDIUM' },
    { word: '권장', meaning: '권하고 장려함', level: 'MEDIUM' }
  ],
  '귀': [
    { word: '귀걸이', meaning: '귀에 거는 장신구', level: 'EASY' },
    { word: '귀가', meaning: '집으로 돌아감', level: 'EASY' },
    { word: '귀족', meaning: '특권적 신분을 가진 사람', level: 'MEDIUM' }
  ],
  '규': [
    { word: '규칙', meaning: '지켜야 할 약속이나 규정', level: 'EASY' },
    { word: '규모', meaning: '사물의 크기나 범위', level: 'MEDIUM' },
    { word: '규범', meaning: '행동의 기준이 되는 매뉴얼', level: 'HARD' }
  ],
  '극': [
    { word: '극장', meaning: '영화나 연극을 상영하는 장소', level: 'EASY' },
    { word: '극락', meaning: '불교에서 괴로움이 없는 평화로운 곳', level: 'MEDIUM' },
    { word: '극복', meaning: '어려움을 참아내어 이김', level: 'MEDIUM' }
  ],
  '근': [
    { word: '근육', meaning: '수축 운동을 담당하는 동물 조직', level: 'EASY' },
    { word: '근면', meaning: '부지런하고 성실함', level: 'MEDIUM' },
    { word: '근거', meaning: '어떤 판단이나 의견의 바탕', level: 'HARD' }
  ],
  '글': [
    { word: '글자', meaning: '말을 적는 기호', level: 'EASY' },
    { word: '글짓기', meaning: '글을 새로 작성함', level: 'EASY' },
    { word: '글로벌', meaning: '세계적인 범위', level: 'MEDIUM' }
  ],
  '금': [
    { word: '금메달', meaning: '우승자에게 주는 금빛 메달', level: 'EASY' },
    { word: '금요일', meaning: '목요일 다음 날', level: 'EASY' },
    { word: '금액', meaning: '돈의 수량', level: 'EASY' },
    { word: '금기', meaning: '마땅히 피하여 하지 아니함', level: 'HARD' }
  ],
  '기': [
    { word: '기차', meaning: '철도를 따라 달리는 수송 차량', level: 'EASY' },
    { word: '기분', meaning: '마음의 상태', level: 'EASY' },
    { word: '기억', meaning: '지난 일을 잊지 않고 상념함', level: 'MEDIUM' },
    { word: '기상', meaning: '대기 상태나 아침에 일어남', level: 'EASY' }
  ],
  '길': [
    { word: '길거리', meaning: '사람이 오가는 길', level: 'EASY' },
    { word: '길이', meaning: '한쪽 끝에서 다른 쪽 끝까지의 거리', level: 'EASY' },
    { word: '길잡이', meaning: '길을 안내해 주는 사람', level: 'MEDIUM' }
  ],
  '김': [
    { word: '김치', meaning: '발효시켜 만드는 한국의 대표 음식', level: 'EASY' },
    { word: '김밥', meaning: '김에 밥과 여러 재료를 말아 만든 음식', level: 'EASY' }
  ],
  '나': [
    { word: '나무', meaning: '줄기나 가지가 목질로 된 다년생 식물', level: 'EASY' },
    { word: '나비', meaning: '나비목에 속하는 곤충', level: 'EASY' },
    { word: '낙엽', meaning: '나무에서 떨어지는 잎', level: 'EASY' },
    { word: '나침반', meaning: '방위를 나타내는 자침이 있는 도구', level: 'MEDIUM' },
    { word: '낙원', meaning: '근심 없이 살 수 있는 평화로운 곳', level: 'MEDIUM' }
  ],
  '낙': [
    { word: '낙엽', meaning: '나무에서 떨어져 내리는 잎', level: 'EASY' },
    { word: '낙타', meaning: '등에 혹이 있는 사막 포유류', level: 'EASY' },
    { word: '낙서', meaning: '아무렇게나 글이나 그림을 그림', level: 'EASY' }
  ],
  '난': [
    { word: '난로', meaning: '방 안을 따뜻하게 데우는 기구', level: 'EASY' },
    { word: '난초', meaning: '아름다운 꽃과 향을 지닌 식물', level: 'EASY' },
    { word: '난타', meaning: '마구 두드림', level: 'MEDIUM' }
  ],
  '날': [
    { word: '날씨', meaning: '대기의 상태', level: 'EASY' },
    { word: '날개', meaning: '새나 곤충의 공중 비행 기관', level: 'EASY' },
    { word: '날짜', meaning: '해와 달과 날의 수', level: 'EASY' }
  ],
  '남': [
    { word: '남극', meaning: '지구의 최남단 대륙', level: 'EASY' },
    { word: '남산', meaning: '서울 한복판의 산', level: 'EASY' },
    { word: '남녀', meaning: '남자여자의 총칭', level: 'EASY' }
  ],
  '내': [
    { word: '내일', meaning: '오늘의 바로 다음 날', level: 'EASY' },
    { word: '내용', meaning: '글이나 말 속에 담긴 뜻', level: 'EASY' },
    { word: '내구성', meaning: '오랫동안 견디는 성질', level: 'MEDIUM' },
    { word: '내과', meaning: '약물 치료를 주로 하는 의학 분야', level: 'EASY' }
  ],
  '노': [
    { word: '노래', meaning: '가사에 음률을 붙여 부름', level: 'EASY' },
    { word: '노트', meaning: '글씨를 적는 책', level: 'EASY' },
    { word: '노을', meaning: '해 뜰 때나 해 질 때 하늘이 붉게 보이는 현상', level: 'EASY' }
  ],
  '녹': [
    { word: '녹차', meaning: '차나무의 어린 잎을 우려낸 차', level: 'EASY' },
    { word: '녹색', meaning: '풀빛의 초록색', level: 'EASY' },
    { word: '녹음', meaning: '소리를 기록 매체에 담음', level: 'MEDIUM' }
  ],
  '논': [
    { word: '논밭', meaning: '벼를 심는 논과 곡식을 심는 밭', level: 'EASY' },
    { word: '논리', meaning: '생각을 이치에 맞게 풀어가는 과정', level: 'MEDIUM' },
    { word: '논술', meaning: '의견을 논리적으로 서술함', level: 'MEDIUM' }
  ],
  '농': [
    { word: '농구', meaning: '공을 링에 넣어 득점하는 구기 종목', level: 'EASY' },
    { word: '농부', meaning: '농사를 짓는 사람', level: 'EASY' },
    { word: '농업', meaning: '땅을 이용하여 농작물을 재배함', level: 'MEDIUM' }
  ],
  '뇌': [
    { word: '뇌수술', meaning: '뇌를 치료하는 의학적 수술', level: 'MEDIUM' },
    { word: '뇌리', meaning: '마음속이나 기억의 깊은 곳', level: 'HARD' }
  ],
  '누': [
    { word: '누나', meaning: '남자가 손위 누이를 부르는 말', level: 'EASY' },
    { word: '누에', meaning: '비단을 만드는 누에나방의 애벌레', level: 'EASY' }
  ],
  '눈': [
    { word: '눈사람', meaning: '눈을 뭉쳐 만든 사람 모양', level: 'EASY' },
    { word: '눈물', meaning: '눈에서 나오는 액체', level: 'EASY' },
    { word: '눈동자', meaning: '눈알 가운데의 움직이는 부분', level: 'EASY' }
  ],
  '능': [
    { word: '능력', meaning: '어떤 일을 해낼 수 있는 힘', level: 'EASY' },
    { word: '능금', meaning: '사과나무의 열매', level: 'MEDIUM' },
    { word: '능률', meaning: '일의 작업 효율', level: 'MEDIUM' }
  ],
  '다': [
    { word: '다람쥐', meaning: '다람줏과의 조그마한 포유류', level: 'EASY' },
    { word: '다리', meaning: '몸통 아래쪽 기관 또는 건너는 구조물', level: 'EASY' },
    { word: '단풍', meaning: '가을 나뭇잎 변색 현상', level: 'EASY' },
    { word: '다도', meaning: '차를 끓여 마시는 예의범절', level: 'MEDIUM' }
  ],
  '단': [
    { word: '단어', meaning: '뜻을 가지고 홀로 쓰일 수 있는 말의 단위', level: 'EASY' },
    { word: '단짝', meaning: '아주 친하게 지내는 친구', level: 'EASY' },
    { word: '단결', meaning: '여럿이 마음을 하나로 뭉침', level: 'MEDIUM' }
  ],
  '달': [
    { word: '달력', meaning: '날짜나 절기를 적어 놓은 표', level: 'EASY' },
    { word: '달리기', meaning: '다리를 빨리 움직여 달려가는 일', level: 'EASY' },
    { word: '달팽이', meaning: '껍데기를 등에 지고 다니는 연체동물', level: 'EASY' }
  ],
  '담': [
    { word: '담담함', meaning: '차분하고 평온함', level: 'MEDIUM' },
    { word: '담요', meaning: '따뜻하게 덮는 두꺼운 모직 천', level: 'EASY' },
    { word: '담벼락', meaning: '집의 둘레를 막아 쌓은 벽', level: 'EASY' }
  ],
  '당': [
    { word: '당근', meaning: '주황색 뿌리를 식용하는 채소', level: 'EASY' },
    { word: '당구', meaning: '큐로 공을 쳐서 승부를 다투는 경기', level: 'EASY' },
    { word: '당당함', meaning: '태도나 모습이 기운차고 우뚝함', level: 'MEDIUM' }
  ],
  '대': [
    { word: '대통령', meaning: '민주국가의 최고 통치권자', level: 'EASY' },
    { word: '대나무', meaning: '줄기가 곧고 마디가 있는 벼과 식물', level: 'EASY' },
    { word: '대화', meaning: '마주 이야기함', level: 'EASY' },
    { word: '대륙', meaning: '지구상의 매우 넓은 육지', level: 'MEDIUM' }
  ],
  '덕': [
    { word: '덕담', meaning: '새해 등에 잘되기를 비는 덕스러운 말', level: 'EASY' },
    { word: '덕목', meaning: '도덕적 행위의 기준', level: 'HARD' }
  ],
  '도': [
    { word: '도서관', meaning: '책을 소장하여 읽을 수 있게 한 장소', level: 'EASY' },
    { word: '도로', meaning: '차나 사람이 다닐 수 있게 만든 길', level: 'EASY' },
    { word: '도자기', meaning: '흙을 구워 만든 그릇', level: 'EASY' },
    { word: '도전', meaning: '어려운 일에 시도함', level: 'EASY' }
  ],
  '독': [
    { word: '독서', meaning: '책을 읽음', level: 'EASY' },
    { word: '독수리', meaning: '수릿과의 커다란 맹금류', level: 'EASY' },
    { word: '독창성', meaning: '남을 따르지 않고 새로이 짓는 성질', level: 'MEDIUM' }
  ],
  '돈': [
    { word: '돈가스', meaning: '돼지고기를 튀겨 만든 요리', level: 'EASY' },
    { word: '돈사', meaning: '돼지를 키우는 우리', level: 'MEDIUM' }
  ],
  '동': [
    { word: '동물', meaning: '움직이는 생물', level: 'EASY' },
    { word: '동화', meaning: '어린이를 위한 이야기', level: 'EASY' },
    { word: '동전', meaning: '금속으로 만든 화폐', level: 'EASY' },
    { word: '동굴', meaning: '땅속이나 바위에 뚫린 파인 굴', level: 'EASY' }
  ],
  '두': [
    { word: '두부', meaning: '콩물에 간수를 넣어 굳힌 음식', level: 'EASY' },
    { word: '두건', meaning: '머리에 쓰는 천', level: 'EASY' },
    { word: '두뇌', meaning: '생각하고 가늠하는 뇌의 작용', level: 'MEDIUM' }
  ],
  '득': [
    { word: '득점', meaning: '점수를 얻음', level: 'EASY' },
    { word: '득통', meaning: '매우 크게 깨달음', level: 'HARD' }
  ],
  '들': [
    { word: '들판', meaning: '넓게 펼쳐진 들', level: 'EASY' },
    { word: '들꽃', meaning: '들판에 절로 피는 꽃', level: 'EASY' },
    { word: '들국화', meaning: '야생 국화의 총칭', level: 'EASY' }
  ],
  '등': [
    { word: '등산', meaning: '산에 올라감', level: 'EASY' },
    { word: '등대', meaning: '바다의 배에 불빛을 비추는 탑', level: 'EASY' },
    { word: '등불', meaning: '등잔에 켜놓은 불', level: 'EASY' }
  ],
  '라': [
    { word: '라면', meaning: '국수를 튀겨 만든 간편식', level: 'EASY' },
    { word: '라디오', meaning: '전파로 소리를 수신하는 방송 매체', level: 'EASY' },
    { word: '라이벌', meaning: '같은 목적을 놓고 다투는 경쟁 상대', level: 'MEDIUM' },
    { word: '낙타', meaning: '등에 혹이 있는 사막 포유류 (두음법칙)', level: 'MEDIUM' }
  ],
  '락': [
    { word: '낙원', meaning: '행복하고 평화로운 곳 (두음법칙)', level: 'MEDIUM' },
    { word: '낙타', meaning: '등에 혹이 있는 사막 동물 (두음법칙)', level: 'EASY' }
  ],
  '란': [
    { word: '난초', meaning: '아름다운 외형의 다년생 화초 (두음법칙)', level: 'EASY' },
    { word: '난로', meaning: '방을 데우는 난방 장치 (두음법칙)', level: 'EASY' }
  ],
  '람': [
    { word: '남극', meaning: '지구의 최남단 대륙 (두음법칙)', level: 'EASY' }
  ],
  '랑': [
    { word: '낭만', meaning: '실속에 매이지 않는 감상적 분위기 (두음법칙)', level: 'MEDIUM' }
  ],
  '래': [
    { word: '내일', meaning: '오늘의 다음 날 (두음법칙)', level: 'EASY' },
    { word: '내과', meaning: '약물 치료 의학 (두음법칙)', level: 'EASY' }
  ],
  '량': [
    { word: '양말', meaning: '발에 신는 수공품 (두음법칙)', level: 'EASY' },
    { word: '양파', meaning: '비늘줄기를 식용하는 채소 (두음법칙)', level: 'EASY' }
  ],
  '려': [
    { word: '여름', meaning: '봄과 가을 사이의 사계절 (두음법칙)', level: 'EASY' },
    { word: '여행', meaning: '다른 지역을 유람함 (두음법칙)', level: 'EASY' }
  ],
  '력': [
    { word: '역사', meaning: '인류 사회의 변천 과정 (두음법칙)', level: 'EASY' },
    { word: '역기', meaning: '무게를 달아 들어올리는 운동 기구 (두음법칙)', level: 'EASY' }
  ],
  '련': [
    { word: '연필', meaning: '흑연 필기구 (두음법칙)', level: 'EASY' },
    { word: '연못', meaning: '물이 고인 작고 깊은 우물 (두음법칙)', level: 'EASY' }
  ],
  '령': [
    { word: '영웅', meaning: '뛰어난 인물 (두음법칙)', level: 'EASY' },
    { word: '영화', meaning: '스크린 종합 예술 (두음법칙)', level: 'EASY' }
  ],
  '로': [
    { word: '노래', meaning: '가사에 가락을 붙여 부름 (두음법칙)', level: 'EASY' },
    { word: '노을', meaning: '해질녘 하늘의 붉은 빛 (두음법칙)', level: 'EASY' },
    { word: '로봇', meaning: '자동 작업을 수행하는 전자 기계', level: 'EASY' }
  ],
  '록': [
    { word: '녹차', meaning: '우려 마시는 푸른 찻잎 (두음법칙)', level: 'EASY' },
    { word: '녹화', meaning: '영상을 매체에 기록함 (두음법칙)', level: 'MEDIUM' }
  ],
  '론': [
    { word: '논리', meaning: '생각의 이치 (두음법칙)', level: 'MEDIUM' },
    { word: '논문', meaning: '학술적 주제를 탐구한 글 (두음법칙)', level: 'MEDIUM' }
  ],
  '루': [
    { word: '누나', meaning: '남자의 손위 여자 형제 (두음법칙)', level: 'EASY' },
    { word: '루비', meaning: '붉은빛의 투명한 보석', level: 'EASY' }
  ],
  '류': [
    { word: '유리', meaning: '투명하고 단단하며 잘 깨지는 물질 (두음법칙)', level: 'EASY' },
    { word: '유치원', meaning: '어린이 교육 기관 (두음법칙)', level: 'EASY' }
  ],
  '마': [
    { word: '마음', meaning: '생각, 감정, 의지가 일어나는 곳', level: 'EASY' },
    { word: '마늘', meaning: '강한 향과 매운맛이 있는 양념 재료', level: 'EASY' },
    { word: '마을', meaning: '사람들이 모여 사는 작은 동네', level: 'EASY' },
    { word: '마술', meaning: '기이한 현상을 보여주는 예술', level: 'EASY' }
  ],
  '막': [
    { word: '막걸리', meaning: '한국의 전통 쌀 찌게 술', level: 'EASY' },
    { word: '막대기', meaning: '길고 가느다란 나무토막', level: 'EASY' }
  ],
  '만': [
    { word: '만화', meaning: '그림과 글로 이야기를 전하는 매체', level: 'EASY' },
    { word: '만두', meaning: '밀가루 피에 소를 넣어 찌거나 튀긴 음식', level: 'EASY' },
    { word: '만세', meaning: '기쁨을 나타내는 환호', level: 'EASY' }
  ],
  '말': [
    { word: '말하기', meaning: '입으로 생각을 표현함', level: 'EASY' },
    { word: '말풍선', meaning: '만화에서 대사를 적는 풍선 모양', level: 'EASY' }
  ],
  '매': [
    { word: '매화', meaning: '매화나무의 아름다운 꽃', level: 'EASY' },
    { word: '매점', meaning: '물건이나 먹거리를 파는 작은 가게', level: 'EASY' },
    { word: '매표소', meaning: '표를 파는 창구', level: 'EASY' }
  ],
  '면': [
    { word: '면발', meaning: '국수나 라면 따위의 가닥', level: 'EASY' },
    { word: '면접', meaning: '인성을 살피기 위해 마주앉아 질문함', level: 'MEDIUM' }
  ],
  '명': [
    { word: '명사', meaning: '사물의 이름을 나타내는 품사', level: 'EASY' },
    { word: '명절', meaning: '해마다 전통적으로 지니어 오는 경사스러운 날', level: 'EASY' },
    { word: '명함', meaning: '성명, 직업, 주소 따위를 적은 종이', level: 'EASY' },
    { word: '명작', meaning: '아주 뛰어난 작품', level: 'MEDIUM' }
  ],
  '모': [
    { word: '모자', meaning: '머리에 쓰는 의류', level: 'EASY' },
    { word: '모래', meaning: '암석이 깎여 만들어진 자잘한 알갱이', level: 'EASY' },
    { word: '모험', meaning: '위험을 무릅쓰고 감행함', level: 'EASY' }
  ],
  '목': [
    { word: '목걸이', meaning: '목에 거는 장신구', level: 'EASY' },
    { word: '목요일', meaning: '수요일 다음 날', level: 'EASY' },
    { word: '목수', meaning: '나무로 집이나 물건을 만드는 사람', level: 'EASY' }
  ],
  '무': [
    { word: '무지개', meaning: '공기 중 수증기에 빛이 반사되어 나타나는 일곱 색깔 띠', level: 'EASY' },
    { word: '무대', meaning: '연극이나 공연이 벌어지는 장소', level: 'EASY' },
    { word: '무용', meaning: '신체 운동으로 감정을 표현하는 예술', level: 'EASY' }
  ],
  '문': [
    { word: '문장', meaning: '생각이나 감정을 완결되게 나타낸 글의 단위', level: 'EASY' },
    { word: '문학', meaning: '언어를 전달 매체로 하는 예술 작품', level: 'MEDIUM' },
    { word: '문방구', meaning: '학용품을 파는 가게', level: 'EASY' }
  ],
  '물': [
    { word: '물고기', meaning: '물에 사는 척삭동물', level: 'EASY' },
    { word: '물건', meaning: '형체가 있는 온갖 것', level: 'EASY' },
    { word: '물방울', meaning: '둥글게 뭉친 물 덩어리', level: 'EASY' }
  ],
  '미': [
    { word: '미소', meaning: '소리 없이 소박하게 웃음', level: 'EASY' },
    { word: '미술', meaning: '시각적 시도를 통한 예술', level: 'EASY' },
    { word: '미래', meaning: '앞으로 올 시간', level: 'EASY' }
  ],
  '민': [
    { word: '민속놀이', meaning: '민간에서 옛부터 전해 내려오는 놀이', level: 'EASY' },
    { word: '민들레', meaning: '노란 꽃이 피는 국화과 식물', level: 'EASY' }
  ],
  '바': [
    { word: '바다', meaning: '소금물이 채워진 넓은 영역', level: 'EASY' },
    { word: '바나나', meaning: '노란색 껍질의 달콤한 과일', level: 'EASY' },
    { word: '바람', meaning: '공기의 이동 현상', level: 'EASY' },
    { word: '바둑', meaning: '판 위에서 영역을 다투는 게임', level: 'MEDIUM' }
  ],
  '박': [
    { word: '박물관', meaning: '고고학 자원이나 예술품을 진열하는 장소', level: 'EASY' },
    { word: '박수', meaning: '두 손뼉을 마주쳐 소리를 냄', level: 'EASY' }
  ],
  '반': [
    { word: '반지', meaning: '손가락에 끼는 고리 모양 장신구', level: 'EASY' },
    { word: '반달', meaning: '활 모양의 활처럼 휜 달', level: 'EASY' },
    { word: '반장', meaning: '학급을 대표하는 사람', level: 'EASY' }
  ],
  '발': [
    { word: '발자국', meaning: '발로 밟은 자리에 남는 자국', level: 'EASY' },
    { word: '발명', meaning: '새로운 기술이나 물건을 만들어 냄', level: 'EASY' }
  ],
  '방': [
    { word: '방학', meaning: '학교 따위에서 일정 기간 수업을 쉬는 일', level: 'EASY' },
    { word: '방문', meaning: '다른 곳을 찾아가서 만남', level: 'EASY' },
    { word: '방향', meaning: '나아가는 쪽이나 가리키는 쪽', level: 'MEDIUM' }
  ],
  '배': [
    { word: '배구', meaning: '네트를 사이에 두고 공을 쳐넘기는 스포츠', level: 'EASY' },
    { word: '배우', meaning: '연극이나 영화에서 연기하는 사람', level: 'EASY' }
  ],
  '백': [
    { word: '백화점', meaning: '여러 물품을 부문별로 파는 대형 상점', level: 'EASY' },
    { word: '백조', meaning: '오릿과의 하얀 새', level: 'EASY' }
  ],
  '버': [
    { word: '버스', meaning: '승객을 태우고 고정 경로를 운행하는 대형 차', level: 'EASY' },
    { word: '버섯', meaning: '균류가 형성하는 자실체', level: 'EASY' }
  ],
  '번': [
    { word: '번개', meaning: '구름과 구름 사이의 방전 현상', level: 'EASY' },
    { word: '번역', meaning: '다른 언어로 옮겨 적음', level: 'MEDIUM' }
  ],
  '벌': [
    { word: '벌꿀', meaning: '꿀벌이 꽃에서 채집한 단맛의 액체', level: 'EASY' },
    { word: '벌판', meaning: '넓고 평평하게 탁 트인 들판', level: 'EASY' }
  ],
  '법': [
    { word: '법률', meaning: '국가의 권력에 의하여 제정된 사회 규범', level: 'MEDIUM' },
    { word: '법원', meaning: '재판을 담당하는 국가 기관', level: 'MEDIUM' }
  ],
  '벽': [
    { word: '벽지', meaning: '방의 벽에 붙이는 도배 종이', level: 'EASY' },
    { word: '벽화', meaning: '벽면에 그린 그림', level: 'MEDIUM' }
  ],
  '변': [
    { word: '변호사', meaning: '소송을 대리하거나 법률 상담을 하는 전문가', level: 'EASY' },
    { word: '변화', meaning: '상태나 모양이 바뀌어 달라짐', level: 'MEDIUM' }
  ],
  '보': [
    { word: '보석', meaning: '광물 중 아름답고 희귀하여 가치 있는 돌', level: 'EASY' },
    { word: '보름달', meaning: '둥글고 가득 찬 형태의 달', level: 'EASY' }
  ],
  '복': [
    { word: '복숭아', meaning: '복사나무의 달콤한 열매', level: 'EASY' },
    { word: '복도', meaning: '방과 방 사이를 잇는 통로', level: 'EASY' }
  ],
  '부': [
    { word: '부채', meaning: '바람을 일으키는 손도구', level: 'EASY' },
    { word: '부엉이', meaning: '올빼밋과의 밤에 활동하는 새', level: 'EASY' }
  ],
  '북': [
    { word: '북극', meaning: '지구의 최북단 지역', level: 'EASY' },
    { word: '북소리', meaning: '북을 쳐서 나는 울림 소리', level: 'EASY' }
  ],
  '분': [
    { word: '분홍색', meaning: '붉은빛과 하얀빛이 섞인 고운 색', level: 'EASY' },
    { word: '분수', meaning: '물이 관을 타고 높이 뿜어져 나오는 시설', level: 'EASY' }
  ],
  '불': [
    { word: '불꽃', meaning: '타오르는 불의 혀 모양 빛', level: 'EASY' },
    { word: '불고기', meaning: '양념에 재워 구운 고기 요리', level: 'EASY' }
  ],
  '비': [
    { word: '비행기', meaning: '하늘을 나는 수송 기구', level: 'EASY' },
    { word: '비누', meaning: '몸이나 세탁물을 씻는 물건', level: 'EASY' },
    { word: '비밀', meaning: '남에게 알리지 않는 일', level: 'MEDIUM' }
  ],
  '사': [
    { word: '사과', meaning: '사과나무의 달콤한 열매', level: 'EASY' },
    { word: '사자', meaning: '대형 고양잇과 동물', level: 'EASY' },
    { word: '사랑', meaning: '대상을 아끼고 좋아하는 감정', level: 'EASY' },
    { word: '사탕', meaning: '설탕을 녹여 단단하게 굳힌 과자', level: 'EASY' },
    { word: '사자성어', meaning: '한자 네 글자로 이루어진 교훈의 말', level: 'HARD' }
  ],
  '산': [
    { word: '산책', meaning: '휴식을 위해 천천히 걷는 일', level: 'EASY' },
    { word: '산길', meaning: '산속에 난 길', level: 'EASY' },
    { word: '산림', meaning: '산과 숲', level: 'MEDIUM' }
  ],
  '상': [
    { word: '상자', meaning: '물건을 담는 네모난 그릇', level: 'EASY' },
    { word: '상상', meaning: '실제로 없는 일을 마음속으로 그려 봄', level: 'MEDIUM' },
    { word: '상점', meaning: '물건을 파는 가게', level: 'EASY' }
  ],
  '새': [
    { word: '새싹', meaning: '새로 돋아나는 싹', level: 'EASY' },
    { word: '새벽', meaning: '해가 뜨기 직전의 어스름한 때', level: 'EASY' }
  ],
  '색': [
    { word: '색연필', meaning: '다양한 색깔 물감이 든 필기구', level: 'EASY' },
    { word: '색종이', meaning: '색깔이 칠해진 수공예 종이', level: 'EASY' }
  ],
  '생': [
    { word: '생일', meaning: '태어난 날', level: 'EASY' },
    { word: '생물', meaning: '생명을 가진 모든 존재', level: 'EASY' }
  ],
  '서': [
    { word: '서점', meaning: '책을 판매하는 상점', level: 'EASY' },
    { word: '서랍', meaning: '가구에 달린 끌어당겨 열고 닫는 함', level: 'EASY' }
  ],
  '석': [
    { word: '석양', meaning: '저녁에 지는 해', level: 'EASY' },
    { word: '석탄', meaning: '땅속에서 파내는 고체 연료', level: 'EASY' }
  ],
  '선': [
    { word: '선생님', meaning: '학생을 가르치는 사람', level: 'EASY' },
    { word: '선풍기', meaning: '바람을 일으키는 가전제품', level: 'EASY' },
    { word: '선물', meaning: '남에게 마음을 담아 주는 물건', level: 'EASY' }
  ],
  '설': [
    { word: '설탕', meaning: '사탕수수나 사탕무에서 얻은 단맛이 나는 가루', level: 'EASY' },
    { word: '설날', meaning: '음력 1월 1일 한국의 전통 명절', level: 'EASY' },
    { word: '설명', meaning: '어떤 내용을 상대방이 이해하기 쉽게 풀어서 밝힘', level: 'EASY' }
  ],
  '성': [
    { word: '성공', meaning: '목적을 이룸', level: 'EASY' },
    { word: '성곽', meaning: '성을 둘러 쌓은 벽', level: 'MEDIUM' }
  ],
  '세': [
    { word: '세계', meaning: '지구상의 모든 나라와 인류', level: 'EASY' },
    { word: '세탁기', meaning: '빨래를 자동으로 해 주는 가전제품', level: 'EASY' },
    { word: '세월', meaning: '흘러가는 시간과 날들', level: 'MEDIUM' }
  ],
  '소': [
    { word: '소나무', meaning: '상록 침엽 교목', level: 'EASY' },
    { word: '소리', meaning: '진동이 귀에 전달되는 현상', level: 'EASY' },
    { word: '소방관', meaning: '화재를 진압하는 직업인', level: 'EASY' }
  ],
  '수': [
    { word: '수박', meaning: '여름에 먹는 시원한 과일', level: 'EASY' },
    { word: '수영장', meaning: '헤엄을 칠 수 있게 만든 물못', level: 'EASY' },
    { word: '수학', meaning: '수와 양 및 공간을 다루는 학문', level: 'EASY' }
  ],
  '숙': [
    { word: '숙제', meaning: '학생이 집에서 해 오도록 내주는 과제', level: 'EASY' },
    { word: '숙소', meaning: '잠을 자고 머무르는 장소', level: 'EASY' }
  ],
  '순': [
    { word: '순수함', meaning: '사사로운 사심이나 더러움이 없는 상태', level: 'EASY' },
    { word: '순서', meaning: '차례나 차례의 배열', level: 'EASY' }
  ],
  '숲': [
    { word: '숲속', meaning: '숲의 안쪽 깊은 곳', level: 'EASY' },
    { word: '숲길', meaning: '숲 사이로 난 오솔길', level: 'EASY' }
  ],
  '시': [
    { word: '시계', meaning: '시각을 나타내는 기구', level: 'EASY' },
    { word: '시민', meaning: '도시의 구성원', level: 'EASY' },
    { word: '시골', meaning: '도시에서 떨어진 지방', level: 'EASY' }
  ],
  '식': [
    { word: '식물', meaning: '광합성을 하는 생물', level: 'EASY' },
    { word: '식사', meaning: '음식을 먹음', level: 'EASY' }
  ],
  '신': [
    { word: '신발', meaning: '발에 신는 물건', level: 'EASY' },
    { word: '신문', meaning: '뉴스를 발행하는 정기 간행물', level: 'EASY' },
    { word: '신호등', meaning: '교통 신호를 나타내는 등', level: 'EASY' }
  ],
  '실': [
    { word: '실타래', meaning: '실을 뭉쳐 놓은 것', level: 'EASY' },
    { word: '실내', meaning: '건물의 안쪽 공간', level: 'EASY' },
    { word: '실천', meaning: '생각한 바를 실제로 행동함', level: 'MEDIUM' }
  ],
  '아': [
    { word: '아침', meaning: '해가 떠올라 낮이 되기 전까지의 시간', level: 'EASY' },
    { word: '아이', meaning: '나이가 어린 사람', level: 'EASY' },
    { word: '아파트', meaning: '공동 주택의 대표적 형태', level: 'EASY' },
    { word: '아름다움', meaning: '큰 기쁨과 감동을 주는 상태', level: 'MEDIUM' }
  ],
  '악': [
    { word: '악기', meaning: '음악을 연주하는 도구', level: 'EASY' },
    { word: '악수', meaning: '서로 손을 잡고 인사함', level: 'EASY' }
  ],
  '안': [
    { word: '안경', meaning: '시력을 보정하거나 눈을 보호하는 안경렌즈 도구', level: 'EASY' },
    { word: '안개', meaning: '지표면 근처에 수증기가 맺혀 희미하게 보이는 현상', level: 'EASY' }
  ],
  '야': [
    { word: '야구', meaning: '방망이로 공을 쳐서 달리는 구기 스포츠', level: 'EASY' },
    { word: '야채', meaning: '채소', level: 'EASY' }
  ],
  '약': [
    { word: '약국', meaning: '약을 조제하고 파는 곳', level: 'EASY' },
    { word: '약속', meaning: '서로 어떤 일을 하기로 다짐함', level: 'EASY' }
  ],
  '양': [
    { word: '양말', meaning: '발에 신는 섬유 제품', level: 'EASY' },
    { word: '양파', meaning: '비늘줄기를 먹는 채소', level: 'EASY' },
    { word: '양초', meaning: '파라핀 따위로 만든 불을 밝히는 초', level: 'EASY' }
  ],
  '어': [
    { word: '어린이', meaning: '나이가 어린 아이', level: 'EASY' },
    { word: '어머니', meaning: '자신을 낳아 준 여성 부모', level: 'EASY' },
    { word: '어깨', meaning: '목과 팔 사이의 신체 부위', level: 'EASY' }
  ],
  '언': [
    { word: '언어', meaning: '생각을 전달하는 말이나 문자', level: 'EASY' },
    { word: '언덕', meaning: '나지막하게 솟아오른 땅', level: 'EASY' }
  ],
  '여': [
    { word: '여름', meaning: '봄과 가을 사이의 따뜻한 계절', level: 'EASY' },
    { word: '여행', meaning: '다른 지방이나 나라를 다녀오는 일', level: 'EASY' },
    { word: '여우', meaning: '개과의 야생 포유류', level: 'EASY' }
  ],
  '역': [
    { word: '역사', meaning: '인류 사회의 변천 과정', level: 'EASY' },
    { word: '역전', meaning: '형세나 승부를 반대로 뒤집음', level: 'EASY' }
  ],
  '연': [
    { word: '연필', meaning: '글씨를 쓰는 필기구', level: 'EASY' },
    { word: '연못', meaning: '물이 고여 있는 작고 넓은 웅덩이', level: 'EASY' },
    { word: '연극', meaning: '무대에서 연기하는 예술', level: 'MEDIUM' }
  ],
  '영': [
    { word: '영화', meaning: '영상을 스크린에 투사하는 종합 예술', level: 'EASY' },
    { word: '영웅', meaning: '지혜나 용맹이 뛰어난 사람', level: 'EASY' },
    { word: '영양', meaning: '생물이 생명을 유지하기 위해 취하는 영양소', level: 'MEDIUM' }
  ],
  '오': [
    { word: '오렌지', meaning: '감귤류의 주황색 달콤한 과일', level: 'EASY' },
    { word: '오리', meaning: '오릿과의 물새', level: 'EASY' },
    { word: '오후', meaning: '정오부터 밤까지의 시간', level: 'EASY' }
  ],
  '우': [
    { word: '우산', meaning: '비나 눈을 막기 위해 펴는 도구', level: 'EASY' },
    { word: '우주', meaning: '지구를 포함한 천체와 모든 공간', level: 'EASY' },
    { word: '우정', meaning: '친구 사이의 따뜻한 정', level: 'EASY' },
    { word: '우체국', meaning: '우편물을 받아 배달하는 기관', level: 'EASY' }
  ],
  '원': [
    { word: '원숭이', meaning: '영장목 영장류 동물의 총칭', level: 'EASY' },
    { word: '원피스', meaning: '상의와 하의가 하나로 된 옷', level: 'EASY' },
    { word: '원인', meaning: '어떤 결과를 일으키는 사유', level: 'MEDIUM' }
  ],
  '유': [
    { word: '유리', meaning: '투명하고 단단한 물질', level: 'EASY' },
    { word: '유치원', meaning: '어린이를 가르치는 교육 기관', level: 'EASY' },
    { word: '유물', meaning: '조상들이 남긴 역사적 물건', level: 'MEDIUM' }
  ],
  '윤': [
    { word: '윤리', meaning: '사람으로서 마땅히 행해야 할 도리', level: 'MEDIUM' }
  ],
  '은': [
    { word: '은혜', meaning: '고맙게 입은 혜택이나 덕', level: 'EASY' },
    { word: '은메달', meaning: '준우승자에게 주는 은빛 메달', level: 'EASY' }
  ],
  '음': [
    { word: '음악', meaning: '소리를 리듬, 멜로디, 화성으로 구성하는 예술', level: 'EASY' },
    { word: '음식', meaning: '사람이 먹고 마시는 모든 것', level: 'EASY' },
    { word: '음료수', meaning: '마실 수 있는 깨끗한 물이나 음료', level: 'EASY' }
  ],
  '의': [
    { word: '의자', meaning: '사람이 앉는 도구', level: 'EASY' },
    { word: '의사', meaning: '환자의 병을 고치는 의료인', level: 'EASY' },
    { word: '의미', meaning: '말이나 글이 뜻하는 내용', level: 'MEDIUM' }
  ],
  '이': [
    { word: '이야기', meaning: '어떤 사실이나 생각을 말함', level: 'EASY' },
    { word: '이불', meaning: '자거나 누울 때 몸을 덮는 모직 천', level: 'EASY' },
    { word: '이유', meaning: '어떤 일이 일어난 까닭', level: 'EASY' }
  ],
  '인': [
    { word: '인형', meaning: '사람이나 동물 모양으로 만든 장난감', level: 'EASY' },
    { word: '인간', meaning: '사람', level: 'EASY' },
    { word: '인사', meaning: '예의를 표함', level: 'EASY' }
  ],
  '일': [
    { word: '일요일', meaning: '주말의 하루', level: 'EASY' },
    { word: '일기', meaning: '날마다 적는 기록', level: 'EASY' },
    { word: '일출', meaning: '해 떠오름', level: 'EASY' }
  ],
  '자': [
    { word: '자동차', meaning: '바퀴를 굴려 이동하는 교통수단', level: 'EASY' },
    { word: '자전거', meaning: '페달을 발로 굴리는 이륜차', level: 'EASY' },
    { word: '자유', meaning: '구속이나 제약이 없는 상태', level: 'EASY' },
    { word: '자연', meaning: '인공이 가해지지 않은 야생의 상태', level: 'EASY' }
  ],
  '작': [
    { word: '작품', meaning: '예술적 창작 활동을 통해 만든 물건', level: 'EASY' },
    { word: '작곡', meaning: '음악을 새로 만드는 일', level: 'MEDIUM' }
  ],
  '장': [
    { word: '장미', meaning: '가시가 있는 아름다운 꽃', level: 'EASY' },
    { word: '장난감', meaning: '아이들이 놀 때 쓰는 물건', level: 'EASY' },
    { word: '장군', meaning: '군대를 이끄는 지휘관', level: 'MEDIUM' }
  ],
  '재': [
    { word: '재미', meaning: '즐겁고 아기자기한 기분이나 맛', level: 'EASY' },
    { word: '재료', meaning: '물건을 만드는데 바탕이 되는 재목', level: 'EASY' },
    { word: '재능', meaning: '어떤 일을 잘할 수 있는 타고난 소질', level: 'MEDIUM' }
  ],
  '저': [
    { word: '저녁', meaning: '해가 지고 밤이 되기 전까지의 시간', level: 'EASY' },
    { word: '저금통', meaning: '돈을 모으는 그릇', level: 'EASY' }
  ],
  '적': [
    { word: '적응', meaning: '환경이나 조건에 맞춰 순응함', level: 'MEDIUM' },
    { word: '적성', meaning: '어떤 일에 알맞은 성질이나 소질', level: 'MEDIUM' }
  ],
  '전': [
    { word: '전화', meaning: '음성을 전달하는 통신 기기', level: 'EASY' },
    { word: '전철', meaning: '전기로 달리는 도시 철도', level: 'EASY' },
    { word: '전설', meaning: '옛날부터 전해 오는 신기한 이야기', level: 'MEDIUM' }
  ],
  '정': [
    { word: '정원', meaning: '집 안에 꽃이나 나무를 심은 뜰', level: 'EASY' },
    { word: '정류장', meaning: '버스나 차가 머무는 곳', level: 'EASY' },
    { word: '정의', meaning: '진리에 맞는 올바른 도리', level: 'MEDIUM' }
  ],
  '제': [
    { word: '제주도', meaning: '대한민국의 아름다운 섬', level: 'EASY' },
    { word: '제목', meaning: '글이나 작품의 이름', level: 'EASY' }
  ],
  '조': [
    { word: '조류', meaning: '새 종류의 동물', level: 'EASY' },
    { word: '조각', meaning: '깎아서 만드는 미술 작품', level: 'EASY' }
  ],
  '종': [
    { word: '종이', meaning: '글씨를 쓰거나 포장하는 얇은 면', level: 'EASY' },
    { word: '종소리', meaning: '종을 쳐서 나는 소리', level: 'EASY' }
  ],
  '주': [
    { word: '주머니', meaning: '물건을 넣도록 옷 따위에 달아 놓은 포켓', level: 'EASY' },
    { word: '주스', meaning: '과일이나 채소를 짜낸 즙 음료', level: 'EASY' },
    { word: '주말', meaning: '한 주의 끝인 토요일과 일요일', level: 'EASY' }
  ],
  '중': [
    { word: '중학교', meaning: '초등학교 다음의 중등 교육 기관', level: 'EASY' },
    { word: '중심', meaning: '사물의 가장 한가운데', level: 'EASY' }
  ],
  '지': [
    { word: '지우개', meaning: '연필 자국을 지우는 도구', level: 'EASY' },
    { word: '지도', meaning: '지형을 기호로 그린 그림', level: 'EASY' },
    { word: '지구', meaning: '인류가 살고 있는 행성', level: 'EASY' }
  ],
  '직': [
    { word: '직업', meaning: '생계를 유지하기 위해 하는 일', level: 'EASY' },
    { word: '직사각형', meaning: '네 각이 모두 직각인 사각형', level: 'EASY' }
  ],
  '진': [
    { word: '진주', meaning: '조개 속에서 만들어지는 보석', level: 'EASY' },
    { word: '진심', meaning: '거짓 없는 참된 마음', level: 'EASY' }
  ],
  '차': [
    { word: '차표', meaning: '승차권', level: 'EASY' },
    { word: '차량', meaning: '수송용 수레나 자동차', level: 'EASY' }
  ],
  '창': [
    { word: '창문', meaning: '공기와 빛이 통하도록 벽에 만든 문', level: 'EASY' },
    { word: '창의성', meaning: '새롭고 독창적인 아이디어를 만드는 능력', level: 'MEDIUM' }
  ],
  '책': [
    { word: '책상', meaning: '글을 쓰거나 공부할 때 쓰는 상', level: 'EASY' },
    { word: '책방', meaning: '서점', level: 'EASY' }
  ],
  '천': [
    { word: '천문대', meaning: '별이나 천체를 관측하는 시설', level: 'EASY' },
    { word: '천사', meaning: '하늘의 뜻을 전하는 신성한 존재', level: 'EASY' }
  ],
  '철': [
    { word: '철학', meaning: '세계와 인간의 근본 진리를 탐구하는 학문', level: 'MEDIUM' },
    { word: '철도', meaning: '열차가 다닐 수 있도록 깐 쇠길', level: 'EASY' }
  ],
  '초': [
    { word: '초초', meaning: '촛불을 켜는 재료', level: 'EASY' },
    { word: '초등학교', meaning: '어린이 기초 교육 기관', level: 'EASY' }
  ],
  '추': [
    { word: '추억', meaning: '지나간 일에 대한 그리운 기억', level: 'EASY' },
    { word: '추석', meaning: '음력 8월 15일의 명절', level: 'EASY' }
  ],
  '축': [
    { word: '축구', meaning: '발로 공을 차서 득점하는 스포츠', level: 'EASY' },
    { word: '축제', meaning: '기념하거나 축하하는 잔치', level: 'EASY' }
  ],
  '치': [
    { word: '치약', meaning: '이를 닦을 때 양치질에 쓰는 약제', level: 'EASY' },
    { word: '치과', meaning: '치아 질환을 고치는 의원', level: 'EASY' }
  ],
  '카': [
    { word: '카메라', meaning: '사진이나 영상을 촬영하는 기기', level: 'EASY' },
    { word: '카레', meaning: '여러 향신료를 섞어 만든 노란 요리', level: 'EASY' },
    { word: '카드', meaning: '직사각형 형태의 종이나 플라스틱 판', level: 'EASY' }
  ],
  '타': [
    { word: '타조', meaning: '가장 큰 날지 못하는 새', level: 'EASY' },
    { word: '타악기', meaning: '두드려 소리를 내는 악기', level: 'MEDIUM' }
  ],
  '태': [
    { word: '태양', meaning: '태양계의 중심에 있는 항성', level: 'EASY' },
    { word: '태권도', meaning: '한국 고유의 전통 무예', level: 'EASY' },
    { word: '태풍', meaning: '중심 부근에 강한 바람을 동반하는 열대 저기압', level: 'MEDIUM' }
  ],
  '통': [
    { word: '통신', meaning: '소식이나 정보를 서로 주고받음', level: 'EASY' },
    { word: '통화', meaning: '전화로 대화를 나눔', level: 'EASY' },
    { word: '통로', meaning: '사람이나 차가 다닐 수 있는 길', level: 'EASY' }
  ],
  '파': [
    { word: '파도', meaning: '바다의 물결', level: 'EASY' },
    { word: '파랑', meaning: '맑은 하늘과 같은 색', level: 'EASY' }
  ],
  '평': [
    { word: '평화', meaning: '전쟁이나 분쟁 없이 조용함', level: 'EASY' },
    { word: '평야', meaning: '넓고 평평한 들판', level: 'MEDIUM' }
  ],
  '풍': [
    { word: '풍선', meaning: '공기를 넣어 부풀리는 장난감', level: 'EASY' },
    { word: '풍경', meaning: '경치나 모습', level: 'MEDIUM' }
  ],
  '하': [
    { word: '하늘', meaning: '지표면 위로 펼쳐진 무한한 공간', level: 'EASY' },
    { word: '학교', meaning: '학생들을 가르치는 교육 기관', level: 'EASY' },
    { word: '하모니', meaning: '여러 소리가 아름답게 조화를 이룸', level: 'MEDIUM' }
  ],
  '학': [
    { word: '학교', meaning: '학생을 가르치는 교육 기관', level: 'EASY' },
    { word: '학용품', meaning: '공부할 때 쓰는 도구', level: 'EASY' },
    { word: '학자', meaning: '학문에 능통한 사람', level: 'MEDIUM' }
  ],
  '한': [
    { word: '한국', meaning: '대한민국', level: 'EASY' },
    { word: '한글', meaning: '한국의 독창적인 문자 시스템', level: 'EASY' }
  ],
  '해': [
    { word: '해바라기', meaning: '노란 꽃이 태양을 향해 피는 식물', level: 'EASY' },
    { word: '해변', meaning: '바다와 맞닿은 모래사장', level: 'EASY' }
  ],
  '호': [
    { word: '호랑이', meaning: '고양잇과의 대형 맹수', level: 'EASY' },
    { word: '호수', meaning: '육지에 둘러싸인 넓은 물못', level: 'EASY' }
  ],
  '화': [
    { word: '화가', meaning: '그림을 전문적으로 그리는 사람', level: 'EASY' },
    { word: '화분', meaning: '식물을 심어 가꾸는 그릇', level: 'EASY' },
    { word: '화장실', meaning: '용변을 보고 세수하는 곳', level: 'EASY' }
  ],
  '환': [
    { word: '환영', meaning: '기쁘게 맞아들임', level: 'EASY' },
    { word: '환상', meaning: '현실에 없는 아름다운 분위기', level: 'EASY' }
  ],
  '황': [
    { word: '황금', meaning: '귀하고 찬란한 금', level: 'EASY' },
    { word: '황소', meaning: '몸집이 큰 노란 소', level: 'EASY' }
  ]
};

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
