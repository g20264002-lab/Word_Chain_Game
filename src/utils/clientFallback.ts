import { DifficultyLevel, GameRuleOptions, HintItem } from '../types';
import { getValidNextSyllables, isValidHangulWord } from './koreanUtils';
import { COMPREHENSIVE_DICTIONARY, findMeaningInDict, DictEntry } from './koreanDictionary';

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

export const LOCAL_DICTIONARY = COMPREHENSIVE_DICTIONARY;

export function findLocalMeaning(word: string): string | null {
  return findMeaningInDict(word);
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
