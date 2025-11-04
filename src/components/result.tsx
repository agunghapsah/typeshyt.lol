import { $store } from '@/utils/store';
import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

export const Result = () => {
  const { inputWords, randomWords, duration } = useSnapshot($store);
  const minuteFactor = useMemo(() => 60_000 / duration, [duration]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span>
          Words per minute:{' '}
          {Math.trunc(
            inputWords.filter((word, wordIndex) => {
              const expectedWord = randomWords[wordIndex];
              return word === expectedWord;
            }).length * minuteFactor
          )}
        </span>

        <span>
          Accuracy:{' '}
          {Math.trunc(
            (inputWords.reduce((acc, word, wordIndex) => {
              const expectedWord = randomWords[wordIndex];
              if (word === expectedWord) {
                acc++;
              }
              return acc;
            }, 0) /
              inputWords.length) *
              100
          )}
          %
        </span>

        <span>Duration: {duration / 1000}s</span>
      </div>

      <button
        className="text-xs border py-1 px-3 rounded-lg self-center"
        onClick={() => $store.reset()}
      >
        Try again
      </button>
    </div>
  );
};
