import { $store } from '@/utils/store';
import { useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { subscribeKey } from 'valtio/utils';

export const INPUT_ID = 'input';

export const Typer = () => {
  const { value } = useSnapshot($store, { sync: true });
  const { inputWords, randomWords } = useSnapshot($store);

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
    <>
      <input
        id={INPUT_ID}
        autoFocus={true}
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
  );
};
