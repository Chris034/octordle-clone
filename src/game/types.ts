export type LetterState = 'empty' | 'pending' | 'absent' | 'present' | 'correct';

export type KeyState = Record<string, Exclude<LetterState, 'empty' | 'pending'>>;

export type BoardState = {
  id: number;
  solution: string;
  solved: boolean;
  failed: boolean;
  rows: {
    guess: string;
    states: LetterState[];
  }[];
};
