import { BOARD_COUNT } from './constants';
import { all, answers } from './wordleWords';

const HARD_PRESET_SOLUTIONS = [
  'FEMME',
  'GAMMA',
  'MAGMA',
  'BUXOM',
  'JUMBO',
  'JEWEL',
  'TWIXT',
  'JAZZY',
];

const normalizeWord = (word: string) => word.trim().toUpperCase();
const isFiveLetterWord = (word: string) => /^[A-Z]{5}$/.test(word);

const buildWordSet = (words: string[]) => {
  return [...new Set(words.map(normalizeWord).filter(isFiveLetterWord))];
};

export const SOLUTION_POOL = buildWordSet(answers);
export const VALID_WORDS = new Set(buildWordSet(all));

export const getHardPresetSolutions = () => HARD_PRESET_SOLUTIONS.slice(0, BOARD_COUNT);
