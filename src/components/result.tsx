import { $store } from '@/utils/store';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';

export const Result = () => {
  const { inputWords, randomWords, duration } = useSnapshot($store);
  const minuteFactor = useMemo(() => 60_000 / duration, [duration]);

  // Reset shortcut
  useEffect(() => {
    const onType = (event: KeyboardEvent) => {
      if (
        $store.state === 'END' &&
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'R' || event.key === 'r')
      ) {
        $store.reset();
      }
    };

    window.document.addEventListener('keydown', onType);

    return () => {
      window.document.removeEventListener('keydown', onType);
    };
  }, []);

  const { accuracy, correct, incorrect } = useMemo(() => {
    const { correct, incorrect } = $store.inputHistory.reduce(
      (acc, { letter, expectedLetter }) => {
        if (letter === expectedLetter) {
          acc.correct++;
        } else {
          acc.incorrect++;
        }
        return acc;
      },
      {
        correct: 0,
        incorrect: 0,
      } as {
        correct: number;
        incorrect: number;
      }
    );

    const accuracy =
      Math.trunc((correct / $store.inputHistory.length) * 100 * 100) / 100 || 0;
    return { accuracy, correct, incorrect };
  }, []);

  const wordsPerMinute = useMemo(() => {
    return Math.trunc(
      inputWords.filter((word, wordIndex) => {
        const expectedWord = randomWords[wordIndex];
        return word === expectedWord;
      }).length * minuteFactor
    );
  }, []);

  return (
    <div className="flex flex-col gap-8 text-3xl">
      <div className="flex flex-col gap-2">
        <span>Words per minute: {wordsPerMinute}</span>
        <span>Accuracy: {accuracy}%</span>
        <span>Correct keys: {correct}</span>
        <span>Wrong keys: {incorrect}</span>
        <span>Duration: {duration / 1000}s</span>
      </div>

      <button
        className="text-xl border py-1 px-3 rounded-lg self-center"
        onClick={() => $store.reset()}
      >
        Try again
      </button>
    </div>
  );
};
