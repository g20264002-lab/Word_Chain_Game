export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'MASTER';

export type WordLengthMode = 'ANY' | 'TWO_ONLY' | 'THREE_ONLY' | 'TWO_TO_FOUR';

export interface GameRuleOptions {
  allowInitialSoundRule: boolean; // 두음법칙 허용
  allowOneShotWords: boolean;     // 한방단어 허용
  wordLengthMode: WordLengthMode; // 글자 수 제한
  timerSeconds: number;           // 턴 타이머 (0 = 무제한)
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  word?: string;
  meaning?: string;
  comment?: string;
  timestamp: number;
  isInvalid?: boolean;
  invalidReason?: string;
}

export interface HintItem {
  word: string;
  clue: string;
  initialConsonants?: string;
}

export interface GameStats {
  currentStreak: number;
  maxStreak: number;
  wins: number;
  losses: number;
  wordsUsedCount: number;
  longestWord: string;
  wordHistory: { word: string; sender: 'user' | 'ai'; timestamp: number; meaning?: string }[];
}

export interface DifficultyConfig {
  id: DifficultyLevel;
  title: string;
  titleKo: string;
  subtitle: string;
  badgeBg: string;
  badgeTextColor: string;
  avatarIcon: string;
  colorTheme: string;
  description: string;
  vocabularyLevel: string;
}
