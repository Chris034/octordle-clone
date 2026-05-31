import { BOARD_COUNT } from './constants';
import { all, answers } from './wordleWords';

const normalizeWord = (word: string) => word.trim().toUpperCase();
const isFiveLetterWord = (word: string) => /^[A-Z]{5}$/.test(word);

const buildWordSet = (words: string[]) => {
  return [...new Set(words.map(normalizeWord).filter(isFiveLetterWord))];
};

export const SOLUTION_POOL = buildWordSet(answers);
export const VALID_WORDS = new Set(buildWordSet(all));

export const getHardPresetSolutions = (date = new Date()) => {
  const seed = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  const words = [...SOLUTION_POOL];

  for (let index = words.length - 1; index > 0; index -= 1) {
    const swapIndex = (seed + index * 31) % (index + 1);
    [words[index], words[swapIndex]] = [words[swapIndex], words[index]];
  }

  return words.slice(0, BOARD_COUNT);
};
