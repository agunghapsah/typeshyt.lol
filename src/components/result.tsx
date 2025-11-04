import { $store } from '@/utils/store';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';

export const Result = () => {
  const { inputWords, randomWords, duration } = useSnapshot($store);
  const minuteFactor = useMemo(() => 60_000 / duration, [duration]);

  // Reset shortcut
  useEffect(() => {
    const onType = (event: KeyboardEvent) => {
      if ($store.state === 'END' && event.ctrlKey && event.key === ' ') {
        event.preventDefault();
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
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-start md:flex-row flex-col">
        <div
          className={`
            border-2
            flex
            justify-center
            items-center
            p-4
            rounded-2xl
            border-gray-700
          `}
        >
          <span>
            <span className="text-7xl">{wordsPerMinute}</span>
            <span className="text-xl"> WPM</span>
          </span>
        </div>

        <div className="flex flex-col gap-1 text-xl">
          <span className="text-gray-400">
            Accuracy: <span className="text-white">{accuracy}%</span>
          </span>
          <span className="text-gray-400">
            Correct keys: <span className="text-white">{correct}</span>
          </span>
          <span className="text-gray-400">
            Wrong keys: <span className="text-white">{incorrect}</span>
          </span>
          <span className="text-gray-400">
            Duration: <span className="text-white">{duration / 1000}s</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 items-center">
        <button
          className={`
          text-lg
          border
          py-2
          px-4
          rounded-lg
          self-center
          border-gray-600
          text-gray-200
        `}
          onClick={() => $store.reset()}
        >
          Try again
        </button>

        <span
          className={`
            font-mono
            text-sm
            text-gray-500
          `}
        >
          cntl + space
        </span>
      </div>
    </div>
  );
};
