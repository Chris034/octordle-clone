import { KEYBOARD_ROWS } from '../game/constants';
import type { KeyState } from '../game/types';

type KeyboardProps = {
  keyState: KeyState;
  onKey: (key: string) => void;
};

export default function Keyboard({ keyState, onKey }: KeyboardProps) {
  return (
    <section className="keyboard" aria-label="On-screen keyboard">
      {KEYBOARD_ROWS.map((row) => (
        <div key={row} className="kb-row">
          {row.split('').map((key) => (
            <button
              key={key}
              type="button"
              className={`kb-key ${keyState[key] ?? ''}`.trim()}
              onClick={() => onKey(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="kb-row">
        <button type="button" className="kb-key utility" onClick={() => onKey('Enter')}>
          Enter
        </button>
        <button type="button" className="kb-key utility" onClick={() => onKey('Backspace')}>
          Delete
        </button>
      </div>
    </section>
  );
}
