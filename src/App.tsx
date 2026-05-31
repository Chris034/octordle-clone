import { useMemo, useState } from 'react';
import BoardGrid from './components/BoardGrid';
import Keyboard from './components/Keyboard';
import { BOARD_COUNT, MAX_GUESSES, WORD_LENGTH } from './game/constants';
import { useOctordleGame } from './game/useOctordleGame';
import { getHardPresetSolutions, VALID_WORDS } from './game/wordBank';
import './App.css';

type SolutionPreset = 'hard' | 'custom';

const EMPTY_CUSTOM_WORDS = Array.from({ length: BOARD_COUNT }, () => '');

const normalizeCustomWord = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, WORD_LENGTH);

type GameRoundProps = {
  activePreset: SolutionPreset;
  controls: React.ReactNode;
  solutions: string[];
  validWords: Set<string>;
};

function GameRound({ activePreset, controls, solutions, validWords }: GameRoundProps) {
  const { boards, currentGuess, turns, message, solvedCount, gameOver, keyState, handleKey, invalidGuess, invalidGuessVersion } = useOctordleGame(solutions, validWords);

  return (
    <>
      <header className="top-bar">
        <div className="top-bar-row">
          <div className="title-block">
            <p className="kicker">Octordle</p>
            <h1>8-Board Wordle</h1>
          </div>
          {controls}
        </div>
        <div className="stats">
          <span>{solvedCount}/{BOARD_COUNT} solved</span>
          <span>{MAX_GUESSES - turns.length} turns left</span>
          <span>{currentGuess || '.....'}</span>
          <span>{activePreset === 'hard' ? 'HARD preset' : 'Custom preset'}</span>
        </div>
        <p className="message" aria-live="polite">{gameOver ? 'Round complete.' : message}</p>
      </header>

      <BoardGrid
        boards={boards}
        currentGuess={currentGuess}
        invalidGuess={invalidGuess}
        invalidGuessVersion={invalidGuessVersion}
      />
      <Keyboard keyState={keyState} onKey={handleKey} />
    </>
  );
}

function App() {
  const [selectedPreset, setSelectedPreset] = useState<SolutionPreset>('hard');
  const [activePreset, setActivePreset] = useState<SolutionPreset>('hard');
  const [isCustomPanelOpen, setIsCustomPanelOpen] = useState(false);
  const [customWords, setCustomWords] = useState<string[]>(EMPTY_CUSTOM_WORDS);
  const [activeSolutions, setActiveSolutions] = useState<string[]>(() => getHardPresetSolutions());
  const [roundVersion, setRoundVersion] = useState(0);
  const [customStatus, setCustomStatus] = useState('Enter 8 words to build your own board set.');

  const activeValidWords = useMemo(() => {
    if (activePreset === 'hard') {
      return VALID_WORDS;
    }

    return new Set([...VALID_WORDS, ...activeSolutions]);
  }, [activePreset, activeSolutions]);

  const handlePresetChange = (preset: SolutionPreset) => {
    setSelectedPreset(preset);

    if (preset === 'hard') {
      setActivePreset('hard');
      setIsCustomPanelOpen(false);
      setActiveSolutions(getHardPresetSolutions());
      setRoundVersion((version) => version + 1);
      setCustomStatus('Enter 8 words to build your own board set.');
      return;
    }

    setIsCustomPanelOpen(true);
    setCustomStatus('Enter 8 five-letter solutions, then start a custom round.');
  };

  const handleCustomWordChange = (index: number, value: string) => {
    setCustomWords((previous) => previous.map((word, wordIndex) => (wordIndex === index ? normalizeCustomWord(value) : word)));
    setCustomStatus('Enter 8 five-letter solutions, then start a custom round.');
  };

  const applyCustomSolutions = () => {
    const trimmedWords = customWords.map((word) => word.trim().toUpperCase());
    const incompleteIndex = trimmedWords.findIndex((word) => word.length !== WORD_LENGTH);

    if (incompleteIndex >= 0) {
      setCustomStatus(`Board ${incompleteIndex + 1} needs a ${WORD_LENGTH}-letter word.`);
      return;
    }

    const uniqueWords = new Set(trimmedWords);
    if (uniqueWords.size !== trimmedWords.length) {
      setCustomStatus('Custom solutions must all be unique.');
      return;
    }

    setActivePreset('custom');
    setIsCustomPanelOpen(false);
    setActiveSolutions(trimmedWords);
    setRoundVersion((version) => version + 1);
    setCustomStatus('Custom solutions loaded.');
  };

  const roundKey = `${roundVersion}:${activePreset}:${activeSolutions.join('-')}`;

  const controls = (
    <section className="preset-panel" aria-label="Solution preset switcher">
      <div className="preset-switch" role="tablist" aria-label="Solution preset">
        <button
          type="button"
          className={`preset-button ${selectedPreset === 'hard' ? 'active' : ''}`}
          aria-pressed={selectedPreset === 'hard'}
          onClick={() => handlePresetChange('hard')}
        >
          HARD
        </button>
        <button
          type="button"
          className={`preset-button ${selectedPreset === 'custom' ? 'active' : ''}`}
          aria-pressed={selectedPreset === 'custom'}
          onClick={() => handlePresetChange('custom')}
        >
          Custom
        </button>
      </div>

      {isCustomPanelOpen ? (
        <div className="custom-panel">
          <div className="custom-grid">
            {customWords.map((word, index) => (
              <label key={index} className="custom-field">
                <span>Board {index + 1}</span>
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={WORD_LENGTH}
                  value={word}
                  onChange={(event) => handleCustomWordChange(index, event.target.value)}
                  placeholder="CRANE"
                  aria-label={`Custom solution ${index + 1}`}
                />
              </label>
            ))}
          </div>
          <div className="custom-actions">
            <p className="preset-note" aria-live="polite">{customStatus}</p>
            <button type="button" className="preset-apply" onClick={applyCustomSolutions}>
              Start Custom Round
            </button>
          </div>
        </div>
      ) : (
        <p className="preset-note">
          {selectedPreset === 'custom'
            ? `${customStatus} Click Custom to edit the solution list again.`
            : 'HARD loads the fixed 8-word brutal preset.'}
        </p>
      )}
    </section>
  );

  return (
    <main className="app-shell">
      <GameRound key={roundKey} activePreset={activePreset} controls={controls} solutions={activeSolutions} validWords={activeValidWords} />
    </main>
  );
}

export default App;
