import type { LetterState } from './types';

export const evaluateGuess = (guess: string, solution: string): LetterState[] => {
  const result: LetterState[] = Array.from({ length: guess.length }, () => 'absent');
  const unmatched = solution.split('');

  for (let index = 0; index < guess.length; index += 1) {
    if (guess[index] === solution[index]) {
      result[index] = 'correct';
      unmatched[index] = '#';
    }
  }

  for (let index = 0; index < guess.length; index += 1) {
    if (result[index] === 'correct') continue;

    const letterIndex = unmatched.indexOf(guess[index]);
    if (letterIndex >= 0) {
      result[index] = 'present';
      unmatched[letterIndex] = '#';
    }
  }

  return result;
};
