import { useCallback, useEffect, useMemo, useState } from 'react';
import { BOARD_COUNT, MAX_GUESSES, WORD_LENGTH } from './constants';
import { evaluateGuess } from './evaluate';
import type { BoardState, KeyState, LetterState } from './types';
import { VALID_WORDS } from './wordBank';

const gradeWeight: Record<Exclude<LetterState, 'empty' | 'pending'>, number> = {
  absent: 1,
  present: 2,
  correct: 3,
};

export const useOctordleGame = (solutions: string[], validWords: Set<string> = VALID_WORDS) => {
  const [turns, setTurns] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const isEditableTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
  };

  const boards = useMemo<BoardState[]>(() => {
    return solutions.map((solution, index) => {
      const rows = turns.map((guess) => ({
        guess,
        states: evaluateGuess(guess, solution),
      }));

      const solved = turns.some((guess) => guess === solution);
      const failed = !solved && turns.length >= MAX_GUESSES;

      if (turns.length < MAX_GUESSES && !failed && !solved) {
        rows.push({
          guess: currentGuess,
          states: Array.from({ length: currentGuess.length }, () => 'pending'),
        });
      }

      return {
        id: index + 1,
        solution,
        solved,
        failed,
        rows,
      };
    });
  }, [currentGuess, solutions, turns]);

  const solvedCount = boards.filter((board) => board.solved).length;
  const boardCount = solutions.length || BOARD_COUNT;
  const gameOver = solvedCount === boardCount || turns.length >= MAX_GUESSES;

  const keyState = useMemo<KeyState>(() => {
    const state: KeyState = {};

    for (const board of boards) {
      for (const row of board.rows) {
        if (row.guess.length !== WORD_LENGTH) continue;

        row.guess.split('').forEach((letter, index) => {
          const grade = row.states[index];
          if (grade === 'empty' || grade === 'pending') return;

          if (!state[letter] || gradeWeight[grade] > gradeWeight[state[letter]]) {
            state[letter] = grade;
          }
        });
      }
    }

    return state;
  }, [boards]);

  const submitGuess = useCallback(() => {
    if (gameOver) return;

    if (currentGuess.length !== WORD_LENGTH) {
      setFeedback(`Need ${WORD_LENGTH} letters.`);
      return;
    }

    if (!validWords.has(currentGuess)) {
      setFeedback('Word not in dictionary.');
      return;
    }

    setFeedback(null);
    setTurns((previous) => [...previous, currentGuess]);
    setCurrentGuess('');
  }, [currentGuess, gameOver, validWords]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === 'Enter') {
        submitGuess();
        return;
      }

      if (key === 'Backspace') {
        setFeedback(null);
        setCurrentGuess((previous) => previous.slice(0, -1));
        return;
      }

      if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setFeedback(null);
        setCurrentGuess((previous) => previous + key);
      }
    },
    [currentGuess.length, gameOver, submitGuess]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
      if (key === 'Enter' || key === 'Backspace' || /^[A-Z]$/.test(key)) {
        event.preventDefault();
        handleKey(key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const message = useMemo(() => {
    if (feedback) {
      return feedback;
    }

    if (solvedCount === boardCount) {
      return 'All boards solved. Nice run.';
    }

    if (turns.length >= MAX_GUESSES) {
      return 'Out of turns. Try again tomorrow.';
    }

    return 'Guess a 5-letter word. Your guess is applied to all 8 boards.';
  }, [boardCount, feedback, solvedCount, turns.length]);

  return {
    boards,
    turns,
    currentGuess,
    message,
    solvedCount,
    gameOver,
    keyState,
    handleKey,
  };
};
