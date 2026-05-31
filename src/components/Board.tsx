import { MAX_GUESSES, WORD_LENGTH } from '../game/constants';
import type { BoardState, LetterState } from '../game/types';

type BoardProps = {
  board: BoardState;
};

const toLetters = (guess: string): string[] => {
  const letters = guess.split('');
  return [...letters, ...Array.from({ length: WORD_LENGTH - letters.length }, () => '')];
};

const tileClass = (state: LetterState) => `tile ${state}`;

export default function Board({ board }: BoardProps) {
  const paddedRows = [
    ...board.rows,
    ...Array.from({ length: Math.max(0, MAX_GUESSES - board.rows.length) }, () => ({ guess: '', states: [] as LetterState[] })),
  ];

  return (
    <section className={`board ${board.solved ? 'solved' : ''} ${board.failed ? 'failed' : ''}`}>
      <header className="board-head">
        <h3>Board {board.id}</h3>
        <span>{board.solved ? 'Solved' : board.failed ? 'Missed' : 'In Play'}</span>
      </header>

      <div className="board-grid" aria-label={`Board ${board.id}`}>
        {paddedRows.map((row, rowIndex) => {
          const letters = toLetters(row.guess);
          return (
            <div key={`${board.id}-${rowIndex}`} className="board-row">
              {letters.map((letter, letterIndex) => {
                const state = row.states[letterIndex] ?? 'empty';
                return (
                  <span key={`${board.id}-${rowIndex}-${letterIndex}`} className={tileClass(state)}>
                    {letter}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
