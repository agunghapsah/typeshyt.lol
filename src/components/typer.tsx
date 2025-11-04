import { $store } from '@/utils/store';
import { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { subscribeKey } from 'valtio/utils';

export const INPUT_ID = 'input';
export const CURRENT_WORD_ID = 'currentWord';

export const Typer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFocus } = useSnapshot($store);

  // Scroll to current word
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });

    return subscribeKey($store.inputWords, 'length', (inputWordsLength) => {
      const word = document.getElementById(inputWordsLength.toString());
      word?.scrollIntoView();
    });
  }, []);

  // Edit previous word on backspace
  useEffect(() => {
    const onType = (event: KeyboardEvent) => {
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

  return (
    <div
      ref={containerRef}
      className={`
        overflow-x-hidden
        overflow-y-hidden
        relative
      `}
      style={{
        fontSize: '2rem',
        height: '9rem',
      }}
      onClick={() => {
        document.getElementById(INPUT_ID)?.focus();
      }}
    >
      <div
        data-focus={isFocus}
        className={`
          absolute
          size-full
          flex
          items-center
          justify-center
          bg-black/20
          z-1
          backdrop-blur-xs
          opacity-100
          data-[focus=true]:opacity-0
          transition-opacity
        `}
      >
        <p>Click here to continue</p>
      </div>

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

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();

    if (!value.endsWith(' ')) {
      const letterIndex = value.length - 1;
      const letter = value[letterIndex];
      const expectedLetter =
        $store.randomWords[$store.inputWords.length]?.[letterIndex];

      $store.inputHistory.push({
        letter,
        expectedLetter,
        timestamp: Date.now(),
      });
    }

    $store.setValue(value);
  }, []);

  const onFocus = useCallback(() => ($store.isFocus = true), []);
  const onBlur = useCallback(() => ($store.isFocus = false), []);

  useEffect(() => {
    const input = document.getElementById(INPUT_ID);
    $store.isFocus = document.activeElement === input;
  }, []);

  return (
    <>
      <input
        id={INPUT_ID}
        autoFocus={true}
        className="opacity-0 absolute pointer-events-none max-w-0"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
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
          <span key={wordIndex}>
            <span
              className="border-b-red-500"
              style={{
                borderBottomWidth: word !== expectedWord ? '1px' : undefined,
              }}
            >
              <Word word={word} expectedWord={expectedWord} />
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
    <span id={CURRENT_WORD_ID} className="scroll-mt-6">
      <span className="bg-blue-900">
        {randomWord
          ?.substring(value.length, randomWord.length)
          .split('')
          .map((letter, letterIndex) => (
            <span key={letterIndex}>{letter}</span>
          ))}
      </span>{' '}
    </span>
  );
};

const RandomWords = () => {
  const { randomWords } = useSnapshot($store);
  const inputWordsLength = useSnapshot($store.inputWords).length;

  return (
    <span>
      {randomWords.map((word, wordIndex) =>
        wordIndex < inputWordsLength ? null : wordIndex === inputWordsLength ? (
          <CurrentWord key={wordIndex} />
        ) : (
          <span
            key={wordIndex}
            id={wordIndex.toString()}
            style={{
              scrollMarginTop: '3rem',
            }}
            className="opacity-40"
          >
            {word}{' '}
          </span>
        )
      )}
    </span>
  );
};
