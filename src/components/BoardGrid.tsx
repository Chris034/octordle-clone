import type { BoardState } from '../game/types';
import Board from './Board';

type BoardGridProps = {
  boards: BoardState[];
};

export default function BoardGrid({ boards }: BoardGridProps) {
  return (
    <section className="boards-wrap" aria-label="Octordle boards">
      {boards.map((board) => (
        <Board key={board.id} board={board} />
      ))}
    </section>
  );
}
