import { emptyArray } from '@/utils/empty-array';
import { getRandomWords } from '@/utils/random-words';
import { replaceArray } from '@/utils/replace-array';
import { $store, DEFAULT_DURATION, WORD_COUNT } from '@/utils/store';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { subscribeKey, watch } from 'valtio/utils';

export const Route = createFileRoute('/')({
  component: App,
});

// Characters per minute
// Words per minute
// Accuracy

function App() {
  const ref = useRef<HTMLInputElement>(null);
  const { value } = useSnapshot($store, { sync: true });
  const { state, inputWords, randomWords, elapsedTime, duration } =
    useSnapshot($store);
  const minuteFactor = useMemo(() => 60_000 / duration, [duration]);

  useEffect(() => {
    const onType = (event: KeyboardEvent) => {
      // Reset shortcut
      if (
        $store.state === 'END' &&
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'R' || event.key === 'r')
      ) {
        reset();
      }

      // Start on type
      if ($store.state === 'IDLE') {
        ref.current?.focus();
        $store.state = 'PLAYING';
        $store.startTime = $store.startTime ?? Date.now();
        return;
      }

      // Edit previous word on backspace
      if (
        $store.state === 'PLAYING' &&
        $store.value.length === 0 &&
        event.key === 'Backspace'
      ) {
        const previousInputWord =
          $store.inputWords[$store.inputWords.length - 1];
        if (!previousInputWord) return;

        const expectedWord = $store.randomWords[$store.inputWords.length - 1];
        if (previousInputWord === expectedWord) return;

        $store.value = previousInputWord;
        $store.inputWords.pop();
      }
    };

    window.document.addEventListener('keydown', onType);

    return () => {
      window.document.removeEventListener('keydown', onType);
    };
  }, []);

  useEffect(() => {
    return watch((get) => {
      const { startTime, state } = get($store);

      if (!startTime || state !== 'PLAYING') {
        console.log('Skip timer. No start time.');
        return;
      }

      // console.log("Starting interval");
      const interval = setInterval(() => {
        // console.log("Setting elapsed time");
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime >= $store.duration) {
          $store.state = 'END';
          $store.elapsedTime = $store.duration;
        }

        $store.elapsedTime = elapsedTime;
      }, 50);

      return () => {
        console.log('Clearing interval');
        clearInterval(interval);
      };
    });
  }, []);

  const reset = useCallback(() => {
    replaceArray($store.randomWords, getRandomWords(WORD_COUNT));
    emptyArray($store.inputWords);
    $store.value = '';
    $store.duration = DEFAULT_DURATION;
    $store.elapsedTime = 0;
    $store.startTime = undefined;

    setTimeout(() => {
      $store.state = 'IDLE';
    });
  }, []);

  // Scroll to current word
  useEffect(() => {
    return subscribeKey($store.inputWords, 'length', (inputWordsLength) => {
      const word = document.getElementById(inputWordsLength.toString());
      word?.scrollIntoView();
    });
  }, []);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    $store.setValue(value);
  }, []);

  return (
    <div
      className={`
        bg-black
        h-screen
        w-screen
        text-white
        flex
        flex-col
        items-center
        p-8
        gap-4
      `}
    >
      <h1 className="text-4xl font-bold">typeshyt</h1>

      {state !== 'END' && (
        <>
          <input
            autoFocus={true}
            ref={ref}
            className="opacity-0"
            value={value}
            onChange={onChange}
          />

          <div className="h-18 overflow-hidden">
            <span className="tracking-wide relative">
              <span>
                {inputWords.map((word, wordIndex) => {
                  const expectedWord = randomWords[wordIndex];

                  return (
                    <span>
                      <span
                        className="border-b-red-500"
                        style={{
                          borderBottomWidth:
                            word !== expectedWord ? '1px' : undefined,
                        }}
                      >
                        {word.split('').map((letter, letterIndex) => {
                          const expectedLetter = expectedWord?.[letterIndex];
                          return (
                            <span
                              key={letterIndex}
                              style={{
                                color: !expectedLetter
                                  ? 'pink'
                                  : letter !== expectedLetter
                                    ? 'red'
                                    : 'inherit',
                              }}
                            >
                              {expectedLetter ?? letter}
                            </span>
                          );
                        })}
                        {expectedWord
                          ?.substring(word.length, expectedWord.length)
                          .split('')
                          .map((letter, letterIndex) => (
                            <span key={letterIndex} className="opacity-40">
                              {letter}
                            </span>
                          ))}
                      </span>{' '}
                    </span>
                  );
                })}
              </span>

              {value.split('').map((letter, letterIndex) => {
                const expectedLetter =
                  randomWords[inputWords.length]?.[letterIndex];
                return (
                  <span
                    key={letterIndex}
                    style={{
                      color: !expectedLetter
                        ? 'pink'
                        : letter !== expectedLetter
                          ? 'red'
                          : 'inherit',
                    }}
                    className="relative"
                  >
                    {expectedLetter ?? letter}
                    {letterIndex === value.length - 1 && (
                      <span className="animate-pulse absolute -right-1">|</span>
                    )}
                  </span>
                );
              })}

              {value.length === 0 && (
                <span
                  className="animate-pulse absolute"
                  style={{
                    left:
                      value.length === 0 && inputWords.length === 0
                        ? '-0.3rem'
                        : undefined,
                  }}
                >
                  |
                </span>
              )}

              <span className="opacity-40">
                {randomWords.map((word, wordIndex) =>
                  wordIndex < inputWords.length ? null : (
                    <span
                      key={wordIndex}
                      id={wordIndex.toString()}
                      className="scroll-mt-6"
                    >
                      {(wordIndex === inputWords.length
                        ? word.substring(value.length, word.length)
                        : word
                      )
                        .split('')
                        .map((letter, letterIndex) => (
                          <span key={letterIndex}>{letter}</span>
                        ))}{' '}
                    </span>
                  )
                )}
              </span>
            </span>
          </div>
        </>
      )}

      {state === 'END' && (
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
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      )}

      {state === 'PLAYING' && (
        <div>{duration / 1000 - Math.trunc(elapsedTime / 1000)}</div>
      )}
    </div>
  );
}
