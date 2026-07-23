import { DifficultyLevel } from '../types';

export interface DictEntry {
  word: string;
  meaning: string;
  level: DifficultyLevel;
}

export const COMPREHENSIVE_DICTIONARY: Record<string, DictEntry[]> = {
  '가': [
    { word: '가방', meaning: '물건을 넣어 들거나 어깨에 메는 용구', level: 'EASY' },
    { word: '가을', meaning: '여름과 겨울 사이의 계절', level: 'EASY' },
    { word: '가수', meaning: '노래 부르는 것을 직업으로 하는 사람', level: 'EASY' },
    { word: '가구', meaning: '집안에서 쓰는 수장 용구', level: 'EASY' },
    { word: '가람', meaning: '강의 옛말 또는 사찰의 배치', level: 'MEDIUM' },
    { word: '가교', meaning: '다리를 놓음. 어떤 일을 중간에서 연결함', level: 'HARD' },
    { word: '가축', meaning: '집에서 기르는 짐승', level: 'EASY' },
    { word: '가슴', meaning: '배와 목 사이의 앞부분', level: 'EASY' }
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
    { word: '간격', meaning: '사물이나 시간 사이의 떨어진 거리', level: 'MEDIUM' },
    { word: '간장', meaning: '음식의 간을 맞추는 데 쓰는 짠 맛의 양념', level: 'EASY' }
  ],
  '갈': [
    { word: '갈대', meaning: '습지나 호숫가에 자라는 벼과의 다년생 식물', level: 'EASY' },
    { word: '갈고리', meaning: '끝이 뾰족하고 굽은 도구', level: 'EASY' },
    { word: '갈망', meaning: '간절히 바람', level: 'HARD' },
    { word: '갈등', meaning: '상두 상충하는 견해나 이익으로 생기는 마찰', level: 'MEDIUM' }
  ],
  '감': [
    { word: '감자', meaning: '땅속 덩이줄기를 식용하는 가지과의 식물', level: 'EASY' },
    { word: '감사', meaning: '고마움을 나타내는 인사의 말', level: 'EASY' },
    { word: '감정', meaning: '어떤 현상이나 일에 대하여 일어나는 마음이나 기분', level: 'MEDIUM' },
    { word: '감옥', meaning: '죄인을 가두어 두는 시설', level: 'EASY' },
    { word: '감기', meaning: '바이러스로 인해 상기도가 감염되어 생기는 병', level: 'EASY' }
  ],
  '갑': [
    { word: '갑옷', meaning: '싸움터에서 몸을 보호하기 위하여 입던 옷', level: 'EASY' },
    { word: '갑판', meaning: '배 위쪽에 깐 넓고 평평한 바닥', level: 'MEDIUM' },
    { word: '갑상선', meaning: '목 앞쪽에 위치한 내분비 기관', level: 'HARD' }
  ],
  '강': [
    { word: '강아지', meaning: '개 또는 개과의 어린 동물', level: 'EASY' },
    { word: '강당', meaning: '많은 사람이 모여 강연이나 집회를 여는 넓은 방', level: 'EASY' },
    { word: '강변', meaning: '강가의 땅', level: 'EASY' },
    { word: '강인함', meaning: '의지나 마음이 강하고 억셈', level: 'HARD' },
    { word: '강물', meaning: '강에 흐르는 물', level: 'EASY' },
    { word: '강의', meaning: '학문이나 기술의 내용을 설명하여 가르침', level: 'MEDIUM' }
  ],
  '개': [
    { word: '개구리', meaning: '양서류 개구리목의 동물', level: 'EASY' },
    { word: '개미', meaning: '곤충강 벌목 개밋과의 총칭', level: 'EASY' },
    { word: '개성', meaning: '다른 사람과 구별되는 그 사람 고유의 특성', level: 'MEDIUM' },
    { word: '개혁', meaning: '제도나 기구 따위를 새로 고침', level: 'HARD' },
    { word: '개울', meaning: '폭이 좁고 작은 물줄기', level: 'EASY' }
  ],
  '거': [
    { word: '거북이', meaning: '파충류 거북목의 총칭', level: 'EASY' },
    { word: '거울', meaning: '물체의 모습을 반사하여 보여 주는 도구', level: 'EASY' },
    { word: '거미', meaning: '거미목에 속하는 절지동물', level: 'EASY' },
    { word: '거장', meaning: '어떤 분야에서 기술이나 예술이 아주 뛰어난 사람', level: 'HARD' },
    { word: '거리', meaning: '사람이나 차가 다니는 길', level: 'EASY' }
  ],
  '건': [
    { word: '건물', meaning: '사람이 들어살거나 일을 하기 위해 지은 구조물', level: 'EASY' },
    { word: '건강', meaning: '몸과 마음이 무탈하고 튼튼한 상태', level: 'EASY' },
    { word: '건축', meaning: '집이나 다리 따위의 구조물을 설계하여 지음', level: 'MEDIUM' },
    { word: '건전지', meaning: '전기를 저장하여 쓰는 화학 전지', level: 'EASY' }
  ],
  '고': [
    { word: '고양이', meaning: '고양이과에 속하는 포유류 동물', level: 'EASY' },
    { word: '고구마', meaning: '메꽃과의 덩이뿌리를 먹는 식물', level: 'EASY' },
    { word: '고래', meaning: '바다에 사는 수생 포유류', level: 'EASY' },
    { word: '고기', meaning: '식용하는 동물의 살', level: 'EASY' },
    { word: '고성', meaning: '오래된 성곽 또는 높은 소리', level: 'MEDIUM' }
  ],
  '곡': [
    { word: '곡식', meaning: '사람이 식량으로 사용하는 곡물', level: 'EASY' },
    { word: '곡선', meaning: '굽은 선', level: 'EASY' },
    { word: '곡물', meaning: '쌀, 보리, 콩 따위의 곡식', level: 'EASY' }
  ],
  '곤': [
    { word: '곤충', meaning: '몸이 머리, 가슴, 배로 나누어지는 절지동물', level: 'EASY' },
    { word: '곤봉', meaning: '체조나 체육 체계에 쓰는 짧은 몽둥이', level: 'MEDIUM' }
  ],
  '골': [
    { word: '골짜기', meaning: '산과 산 사이에 오목하게 들어간 골', level: 'EASY' },
    { word: '골목', meaning: '큰길에서 들어간 좁은 길', level: 'EASY' },
    { word: '골프', meaning: '골프채로 공을 쳐서 홀에 넣는 경기', level: 'EASY' }
  ],
  '공': [
    { word: '공룡', meaning: '중생대에 번성했던 거대한 파충류', level: 'EASY' },
    { word: '공원', meaning: '휴식과 산책을 위해 조성된 휴양 공간', level: 'EASY' },
    { word: '공기', meaning: '지구 대기를 이루는 기체 혼합물', level: 'EASY' },
    { word: '공책', meaning: '글씨나 그림을 적을 수 있게 제본한 책', level: 'EASY' },
    { word: '공항', meaning: '항공기가 이착륙하고 승객이 이용하는 시설', level: 'EASY' },
    { word: '공간', meaning: '아무것도 없이 비어 있는 영역', level: 'MEDIUM' }
  ],
  '과': [
    { word: '과자', meaning: '곡물가루나 설탕 따위로 만든 주전부리', level: 'EASY' },
    { word: '과학', meaning: '자연 현상을 체계적으로 연구하는 학문', level: 'EASY' },
    { word: '과일', meaning: '나무나 식물의 나무열매', level: 'EASY' },
    { word: '과정', meaning: '일이 일어나는 순서나 경과', level: 'MEDIUM' },
    { word: '과제', meaning: '해결해야 할 문제나 숙제', level: 'MEDIUM' },
    { word: '과수원', meaning: '과일나무를 가꾸는 밭', level: 'EASY' }
  ],
  '관': [
    { word: '관람', meaning: '무대나 영화, 전시 따위를 구경함', level: 'EASY' },
    { word: '관찰', meaning: '사물이나 현상을 자세히 살펴보는 일', level: 'EASY' },
    { word: '관객', meaning: '공연이나 경기 따위를 보는 사람', level: 'EASY' },
    { word: '관심', meaning: '어떤 대상에 대해 마음이 쏠림', level: 'MEDIUM' },
    { word: '관습', meaning: '사회적으로 오랫동안 이어져 내려온 행동 방식', level: 'MEDIUM' }
  ],
  '광': [
    { word: '광장', meaning: '많은 사람이 모일 수 있는 넓은 공간', level: 'EASY' },
    { word: '광산', meaning: '광물을 파내는 곳', level: 'EASY' },
    { word: '광선', meaning: '빛의 줄기', level: 'MEDIUM' },
    { word: '광경', meaning: '벌어진 광경이나 정경', level: 'MEDIUM' }
  ],
  '구': [
    { word: '구름', meaning: '공기 중의 수증기가 피어올라 떠 있는 상태', level: 'EASY' },
    { word: '구두', meaning: '가죽이나 합성 수지로 만든 신발', level: 'EASY' },
    { word: '구조', meaning: '부분들이 결합하여 이루어진 전체 틀', level: 'MEDIUM' },
    { word: '구급차', meaning: '응급 환자를 수송하는 자동차', level: 'EASY' },
    { word: '구경', meaning: '흥미롭게 바라봄', level: 'EASY' }
  ],
  '국': [
    { word: '국기', meaning: '한 나라를 상징하는 깃발', level: 'EASY' },
    { word: '국수', meaning: '밀가루나 가루 따위로 길게 뽑아낸 면 요리', level: 'EASY' },
    { word: '국가', meaning: '일정한 영토와 국민, 주권을 가진 사회 공동체', level: 'EASY' },
    { word: '국어', meaning: '자기 나라의 말', level: 'EASY' },
    { word: '국보', meaning: '나라의 보물로 지정된 문화재', level: 'MEDIUM' }
  ],
  '군': [
    { word: '군대', meaning: '국방을 담당하는 조직체', level: 'EASY' },
    { word: '군인', meaning: '군대에 소속되어 의무를 수행하는 사람', level: 'EASY' },
    { word: '군함', meaning: '전투용 전투 배', level: 'MEDIUM' }
  ],
  '궁': [
    { word: '궁전', meaning: '임금이 거처하던 신령스럽고 커다란 집', level: 'EASY' },
    { word: '궁궐', meaning: '왕이 살며 정무를 보던 궁전', level: 'EASY' },
    { word: '궁수', meaning: '활을 쏘는 군사', level: 'MEDIUM' }
  ],
  '권': [
    { word: '권력', meaning: '남을 복종시키는 힘', level: 'MEDIUM' },
    { word: '권투', meaning: '주먹에 글러브를 끼고 벌이는 격투 스포츠', level: 'EASY' },
    { word: '권리', meaning: '법률상 정당하게 누릴 수 있는 힘', level: 'MEDIUM' }
  ],
  '귀': [
    { word: '귀걸이', meaning: '귀에 거는 장신구', level: 'EASY' },
    { word: '귀가', meaning: '자기 집으로 돌아감', level: 'EASY' },
    { word: '귀족', meaning: '신분이 높고 가문이 좋은 사람', level: 'MEDIUM' }
  ],
  '규': [
    { word: '규칙', meaning: '행동이나 절차를 제약하는 정해진 정식', level: 'EASY' },
    { word: '규범', meaning: '마땅히 따르고 지켜야 할 기준', level: 'MEDIUM' },
    { word: '규율', meaning: '질서를 유지하기 위한 규범', level: 'MEDIUM' }
  ],
  '균': [
    { word: '균형', meaning: '어느 한쪽으로 기울지 않고 평형을 이룸', level: 'EASY' },
    { word: '균류', meaning: '버섯이나 곰팡이 따위의 생물군', level: 'HARD' }
  ],
  '극': [
    { word: '극지방', meaning: '지구의 남극이나 북극 지역', level: 'EASY' },
    { word: '극장', meaning: '연극이나 영화를 상영하는 시설', level: 'EASY' },
    { word: '극복', meaning: '어려움을 참고 이겨 냄', level: 'MEDIUM' }
  ],
  '근': [
    { word: '근무', meaning: '직장에서 맡은 일을 수행함', level: 'EASY' },
    { word: '근처', meaning: '가까운 곳', level: 'EASY' },
    { word: '근육', meaning: '수축과 이완을 담당하는 인체 조직', level: 'EASY' }
  ],
  '글': [
    { word: '글자', meaning: '말을 적는 상징적 기호', level: 'EASY' },
    { word: '글씨', meaning: '써 놓은 글자의 모양', level: 'EASY' },
    { word: '글로브', meaning: '손에 끼는 운동용 장갑', level: 'EASY' }
  ],
  '금': [
    { word: '금요일', meaning: '목요일과 토요일 사이의 요일', level: 'EASY' },
    { word: '금속', meaning: '광택이 나고 전도성이 높은 물질', level: 'EASY' },
    { word: '금반지', meaning: '순금이나 금으로 만든 반지', level: 'EASY' },
    { word: '금화', meaning: '금으로 만든 화폐', level: 'MEDIUM' }
  ],
  '급': [
    { word: '급식', meaning: '학교나 공공기관에서 음식을 제공함', level: 'EASY' },
    { word: '급류', meaning: '매우 빠르게 흐르는 물살', level: 'MEDIUM' },
    { word: '급행', meaning: '목적지까지 정차를 최소화하여 빠르게 감', level: 'EASY' }
  ],
  '기': [
    { word: '기차', meaning: '선로 위를 달리는 열차', level: 'EASY' },
    { word: '기린', meaning: '목이 매우 긴 포유류 동물', level: 'EASY' },
    { word: '기계', meaning: '동력을 이용하여 일하는 장치', level: 'EASY' },
    { word: '기억', meaning: '지난 일을 잊지 않고 상기함', level: 'EASY' },
    { word: '기후', meaning: '어느 지역의 장기적인 기상 상태', level: 'MEDIUM' },
    { word: '기업', meaning: '이윤 창출을 목적으로 하는 경제 주체', level: 'MEDIUM' }
  ],
  '길': [
    { word: '길거리', meaning: '사람들이 다니는 길과 도로', level: 'EASY' },
    { word: '길가', meaning: '길의 가장자리', level: 'EASY' },
    { word: '길잡이', meaning: '길을 안내해 주는 사람이나 도구', level: 'MEDIUM' }
  ],
  '김': [
    { word: '김치', meaning: '배추나 무 따위를 소금에 절여 양념한 전통 음식', level: 'EASY' },
    { word: '김밥', meaning: '밥과 재료를 김으로 말아 썬 음식', level: 'EASY' }
  ],
  '나': [
    { word: '나비', meaning: '나비목에 속하는 아름다운 곤충', level: 'EASY' },
    { word: '나무', meaning: '줄기가 목질로 된 다년생 식물', level: 'EASY' },
    { word: '나침반', meaning: '방향을 알려주는 자석 기구', level: 'MEDIUM' },
    { word: '나팔', meaning: '금관 악기의 일종', level: 'EASY' }
  ],
  '낙': [
    { word: '낙엽', meaning: '계절에 따라 떨어지는 나뭇잎', level: 'EASY' },
    { word: '낙원', meaning: '근심 없이 행복하게 사는 이상향', level: 'MEDIUM' },
    { word: '낙타', meaning: '등에 혹이 있는 사막의 포유류', level: 'EASY' }
  ],
  '난': [
    { word: '난로', meaning: '불을 피워 방 안을 따뜻하게 하는 장치', level: 'EASY' },
    { word: '난초', meaning: '난초과 식물의 총칭', level: 'MEDIUM' },
    { word: '난관', meaning: '지나가기 어려운 험한 관문이나 시련', level: 'HARD' }
  ],
  '날': [
    { word: '날씨', meaning: '대기의 상태', level: 'EASY' },
    { word: '날개', meaning: '공중을 날아다니는 기관', level: 'EASY' },
    { word: '날짜', meaning: '해, 달, 날 따위의 시점', level: 'EASY' }
  ],
  '남': [
    { word: '남극', meaning: '지구의 남쪽 끝 지역', level: 'EASY' },
    { word: '남산', meaning: '서울 도심에 있는 유명한 산', level: 'EASY' },
    { word: '남성', meaning: '남자', level: 'EASY' },
    { word: '남대문', meaning: '조선 시대 서울 숭례문', level: 'EASY' }
  ],
  '내': [
    { word: '내일', meaning: '오늘의 바로 다음 날', level: 'EASY' },
    { word: '내륙', meaning: '바다에서 멀리 떨어진 육지 지역', level: 'MEDIUM' },
    { word: '내각', meaning: '내각책임제에서 행정권을 담당하는 기관', level: 'HARD' }
  ],
  '노': [
    { word: '노래', meaning: '가사에 음률을 붙여 부름', level: 'EASY' },
    { word: '노을', meaning: '해가 질 무렵 붉게 물드는 현상', level: 'EASY' },
    { word: '노인', meaning: '나이가 많은 사람', level: 'EASY' },
    { word: '노랑', meaning: '개나리꽃과 같은 밝은 색', level: 'EASY' }
  ],
  '농': [
    { word: '농구', meaning: '공을 림에 넣는 구기 종목', level: 'EASY' },
    { word: '농장', meaning: '농사를 짓거나 가축을 기르는 농경지', level: 'EASY' },
    { word: '농업', meaning: '작물을 재배하는 산업', level: 'EASY' }
  ],
  '눈': [
    { word: '눈사람', meaning: '눈을 뭉쳐 사람 모양으로 만든 것', level: 'EASY' },
    { word: '눈썹', meaning: '눈 위에 난 털', level: 'EASY' },
    { word: '눈물', meaning: '눈에서 흘러내리는 수분', level: 'EASY' },
    { word: '눈길', meaning: '눈이 쌓인 길 또는 시선', level: 'EASY' }
  ],
  '뉴': [
    { word: '뉴스', meaning: '새로운 소식이나 정보 방송', level: 'EASY' },
    { word: '뉴턴', meaning: '영국의 위대한 물리학자', level: 'MEDIUM' }
  ],
  '다': [
    { word: '다람쥐', meaning: '조그마한 귀여운 포유류', level: 'EASY' },
    { word: '다리', meaning: '걸을 때 쓰는 기관 또는 교량', level: 'EASY' },
    { word: '다이아몬드', meaning: '가장 단단한 보석', level: 'MEDIUM' },
    { word: '다리미', meaning: '옷의 주름을 펼 때 쓰는 열기구', level: 'EASY' }
  ],
  '단': [
    { word: '단풍', meaning: '가을에 잎이 붉거나 노랗게 변하는 현상', level: 'EASY' },
    { word: '단어', meaning: '뜻을 가진 최소의 언어 단위', level: 'EASY' },
    { word: '단추', meaning: '옷을 여미는 작은 도구', level: 'EASY' },
    { word: '단지', meaning: '주택이나 공장이 모여 있는 구역', level: 'MEDIUM' }
  ],
  '달': [
    { word: '달팽이', meaning: '껍데기를 진 복족류 동물', level: 'EASY' },
    { word: '달력', meaning: '날짜 표', level: 'EASY' },
    { word: '달리기', meaning: '빨리 달리는 육상 운동', level: 'EASY' },
    { word: '달빛', meaning: '달에서 비치는 빛', level: 'EASY' },
    { word: '달걀', meaning: '닭이 낳은 알', level: 'EASY' }
  ],
  '담': [
    { word: '담요', meaning: '몸을 덮는 털이나 보온용 이불', level: 'EASY' },
    { word: '담장', meaning: '집이나 건물의 둘레를 둘러싼 담', level: 'EASY' },
    { word: '담수', meaning: '염분이 없는 민물', level: 'MEDIUM' }
  ],
  '당': [
    { word: '당근', meaning: '주황색 비타민 채소', level: 'EASY' },
    { word: '당구', meaning: '큐대로 공을 치는 스포츠', level: 'EASY' },
    { word: '당일', meaning: '바로 그 날', level: 'EASY' }
  ],
  '대': [
    { word: '대나무', meaning: '속이 빈 곧은 마디 나무', level: 'EASY' },
    { word: '대통령', meaning: '국가의 원수', level: 'MEDIUM' },
    { word: '대한민국', meaning: '동아시아의 민주공화국', level: 'EASY' },
    { word: '대륙', meaning: '지구상의 거대한 육지 판', level: 'MEDIUM' },
    { word: '대화', meaning: '마주 보고 나누는 이야기', level: 'EASY' }
  ],
  '덕': [
    { word: '덕수궁', meaning: '서울 도심에 있는 조선의 궁궐', level: 'EASY' },
    { word: '덕목', meaning: '도덕적 생활의 기준이 되는 품성', level: 'HARD' }
  ],
  '도': [
    { word: '도서관', meaning: '책을 읽거나 대여하는 장소', level: 'EASY' },
    { word: '도로', meaning: '차와 사람이 오가는 길', level: 'EASY' },
    { word: '도자기', meaning: '흙을 구워 만든 그릇', level: 'MEDIUM' },
    { word: '도시', meaning: '인구가 밀집한 중심 지역', level: 'EASY' },
    { word: '도장', meaning: '이름이나 기호를 찍는 도구', level: 'EASY' }
  ],
  '독': [
    { word: '독수리', meaning: '매목의 거대한 맹금류', level: 'EASY' },
    { word: '독서', meaning: '책을 읽음', level: 'EASY' },
    { word: '독도', meaning: '동해에 있는 대한민국 영토 섬', level: 'EASY' }
  ],
  '동': [
    { word: '동물원', meaning: '여러 동물을 기르는 시설', level: 'EASY' },
    { word: '동전', meaning: '금속 화폐', level: 'EASY' },
    { word: '동화', meaning: '어린이를 위한 이야기', level: 'EASY' },
    { word: '동굴', meaning: '땅속이나 바위에 뚫린 굴', level: 'EASY' },
    { word: '동산', meaning: '나지막한 작은 산', level: 'EASY' }
  ],
  '돼': [
    { word: '돼지', meaning: '복스러운 포유류 가축', level: 'EASY' },
    { word: '돼지고기', meaning: '돼지의 식용 육류', level: 'EASY' }
  ],
  '두': [
    { word: '두더지', meaning: '땅속을 파고 사는 소형 포유류', level: 'EASY' },
    { word: '두부', meaning: '콩물로 만든 네모난 식품', level: 'EASY' },
    { word: '두뇌', meaning: '뇌와 지능', level: 'MEDIUM' }
  ],
  '드': [
    { word: '드라마', meaning: '연극이나 방송 극 작품', level: 'EASY' },
    { word: '드론', meaning: '무인 비행 기체', level: 'EASY' }
  ],
  '등': [
    { word: '등산', meaning: '산을 오름', level: 'EASY' },
    { word: '등대', meaning: '배의 항로를 밝히는 탑', level: 'EASY' },
    { word: '등불', meaning: '등에 켠 불', level: 'EASY' }
  ],
  '딸': [
    { word: '딸기', meaning: '붉은색 과즙이 많은 열매', level: 'EASY' },
    { word: '딸랑이', meaning: '소리가 나는 아기 장난감', level: 'EASY' }
  ],
  '떡': [
    { word: '떡볶이', meaning: '떡과 고추장 양념 요리', level: 'EASY' },
    { word: '떡국', meaning: '가래떡을 넣어 끓인 국', level: 'EASY' }
  ],
  '라': [
    { word: '라면', meaning: '유탕 처리된 면 요리', level: 'EASY' },
    { word: '라디오', meaning: '음성 음향 방송 기기', level: 'EASY' },
    { word: '라일락', meaning: '향기가 좋은 보랏빛 꽃', level: 'MEDIUM' }
  ],
  '러': [
    { word: '러시아', meaning: '유라시아 대륙의 대국', level: 'EASY' },
    { word: '러닝', meaning: '달리기 운동', level: 'EASY' }
  ],
  '로': [
    { word: '로봇', meaning: '자동 동작 기계', level: 'EASY' },
    { word: '로켓', meaning: '분사 추진체 비행체', level: 'EASY' },
    { word: '로마', meaning: '이탈리아의 수도이자 역사적 도시', level: 'EASY' }
  ],
  '류': [
    { word: '류트', meaning: '서양의 고전 현악기', level: 'HARD' },
    { word: '류머티즘', meaning: '관절이나 근육통 질환', level: 'HARD' }
  ],
  '마': [
    { word: '마술', meaning: '신기한 눈속임 연출', level: 'EASY' },
    { word: '마을', meaning: '가구가 모인 지역', level: 'EASY' },
    { word: '마라톤', meaning: '42.195km 장거리 장거리 경주', level: 'EASY' },
    { word: '마음', meaning: '생각이나 감정의 근원', level: 'EASY' },
    { word: '마스크', meaning: '입과 코를 가리는 방역 용구', level: 'EASY' }
  ],
  '막': [
    { word: '막대기', meaning: '길쭉하고 딱딱한 나무토막', level: 'EASY' },
    { word: '막사', meaning: '군인들이 거처하는 간이 건물', level: 'MEDIUM' }
  ],
  '만': [
    { word: '만화', meaning: '그림으로 표현한 이야기', level: 'EASY' },
    { word: '만년필', meaning: '잉크를 넣어서 쓰는 펜', level: 'EASY' },
    { word: '만두', meaning: '피 안에 소를 넣어 찐 음식', level: 'EASY' }
  ],
  '망': [
    { word: '망원경', meaning: '멀리 있는 물체를 확대해 보는 기구', level: 'EASY' },
    { word: '망망대해', meaning: '끝없이 넓고 커다란 바다', level: 'HARD' }
  ],
  '매': [
    { word: '매미', meaning: '여름에 우는 매밋과 곤충', level: 'EASY' },
    { word: '매화', meaning: '매화나무의 맑고 고운 꽃', level: 'EASY' },
    { word: '매일', meaning: '날마다', level: 'EASY' }
  ],
  '머': [
    { word: '머리', meaning: '인체의 뇌가 있는 상부', level: 'EASY' },
    { word: '머리카락', meaning: '머리에 난 털', level: 'EASY' },
    { word: '머그컵', meaning: '손잡이가 있는 큰 컵', level: 'EASY' }
  ],
  '먹': [
    { word: '먹구름', meaning: '비나 눈을 내릴 듯 검은 구름', level: 'EASY' },
    { word: '먹이', meaning: '동물이 먹는 음식', level: 'EASY' }
  ],
  '먼': [
    { word: '먼지', meaning: '공중에 떠다니는 아주 작은 입자', level: 'EASY' },
    { word: '먼바다', meaning: '육지에서 멀리 떨어진 바다', level: 'EASY' }
  ],
  '메': [
    { word: '메모', meaning: '잊지 않기 위해 간단히 적음', level: 'EASY' },
    { word: '메밀', meaning: '국수나 묵을 만드는 곡식', level: 'EASY' }
  ],
  '명': [
    { word: '명왕성', meaning: '태양계 외곽의 왜소행성', level: 'MEDIUM' },
    { word: '명화', meaning: '유명하고 뛰어난 그림', level: 'EASY' },
    { word: '명사', meaning: '사물의 이름을 나타내는 품사', level: 'EASY' }
  ],
  '모': [
    { word: '모자', meaning: '머리에 쓰는 착용 도구', level: 'EASY' },
    { word: '모래', meaning: '바위가 깨어져 생긴 작은 알갱이', level: 'EASY' },
    { word: '모기', meaning: '피를 빠는 소형 곤충', level: 'EASY' },
    { word: '모니터', meaning: '화면 영상 출력 장치', level: 'EASY' }
  ],
  '목': [
    { word: '목걸이', meaning: '목에 거는 장신구', level: 'EASY' },
    { word: '목수', meaning: '나무로 집이나 가구를 만드는 사람', level: 'EASY' },
    { word: '목요일', meaning: '수요일과 금요일 사이 요일', level: 'EASY' }
  ],
  '무': [
    { word: '무지개', meaning: '공기 중 수증기에 빛이 반사되어 나타나는 일곱 색깔 띠', level: 'EASY' },
    { word: '무궁화', meaning: '대한민국의 국화', level: 'EASY' },
    { word: '무대', meaning: '연기나 연주를 선보이는 연단', level: 'EASY' },
    { word: '무용', meaning: '몸으로 표현하는 예술', level: 'MEDIUM' }
  ],
  '문': [
    { word: '문방구', meaning: '학용품을 파는 상점', level: 'EASY' },
    { word: '문학', meaning: '언어를 매개로 한 예술 작품', level: 'MEDIUM' },
    { word: '문장', meaning: '생각을 나타내는 완결된 글 단위', level: 'EASY' },
    { word: '문어', meaning: '다리가 8개인 연체동물', level: 'EASY' }
  ],
  '물': [
    { word: '물고기', meaning: '물에 사는 척추동물', level: 'EASY' },
    { word: '물개', meaning: '바다에 사는 포유류', level: 'EASY' },
    { word: '물병', meaning: '물 담는 병', level: 'EASY' },
    { word: '물감', meaning: '그림을 그릴 때 쓰는 채색 재료', level: 'EASY' }
  ],
  '미': [
    { word: '미술', meaning: '공간이나 형상을 시각적으로 표현하는 예술', level: 'EASY' },
    { word: '미소', meaning: '소리 없이 소박하게 웃음', level: 'EASY' },
    { word: '미래', meaning: '앞으로 다가올 시간', level: 'EASY' },
    { word: '미로', meaning: '길을 찾기 어렵게 얽힌 통로', level: 'EASY' }
  ],
  '민': [
    { word: '민들레', meaning: '노란 꽃이 피는 국화과 다년생 식물', level: 'EASY' },
    { word: '민속', meaning: '민간의 오랜 풍속', level: 'EASY' },
    { word: '민족', meaning: '문화와 언어를 공유하는 공동체', level: 'MEDIUM' }
  ],
  '밀': [
    { word: '밀림', meaning: '빽빽하게 우거진 숲', level: 'EASY' },
    { word: '밀가루', meaning: '밀을 빻은 가루', level: 'EASY' }
  ],
  '바': [
    { word: '바다', meaning: '지구의 소금물 수역', level: 'EASY' },
    { word: '바나나', meaning: '열대 노란 과일', level: 'EASY' },
    { word: '바람', meaning: '공기의 흐름', level: 'EASY' },
    { word: '바구니', meaning: '대나무나 대 플라스틱 그릇', level: 'EASY' },
    { word: '바늘', meaning: '바느질에 쓰는 뾰족한 도구', level: 'EASY' }
  ],
  '박': [
    { word: '박물관', meaning: '역사 자료나 유물을 전시하는 곳', level: 'EASY' },
    { word: '박사', meaning: '최고 학위를 취득한 사람', level: 'EASY' },
    { word: '박쥐', meaning: '날아다니는 유일한 포유류', level: 'EASY' },
    { word: '박수', meaning: '두 손을 마주쳐 소리를 냄', level: 'EASY' }
  ],
  '반': [
    { word: '반지', meaning: '손가락에 끼는 고리 장신구', level: 'EASY' },
    { word: '반달', meaning: '반쪽 모양의 달', level: 'EASY' },
    { word: '반도', meaning: '삼면이 바다로 둘러싸인 육지', level: 'MEDIUM' }
  ],
  '발': [
    { word: '발자국', meaning: '발로 딛고 지나간 자국', level: 'EASY' },
    { word: '발레', meaning: '서양의 고전 무용', level: 'EASY' },
    { word: '발전', meaning: '전기를 일으킴 또는 더 나은 상태로 나아감', level: 'EASY' }
  ],
  '밤': [
    { word: '밤하늘', meaning: '밤에 보이는 하늘', level: 'EASY' },
    { word: '밤나무', meaning: '밤 열매가 맺히는 나무', level: 'EASY' }
  ],
  '방': [
    { word: '방아쇠', meaning: '총을 쏠 때 당기는 장치', level: 'EASY' },
    { word: '방송', meaning: '전파로 정보나 영상 전송', level: 'EASY' },
    { word: '방패', meaning: '적의 공격을 막는 무기', level: 'EASY' }
  ],
  '배': [
    { word: '배구', meaning: '네트를 사이에 두고 손으로 공을 치는 경기', level: 'EASY' },
    { word: '배백', meaning: '백조 따위의 아름다운 조류', level: 'EASY' }
  ],
  '백': [
    { word: '백조', meaning: '깃털이 흰 오릿과의 새', level: 'EASY' },
    { word: '백과사전', meaning: '지식을 체계적으로 수록한 책', level: 'EASY' },
    { word: '백화점', meaning: '다양한 상품을 판매하는 대형 매장', level: 'EASY' }
  ],
  '버': [
    { word: '버스', meaning: '대중교통 승합차', level: 'EASY' },
    { word: '버섯', meaning: '균류의 자실체', level: 'EASY' },
    { word: '버터', meaning: '우유의 지방으로 만든 유제품', level: 'EASY' }
  ],
  '번': [
    { word: '번개', meaning: '구름 사이 방전으로 나는 빛', level: 'EASY' },
    { word: '번역', meaning: '다른 언어로 옮겨 적음', level: 'MEDIUM' }
  ],
  '보': [
    { word: '보석', meaning: '귀하고 빛나는 아름다운 광물', level: 'EASY' },
    { word: '보름달', meaning: '둥글게 다 찬 달', level: 'EASY' },
    { word: '보드', meaning: '판자나 스케이트보드', level: 'EASY' }
  ],
  '복': [
    { word: '복숭아', meaning: '분홍빛 달콤한 과일', level: 'EASY' },
    { word: '복도', meaning: '건물 안의 통로', level: 'EASY' },
    { word: '복지', meaning: '행복하고 편안한 삶의 상태', level: 'MEDIUM' }
  ],
  '봉': [
    { word: '봉우리', meaning: '산의 가장 높은 곳', level: 'EASY' },
    { word: '봉투', meaning: '편지나 물건을 넣는 종이 주머니', level: 'EASY' }
  ],
  '부': [
    { word: '부엉이', meaning: '올빼밋과의 야행성 맹금류', level: 'EASY' },
    { word: '부엌', meaning: '음식을 만드는 조리 공간', level: 'EASY' },
    { word: '부채', meaning: '손으로 저어 바람을 일으키는 도구', level: 'EASY' }
  ],
  '북': [
    { word: '북극', meaning: '지구의 북쪽 끝 지역', level: 'EASY' },
    { word: '북소리', meaning: '북을 칠 때 나는 소리', level: 'EASY' },
    { word: '북쪽', meaning: '방위 중 하나', level: 'EASY' }
  ],
  '분': [
    { word: '분수', meaning: '물이 위로 솟구치게 한 장치', level: 'EASY' },
    { word: '분필', meaning: '칠판에 글을 쓰는 도구', level: 'EASY' },
    { word: '분야', meaning: '전문 영역', level: 'MEDIUM' }
  ],
  '불': [
    { word: '불꽃', meaning: '불이 탈 때 일어나는 빛의 혀', level: 'EASY' },
    { word: '불고기', meaning: '양념에 재워 구운 고기 요리', level: 'EASY' },
    { word: '불빛', meaning: '불에서 나오는 빛', level: 'EASY' }
  ],
  '비': [
    { word: '비행기', meaning: '공중을 날아다니는 항공기', level: 'EASY' },
    { word: '비누', meaning: '몸이나 옷을 씻는 세정제', level: 'EASY' },
    { word: '비둘기', meaning: '평화의 상징으로 여겨지는 새', level: 'EASY' }
  ],
  '사': [
    { word: '사과', meaning: '달콤한 사과나무 과일', level: 'EASY' },
    { word: '사자', meaning: '백수의 왕이라 불리는 맹수', level: 'EASY' },
    { word: '사진', meaning: '카메라로 촬영한 정지 영상', level: 'EASY' },
    { word: '사막', meaning: '강수량이 매우 적은 건조한 지대', level: 'EASY' },
    { word: '사슴', meaning: '뿔이 아름다운 포유류', level: 'EASY' }
  ],
  '산': [
    { word: '산길', meaning: '산에 난 길', level: 'EASY' },
    { word: '산책', meaning: '한가로이 거닒', level: 'EASY' },
    { word: '산호', meaning: '바닷속 산호충의 골격', level: 'MEDIUM' }
  ],
  '상': [
    { word: '상어', meaning: '바다의 포식성 연골어류', level: 'EASY' },
    { word: '상자', meaning: '물건을 담는 네모난 틀', level: 'EASY' },
    { word: '상상', meaning: '마음속으로 그려봄', level: 'EASY' },
    { word: '상금', meaning: '상으로 주는 돈', level: 'EASY' }
  ],
  '새': [
    { word: '새싹', meaning: '겨울을 이겨내고 돋아나는 어린 싹', level: 'EASY' },
    { word: '새장', meaning: '새를 가두어 기르는 창살 상자', level: 'EASY' },
    { word: '새벽', meaning: '해가 뜨기 직전의 시간', level: 'EASY' }
  ],
  '생': [
    { word: '생선', meaning: '식용하는 물고기', level: 'EASY' },
    { word: '생물', meaning: '살아있는 모든 존재', level: 'EASY' },
    { word: '생일', meaning: '태어난 날', level: 'EASY' }
  ],
  '서': [
    { word: '서점', meaning: '책을 파는 가게', level: 'EASY' },
    { word: '서류', meaning: '문서', level: 'EASY' },
    { word: '서울', meaning: '대한민국의 수도', level: 'EASY' }
  ],
  '선': [
    { word: '선풍기', meaning: '바람을 일으키는 전기 기구', level: 'EASY' },
    { word: '선박', meaning: '바다나 강을 운항하는 배', level: 'MEDIUM' },
    { word: '선물', meaning: '남에게 마음을 담아 주는 물건', level: 'EASY' }
  ],
  '설': [
    { word: '설탕', meaning: '단맛을 내는 감미료', level: 'EASY' },
    { word: '설산', meaning: '눈이 쌓인 산', level: 'EASY' },
    { word: '설화', meaning: '옛날부터 전해 내려오는 이야기', level: 'MEDIUM' }
  ],
  '성': [
    { word: '성당', meaning: '가톨릭 예배당', level: 'EASY' },
    { word: '성공', meaning: '목적을 이룸', level: 'EASY' },
    { word: '성벽', meaning: '성을 둘러싼 벽', level: 'MEDIUM' }
  ],
  '세': [
    { word: '세계', meaning: '지구상의 모든 나라와 인류', level: 'EASY' },
    { word: '세탁기', meaning: '빨래를 해주는 가전제품', level: 'EASY' },
    { word: '세모', meaning: '삼각형', level: 'EASY' }
  ],
  '소': [
    { word: '소나무', meaning: '사계절 푸른 상록수', level: 'EASY' },
    { word: '소방차', meaning: '불을 끄는 긴급 차량', level: 'EASY' },
    { word: '소금', meaning: '짠맛을 내는 결정체', level: 'EASY' },
    { word: '소리', meaning: '진동이 귀에 전달되는 파동', level: 'EASY' }
  ],
  '속': [
    { word: '속도', meaning: '빠른 정도', level: 'EASY' },
    { word: '속담', meaning: '교훈을 담은 교훈적 교언', level: 'EASY' }
  ],
  '손': [
    { word: '손수건', meaning: '손이나 땀을 닦는 작은 천', level: 'EASY' },
    { word: '손톱', meaning: '손가락 끝을 보호하는 표피', level: 'EASY' },
    { word: '손목', meaning: '손과 팔을 잇는 부분', level: 'EASY' }
  ],
  '수': [
    { word: '수박', meaning: '여름의 시원한 박과 과일', level: 'EASY' },
    { word: '수영', meaning: '물속에서 헤엄침', level: 'EASY' },
    { word: '수건', meaning: '물기를 닦는 천', level: 'EASY' },
    { word: '수도', meaning: '한 나라의 중심 도시', level: 'EASY' }
  ],
  '숙': [
    { word: '숙제', meaning: '집에서 해오도록 내는 과제', level: 'EASY' },
    { word: '숙소', meaning: '머물러 자는 장소', level: 'EASY' }
  ],
  '숲': [
    { word: '숲속', meaning: '숲의 안쪽', level: 'EASY' },
    { word: '숲길', meaning: '숲 사이에 난 길', level: 'EASY' }
  ],
  '스': [
    { word: '스마트폰', meaning: '지능형 휴대 전화', level: 'EASY' },
    { word: '스키', meaning: '눈 위를 지슬하는 판', level: 'EASY' },
    { word: '스케이트', meaning: '얼음 위를 달리는 날 신발', level: 'EASY' }
  ],
  '시': [
    { word: '시계', meaning: '시각을 나타내는 장치', level: 'EASY' },
    { word: '시민', meaning: '도시나 국가의 구성원', level: 'EASY' },
    { word: '시골', meaning: '복잡하지 않은 정겨운 지방', level: 'EASY' },
    { word: '시인', meaning: '시를 짓는 사람', level: 'MEDIUM' }
  ],
  '식': [
    { word: '식물', meaning: '광합성을 하는 생물', level: 'EASY' },
    { word: '식당', meaning: '음식을 파는 가게', level: 'EASY' },
    { word: '식사', meaning: '음식을 먹음', level: 'EASY' }
  ],
  '신': [
    { word: '신발', meaning: '발에 신는 구두나 운동화', level: 'EASY' },
    { word: '신문', meaning: '뉴스나 소식을 전하는 정기 간행물', level: 'EASY' },
    { word: '신화', meaning: '신들에 관한 전설적 이야기', level: 'MEDIUM' }
  ],
  '심': [
    { word: '심장', meaning: '혈액을 순환시키는 순환 기관', level: 'EASY' },
    { word: '심리', meaning: '마음의 상태나 작용', level: 'MEDIUM' }
  ],
  '아': [
    { word: '아침', meaning: '해가 떠오르는 이른 시간', level: 'EASY' },
    { word: '아파트', meaning: '공동 주택 건물', level: 'EASY' },
    { word: '아이스크림', meaning: '달콤하고 시원한 얼린 디저트', level: 'EASY' },
    { word: '안경', meaning: '시력을 교정하거나 눈을 보호하는 도구', level: 'EASY' }
  ],
  '악': [
    { word: '악기', meaning: '음악을 연주하는 도구', level: 'EASY' },
    { word: '악어', meaning: '파충류 악어목의 동물', level: 'EASY' },
    { word: '악보', meaning: '음악을 기호로 적은 표', level: 'EASY' }
  ],
  '안': [
    { word: '안개', meaning: '수증기가 지표면 가까이 뿌옇게 떠 있는 현상', level: 'EASY' },
    { word: '안전', meaning: '위험이 없는 무탈한 상태', level: 'EASY' }
  ],
  '야': [
    { word: '야구', meaning: '배트로 공을 치는 구기 스포츠', level: 'EASY' },
    { word: '야채', meaning: '채소', level: 'EASY' },
    { word: '야경', meaning: '밤에 보는 경치', level: 'EASY' }
  ],
  '약': [
    { word: '약국', meaning: '약품을 판매하는 상점', level: 'EASY' },
    { word: '약속', meaning: '다른 사람과 정한 다짐', level: 'EASY' },
    { word: '약초', meaning: '약으로 쓰이는 풀', level: 'MEDIUM' }
  ],
  '양': [
    { word: '양말', meaning: '발에 신는 직물 신', level: 'EASY' },
    { word: '양초', meaning: '불을 밝히는 파라핀 도구', level: 'EASY' },
    { word: '양파', meaning: '둥근 겹겹의 채소', level: 'EASY' }
  ],
  '어': [
    { word: '어린이', meaning: '어린 아이', level: 'EASY' },
    { word: '어부', meaning: '고기를 잡는 사람', level: 'EASY' },
    { word: '어둠', meaning: '빛이 없는 상태', level: 'EASY' }
  ],
  '언': [
    { word: '언덕', meaning: '높지 않은 산등성이', level: 'EASY' },
    { word: '언어', meaning: '의사소통 기호 체계', level: 'EASY' }
  ],
  '얼': [
    { word: '얼음', meaning: '물이 어둡게 굳은 고체', level: 'EASY' },
    { word: '얼굴', meaning: '머리의 앞면', level: 'EASY' }
  ],
  '여': [
    { word: '여우', meaning: '개과의 영리한 포유류', level: 'EASY' },
    { word: '여권', meaning: '해외여행 신분증', level: 'EASY' },
    { word: '여행', meaning: '다른 지역이나 나라를 유람함', level: 'EASY' },
    { word: '여름', meaning: '봄과 가을 사이 더운 계절', level: 'EASY' }
  ],
  '역': [
    { word: '역사', meaning: '지난 과거의 사실과 기록', level: 'EASY' },
    { word: '역전', meaning: '기차역의 앞 또는 전세를 바꿈', level: 'EASY' }
  ],
  '연': [
    { word: '연구', meaning: '어떤 문제를 파헤쳐 밝혀냄', level: 'EASY' },
    { word: '연필', meaning: '흑연 심을 넣은 필기도구', level: 'EASY' },
    { word: '연꽃', meaning: '진흙 속에서 피어나는 수생식물', level: 'EASY' },
    { word: '연극', meaning: '배우가 무대에서 펼치는 극', level: 'EASY' }
  ],
  '열': [
    { word: '열차', meaning: '기차나 전철', level: 'EASY' },
    { word: '열매', meaning: '식물의 결실 과일', level: 'EASY' },
    { word: '열쇠', meaning: '자물쇠를 여는 도구', level: 'EASY' }
  ],
  '영': [
    { word: '영웅', meaning: '지혜와 용맹이 뛰어난 인물', level: 'EASY' },
    { word: '영화', meaning: '영상을 스크린에 상영하는 예술', level: 'EASY' },
    { word: '영토', meaning: '국가의 주권이 미치는 땅', level: 'MEDIUM' }
  ],
  '예': [
    { word: '예술', meaning: '아름다움을 창조하고 표현하는 활동', level: 'EASY' },
    { word: '예절', meaning: '예의 바른 행동 규범', level: 'EASY' }
  ],
  '오': [
    { word: '오징어', meaning: '다리가 10개인 다지류 연체동물', level: 'EASY' },
    { word: '오이', meaning: '길쭉한 길쭉한 길쭉 박과 채소', level: 'EASY' },
    { word: '오렌지', meaning: '주황색 과즙 풍부한 과일', level: 'EASY' }
  ],
  '온': [
    { word: '온도', meaning: '차갑고 따뜻한 정도', level: 'EASY' },
    { word: '온실', meaning: '식물을 가꾸기 위한 유리 집', level: 'EASY' },
    { word: '온천', meaning: '지열로 데워진 지하수 샘', level: 'EASY' }
  ],
  '올': [
    { word: '올빼미', meaning: '야행성 맹금류 새', level: 'EASY' },
    { word: '올림픽', meaning: '4년마다 열리는 세계적 스포츠 축제', level: 'EASY' }
  ],
  '요': [
    { word: '요리', meaning: '음식을 만듦', level: 'EASY' },
    { word: '요일', meaning: '일주일의 각 날', level: 'EASY' }
  ],
  '용': [
    { word: '용기', meaning: '두려움을 무릅쓰는 마음가짐 또는 그릇', level: 'EASY' },
    { word: '용구', meaning: '작업에 쓰는 기구', level: 'EASY' }
  ],
  '우': [
    { word: '우산', meaning: '비나 눈을 막는 펴고 접는 도구', level: 'EASY' },
    { word: '우주', meaning: '모든 천체와 공간', level: 'EASY' },
    { word: '우체국', meaning: '우편물을 다루는 기관', level: 'EASY' },
    { word: '우유', meaning: '소가 생산하는 고소한 수유', level: 'EASY' }
  ],
  '운': [
    { word: '운동', meaning: '신체를 단련하는 활동', level: 'EASY' },
    { word: '운하', meaning: '배가 다니도록 파 놓은 인공 수로', level: 'MEDIUM' },
    { word: '운석', meaning: '우주에서 떨어진 돌덩이', level: 'EASY' }
  ],
  '원': [
    { word: '원숭이', meaning: '영장류 동물', level: 'EASY' },
    { word: '원자', meaning: '물질을 이루는 기본 입자', level: 'MEDIUM' },
    { word: '원형', meaning: '동그란 모양', level: 'EASY' }
  ],
  '월': [
    { word: '월요일', meaning: '한 주의 첫 번째 평일', level: 'EASY' },
    { word: '월계수', meaning: '승리의 상징인 영광의 나무', level: 'MEDIUM' }
  ],
  '유': [
    { word: '유치원', meaning: '유아 교육 기관', level: 'EASY' },
    { word: '유리', meaning: '투명하고 잘 깨지는 규산염 물질', level: 'EASY' },
    { word: '유성', meaning: '별똥별', level: 'EASY' }
  ],
  '육': [
    { word: '육지', meaning: '바다가 아닌 땅', level: 'EASY' },
    { word: '육상', meaning: '달리기, 뛰기 따위의 체육 종목', level: 'EASY' }
  ],
  '은': [
    { word: '은행', meaning: '금융기관 또는 노란 은행나무 열매', level: 'EASY' },
    { word: '은하수', meaning: '밤하늘의 강처럼 보이는 별 무리', level: 'EASY' },
    { word: '은혜', meaning: '고맙게 베풀어 준 혜택', level: 'EASY' }
  ],
  '음': [
    { word: '음악', meaning: '소리로 아름다움을 표현하는 예술', level: 'EASY' },
    { word: '음식', meaning: '사람이 먹는 먹거리', level: 'EASY' },
    { word: '음료', meaning: '마시는 마실거리', level: 'EASY' }
  ],
  '의': [
    { word: '의사', meaning: '병을 고치는 의료 전문가', level: 'EASY' },
    { word: '의자', meaning: '앉는 가구', level: 'EASY' },
    { word: '의복', meaning: '사람이 입는 옷', level: 'EASY' }
  ],
  '이': [
    { word: '이발소', meaning: '머리털을 깎아 주는 가게', level: 'EASY' },
    { word: '이야기', meaning: '담화나 사연', level: 'EASY' },
    { word: '이불', meaning: '덮고 자는 푹신한 침구', level: 'EASY' }
  ],
  '인': [
    { word: '인형', meaning: '사람이나 동물 모양 장난감', level: 'EASY' },
    { word: '인간', meaning: '사람', level: 'EASY' },
    { word: '인삼', meaning: '뿌리를 약용하는 약초', level: 'EASY' }
  ],
  '일': [
    { word: '일요일', meaning: '한 주의 주말 요일', level: 'EASY' },
    { word: '일기', meaning: '하루 일을 적는 글', level: 'EASY' },
    { word: '일출', meaning: '해가 돋음', level: 'EASY' }
  ],
  '자': [
    { word: '자전거', meaning: '페달로 굴리는 두 바퀴 차', level: 'EASY' },
    { word: '자연', meaning: '사람 힘이 가해지지 않은 본래 세계', level: 'EASY' },
    { word: '자동차', meaning: '원동기 도로 차량', level: 'EASY' },
    { word: '장미', meaning: '가시가 있고 아름다운 꽃', level: 'EASY' },
    { word: '장갑', meaning: '손에 끼는 의류', level: 'EASY' }
  ],
  '작': [
    { word: '작품', meaning: '만들어 낸 예술적 완성물', level: 'EASY' },
    { word: '작가', meaning: '글이나 그림을 지은 사람', level: 'EASY' }
  ],
  '잔': [
    { word: '잔디', meaning: '지표면을 덮는 벼과 풀', level: 'EASY' },
    { word: '잔치', meaning: '기쁜 일을 축하하는 모임', level: 'EASY' }
  ],
  '장': [
    { word: '장난감', meaning: '아이들이 놀 때 쓰는 도구', level: 'EASY' },
    { word: '장소', meaning: '어떤 일이 일어나는 공간', level: 'EASY' },
    { word: '장군', meaning: '군대를 이끄는 지휘관', level: 'EASY' }
  ],
  '재': [
    { word: '재미', meaning: '즐거움이나 흥미', level: 'EASY' },
    { word: '재료', meaning: '물건을 만드는 바탕', level: 'EASY' }
  ],
  '저': [
    { word: '저녁', meaning: '해가 지고 밤이 되기 전', level: 'EASY' },
    { word: '저울', meaning: '무게를 재는 도구', level: 'EASY' }
  ],
  '전': [
    { word: '전화기', meaning: '통화를 주고받는 기기', level: 'EASY' },
    { word: '전구', meaning: '불을 밝히는 유리 구체', level: 'EASY' },
    { word: '전자', meaning: '음전하를 띤 기본 입자', level: 'MEDIUM' }
  ],
  '정': [
    { word: '정원', meaning: '화초나 나무를 가꾼 뜰', level: 'EASY' },
    { word: '정류장', meaning: '버스가 멈추는 곳', level: 'EASY' },
    { word: '정보', meaning: '지식이나 소식 데이터', level: 'EASY' }
  ],
  '제': [
    { word: '제주도', meaning: '대한민국의 아름다운 섬', level: 'EASY' },
    { word: '제비', meaning: '봄을 알리는 참새목 새', level: 'EASY' }
  ],
  '조': [
    { word: '조개', meaning: '두 개의 껍데기를 가진 연체동물', level: 'EASY' },
    { word: '조류', meaning: '깃털과 날개가 있는 조류', level: 'EASY' },
    { word: '조각', meaning: '깎아서 만든 입체 예술', level: 'EASY' }
  ],
  '종': [
    { word: '종이', meaning: '글을 적거나 포장하는 재료', level: 'EASY' },
    { word: '종벨', meaning: '소리를 내는 쇠종', level: 'EASY' }
  ],
  '주': [
    { word: '주스', meaning: '과일을 짜서 만든 음료', level: 'EASY' },
    { word: '주택', meaning: '사람이 사는 집', level: 'EASY' },
    { word: '주말', meaning: '토요일과 일요일', level: 'EASY' }
  ],
  '중': [
    { word: '중학교', meaning: '초등학교 다음 교육 기관', level: 'EASY' },
    { word: '중심', meaning: '가장 한가운데 부분', level: 'EASY' }
  ],
  '지': [
    { word: '지구', meaning: '우리가 사는 행성', level: 'EASY' },
    { word: '지도', meaning: '지표면을 줄여 그린 그림', level: 'EASY' },
    { word: '지우개', meaning: '연필 자국을 지우는 도구', level: 'EASY' }
  ],
  '진': [
    { word: '진주', meaning: '조개 속에서 생기는 보석', level: 'EASY' },
    { word: '진달래', meaning: '봄에 피는 분홍빛 꽃', level: 'EASY' }
  ],
  '집': [
    { word: '집게', meaning: '물건을 집는 도구', level: 'EASY' },
    { word: '집웅', meaning: '지붕의 지방어', level: 'MEDIUM' }
  ],
  '차': [
    { word: '차량', meaning: '도로나 선로를 달리는 차', level: 'EASY' },
    { word: '차표', meaning: '승차권', level: 'EASY' }
  ],
  '창': [
    { word: '창문', meaning: '채광과 통풍을 위한 벽 창', level: 'EASY' },
    { word: '창가', meaning: '창문의 가까운 곳', level: 'EASY' }
  ],
  '채': [
    { word: '채소', meaning: '밭에 가꾸는 야채', level: 'EASY' }
  ],
  '천': [
    { word: '천문대', meaning: '천체를 관측하는 시설', level: 'EASY' },
    { word: '천사', meaning: '신의 메시지를 전하는 존재', level: 'EASY' }
  ],
  '철': [
    { word: '철도', meaning: '열차가 달리는 쇠길', level: 'EASY' },
    { word: '철학', meaning: '세계와 인간의 근본을 탐구하는 학문', level: 'MEDIUM' }
  ],
  '초': [
    { word: '촛불', meaning: '초에 붙인 불', level: 'EASY' },
    { word: '초등학교', meaning: '기초 의무 교육 기관', level: 'EASY' }
  ],
  '축': [
    { word: '축구', meaning: '발로 공을 차는 대표적 스포츠', level: 'EASY' },
    { word: '축제', meaning: '축하하여 벌이는 큰 행사', level: 'EASY' }
  ],
  '충': [
    { word: '충격', meaning: '강한 자극이나 힘', level: 'EASY' },
    { word: '충전', meaning: '에너지를 채움', level: 'EASY' }
  ],
  '치': [
    { word: '치즈', meaning: '우유를 발효시킨 식품', level: 'EASY' },
    { word: '치과', meaning: '치아 질환을 진료하는 병원', level: 'EASY' }
  ],
  '칠': [
    { word: '칠판', meaning: '분필로 글을 쓰는 판', level: 'EASY' },
    { word: '칠면조', meaning: '얼굴 색이 변하는 큰 새', level: 'EASY' }
  ],
  '카': [
    { word: '카메라', meaning: '사진 촬영 기기', level: 'EASY' },
    { word: '카드', meaning: '직사각형 지편', level: 'EASY' },
    { word: '카페', meaning: '차나 커피를 파는 곳', level: 'EASY' }
  ],
  '코': [
    { word: '코끼리', meaning: '긴 코를 가진 커다란 포유류', level: 'EASY' },
    { word: '코코넛', meaning: '열대 야자나무 열매', level: 'EASY' }
  ],
  '컴': [
    { word: '컴퓨터', meaning: '전자 계산 및 정보 처리 기기', level: 'EASY' }
  ],
  '타': [
    { word: '타자기', meaning: '글자를 인쇄하는 기계', level: 'MEDIUM' },
    { word: '타이어', meaning: '바퀴의 고무 테두리', level: 'EASY' },
    { word: '타조', meaning: '날지 못하는 제일 큰 새', level: 'EASY' }
  ],
  '탁': [
    { word: '탁구', meaning: '작은 라켓과 공으로 하는 운동', level: 'EASY' },
    { word: '탁자', meaning: '물건을 올려놓는 상', level: 'EASY' }
  ],
  '태': [
    { word: '태양', meaning: '태양계의 중심 항성', level: 'EASY' },
    { word: '태권도', meaning: '한국의 전통 무예', level: 'EASY' },
    { word: '태풍', meaning: '강한 바람과 비를 동반하는 소용돌이', level: 'EASY' }
  ],
  '통': [
    { word: '통신', meaning: '소식이나 정보를 나눔', level: 'EASY' },
    { word: '통화', meaning: '전화 대화', level: 'EASY' }
  ],
  '파': [
    { word: '파도', meaning: '바다의 물결', level: 'EASY' },
    { word: '파인애플', meaning: '달콤한 열대 과일', level: 'EASY' },
    { word: '파랑', meaning: '푸른 색', level: 'EASY' }
  ],
  '팽': [
    { word: '팽이', meaning: '돌리며 노는 장난감', level: 'EASY' }
  ],
  '평': [
    { word: '평화', meaning: '평온하고 조화로운 상태', level: 'EASY' },
    { word: '평야', meaning: '넓고 평평한 들판', level: 'EASY' }
  ],
  '포': [
    { word: '포도', meaning: '송이송이 달리는 보랏빛 과일', level: 'EASY' }
  ],
  '폭': [
    { word: '폭포', meaning: '절벽에서 떨어지는 물줄기', level: 'EASY' },
    { word: '폭풍', meaning: '매우 강한 비바람', level: 'EASY' }
  ],
  '표': [
    { word: '표범', meaning: '점박이 무늬의 맹수', level: 'EASY' },
    { word: '표지판', meaning: '안내 기호를 적은 판', level: 'EASY' }
  ],
  '풍': [
    { word: '풍선', meaning: '공기를 넣어 부풀리는 공', level: 'EASY' },
    { word: '풍경', meaning: '아름다운 자연 경치', level: 'EASY' }
  ],
  '피': [
    { word: '피아노', meaning: '건반 건반 건반 건반 악기', level: 'EASY' },
    { word: '피자', meaning: '치즈와 토핑을 얹은 이탈리아 요리', level: 'EASY' }
  ],
  '필': [
    { word: '필통', meaning: '필기도구를 넣는 통', level: 'EASY' },
    { word: '필름', meaning: '사진이나 영상을 기록하는 박막', level: 'EASY' }
  ],
  '하': [
    { word: '하늘', meaning: '지표 위의 무한한 공간', level: 'EASY' },
    { word: '학교', meaning: '배움의 가르침을 주는 기관', level: 'EASY' },
    { word: '하마', meaning: '물속에 사는 대형 포유류', level: 'EASY' }
  ],
  '학': [
    { word: '학용품', meaning: '공부할 때 쓰는 도구', level: 'EASY' },
    { word: '학자', meaning: '학문을 연구하는 사람', level: 'MEDIUM' }
  ],
  '한': [
    { word: '한국', meaning: '대한민국', level: 'EASY' },
    { word: '한글', meaning: '훈민정음 한글', level: 'EASY' },
    { word: '한복', meaning: '한국의 전통 의복', level: 'EASY' }
  ],
  '해': [
    { word: '해바라기', meaning: '태양을 향하는 노란 꽃', level: 'EASY' },
    { word: '해변', meaning: '바닷가 모래사장', level: 'EASY' },
    { word: '해양', meaning: '넓고 깊은 바다', level: 'MEDIUM' }
  ],
  '행': [
    { word: '행성', meaning: '항성 주위를 돌며 빛을 내지 않는 천체', level: 'EASY' },
    { word: '행운', meaning: '좋은 운수', level: 'EASY' }
  ],
  '향': [
    { word: '향기', meaning: '좋은 냄새', level: 'EASY' },
    { word: '향수', meaning: '향기를 내는 화장품', level: 'EASY' }
  ],
  '호': [
    { word: '호랑이', meaning: '용맹한 한국의 줄무늬 맹수', level: 'EASY' },
    { word: '호수', meaning: '육지에 둘러싸인 넓은 못', level: 'EASY' },
    { word: '호두', meaning: '단단한 껍데기 속의 고소한 견과류', level: 'EASY' }
  ],
  '화': [
    { word: '화가', meaning: '그림을 그리는 예술가', level: 'EASY' },
    { word: '화분', meaning: '식물을 심는 그릇', level: 'EASY' },
    { word: '화장실', meaning: '용변을 보는 방', level: 'EASY' }
  ],
  '환': [
    { word: '환영', meaning: '기쁘게 맞이함', level: 'EASY' },
    { word: '환상', meaning: '꿈처럼 신비로운 일', level: 'EASY' }
  ],
  '황': [
    { word: '황금', meaning: '순수한 찬란한 금', level: 'EASY' },
    { word: '황소', meaning: '몸집이 커다란 노란 소', level: 'EASY' }
  ],
  '회': [
    { word: '회오리', meaning: '나선형으로 세차게 빙빙 도는 기류', level: 'EASY' },
    { word: '회사', meaning: '상행위나 영리 목적으로 모인 단체', level: 'EASY' }
  ],
  '효': [
    { word: '효도', meaning: '부모를 정성껏 모심', level: 'EASY' },
    { word: '효소', meaning: '생물체 내 생화학 반응을 촉매하는 단백질', level: 'MEDIUM' }
  ],
  '후': [
    { word: '후추', meaning: '매콤한 맛을 내는 조미료', level: 'EASY' },
    { word: '후식', meaning: '식사 후에 먹는 디저트', level: 'EASY' }
  ],
  '휴': [
    { word: '휴지', meaning: '몸이나 주변을 닦는 종이', level: 'EASY' },
    { word: '휴가', meaning: '일을 쉬고 가지는 휴식 시간', level: 'EASY' }
  ],
  '희': [
    { word: '희망', meaning: '밝은 미래에 대한 기대', level: 'EASY' },
    { word: '희곡', meaning: '연극의 본문 대본', level: 'MEDIUM' }
  ]
};

export function findMeaningInDict(word: string): string | null {
  for (const key of Object.keys(COMPREHENSIVE_DICTIONARY)) {
    const list = COMPREHENSIVE_DICTIONARY[key] || [];
    const found = list.find((item) => item.word === word);
    if (found) return found.meaning;
  }
  return null;
}
