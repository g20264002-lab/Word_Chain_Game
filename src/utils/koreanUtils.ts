// Korean Initial Sound Rule (두음법칙) & Syllable Utility

// Initial consonants array (초성)
export const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * Extract initial consonants from a Hangul word (e.g., "다람쥐" -> "ㄷㄹㅈ")
 */
export function getInitialConsonants(word: string): string {
  let result = '';
  for (let i = 0; i < word.length; i++) {
    const code = word.charCodeAt(i) - 44032;
    if (code >= 0 && code <= 11172) {
      const initialIndex = Math.floor(code / 588);
      result += INITIAL_CONSONANTS[initialIndex];
    } else {
      result += word[i];
    }
  }
  return result;
}

/**
 * Returns valid starting syllables for the next word based on current ending syllable and initial sound rule (두음법칙)
 */
export function getValidNextSyllables(lastChar: string, allowRule: boolean): string[] {
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

/**
 * Check if word consists only of valid Hangul characters
 */
export function isValidHangulWord(word: string): boolean {
  return /^[가-힣]+$/.test(word);
}
