import { $store } from '@/utils/store';
import { useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { subscribeKey } from 'valtio/utils';

export const INPUT_ID = 'input';

export const Typer = () => {
  return (
    <div className="h-18 overflow-hidden">
      <span className="tracking-wide relative">
        <InputWords />
        <Input />
        <RandomWords />
      </span>
    </div>
  );
};

const Input = () => {
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
        className="opacity-0 absolute pointer-events-none"
        value={value}
        onChange={onChange}
      />

      <Word word={value} expectedWord={randomWords[inputWords.length]} />

      {/* {value.length === 0 && (
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
      )} */}
    </>
  );
};

const Word = ({
  word,
  expectedWord,
}: {
  word: string;
  expectedWord?: string;
}) => {
  return (
    <>
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
    </>
  );
};

const InputWords = () => {
  const { inputWords, randomWords } = useSnapshot($store);

  return (
    <span>
      {inputWords.map((word, wordIndex) => {
        const expectedWord = randomWords[wordIndex];
        return (
          <span>
            <span
              className="border-b-red-500"
              style={{
                borderBottomWidth: word !== expectedWord ? '1px' : undefined,
              }}
            >
              <Word key={wordIndex} word={word} expectedWord={expectedWord} />
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
  );
};

const CurrentWord = () => {
  const { value } = useSnapshot($store, { sync: true });
  const inputWordsLength = useSnapshot($store.inputWords).length;
  const randomWord = useSnapshot($store.randomWords)[inputWordsLength];

  return (
    <span id={inputWordsLength.toString()} className="scroll-mt-6">
      {randomWord
        .substring(value.length, randomWord.length)
        .split('')
        .map((letter, letterIndex) => (
          <span key={letterIndex}>{letter}</span>
        ))}{' '}
    </span>
  );
};

const RandomWords = () => {
  const { randomWords } = useSnapshot($store);
  const inputWordsLength = useSnapshot($store.inputWords).length;

  return (
    <span className="opacity-40">
      {randomWords.map((word, wordIndex) =>
        wordIndex < inputWordsLength ? null : wordIndex === inputWordsLength ? (
          <CurrentWord key={wordIndex} />
        ) : (
          <span
            key={wordIndex}
            id={wordIndex.toString()}
            className="scroll-mt-6"
          >
            {word}{' '}
          </span>
        )
      )}
    </span>
  );
};
