import type { BoardState } from '../game/types';
import Board from './Board';

type BoardGridProps = {
  boards: BoardState[];
  currentGuess: string;
  invalidGuess: string | null;
  invalidGuessVersion: number;
};

export default function BoardGrid({ boards, currentGuess, invalidGuess, invalidGuessVersion }: BoardGridProps) {
  return (
    <section className="boards-wrap" aria-label="Octordle boards">
      {boards.map((board) => (
        <Board
          key={board.id}
          board={board}
          currentGuess={currentGuess}
          invalidGuess={invalidGuess}
          invalidGuessVersion={invalidGuessVersion}
        />
      ))}
    </section>
  );
}
