import { getRandomWords } from "@/utils/random-words";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

const DEFAULT_DURATION = 15_000;
const WORD_COUNT = 50;

// Characters per minute
// Words per minute
// Accuracy

function App() {
  const ref = useRef<HTMLInputElement>(null);
  const [randomWords, setRandomWords] = useState<string[]>(() =>
    getRandomWords(WORD_COUNT)
  );
  const [inputWords, setInputWords] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [state, setState] = useState<"IDLE" | "PLAYING" | "END">("IDLE");
  const [duration, setDuration] = useState<number>(() => DEFAULT_DURATION);
  const minuteFactor = useMemo(() => 60_000 / duration, [duration]);

  useEffect(() => {
    const onType = () => {
      if (state === "END") return;

      setState("PLAYING");
      ref.current?.focus();
      setStartTime((value) => value ?? Date.now());
    };

    window.document.addEventListener("keydown", onType);

    return () => {
      window.document.removeEventListener("keydown", onType);
    };
  }, [state === "END"]);

  useEffect(() => {
    if (value.length !== 0) return;

    const onType = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        const previousInputWord = inputWords[inputWords.length - 1];
        if (!previousInputWord) return;

        const expectedWord = randomWords[inputWords.length - 1];
        if (previousInputWord === expectedWord) return;

        setValue(previousInputWord);
        setInputWords((words) => {
          return words.filter((_, index) => index !== words.length - 1);
        });
      }
    };

    window.document.addEventListener("keydown", onType);

    return () => {
      window.document.removeEventListener("keydown", onType);
    };
  }, [value.length === 0]);

  useEffect(() => {
    if (!startTime || state !== "PLAYING") {
      console.log("Skip timer. No start time.");
      return;
    }

    console.log("Starting interval");
    const interval = setInterval(() => {
      console.log("Setting elapsed time");
      setElapsedTime(() => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= duration) {
          setState("END");
          return duration;
        }
        return elapsedTime;
      });
    }, 50);

    return () => {
      console.log("Clearing interval");
      clearInterval(interval);
    };
  }, [startTime, state]);

  const reset = () => {
    setRandomWords(getRandomWords(WORD_COUNT));
    setDuration(DEFAULT_DURATION);
    setElapsedTime(0);
    setInputWords([]);
    setStartTime(undefined);
    setValue("");

    setTimeout(() => {
      setState("IDLE");
    });
  };

  useEffect(() => {
    const onReset = (event: KeyboardEvent) => {
      if (state === "END" && (event.key === "R" || event.key === "r")) {
        reset();
      }
    };
    window.document.addEventListener("keydown", onReset);
    return () => window.document.removeEventListener("keydown", onReset);
  }, [state === "END"]);

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

      {state !== "END" && (
        <>
          <input
            autoFocus={true}
            ref={ref}
            className="opacity-0"
            value={value}
            onChange={(event) => {
              const value = event.target.value.toLowerCase();
              if (value.endsWith(" ")) {
                const words = value.split(" ");
                const word = words[words.length - 2];
                const expectedWord =
                  randomWords[inputWords.length + words.length - 2];

                console.log("FOUND NEW WORD:", word);
                console.log("EXPECTED WORD:", expectedWord);
                setInputWords((value) => {
                  const inputWords = [...value, word];

                  if (inputWords.length === randomWords.length) {
                    const duration = Date.now() - (startTime ?? 0);
                    console.log("Done in ", duration);
                    setDuration(duration);
                    setStartTime(undefined);
                    setState("END");
                  }

                  return inputWords;
                });
                setValue("");
              } else {
                setValue(value);
              }
            }}
          />

          <span className="tracking-wide relative">
            <span>
              {inputWords.map((word, wordIndex) => {
                const expectedWord = randomWords[wordIndex];
                // console.log("Expected word", expectedWord);
                // console.log("Random words", randomWords);
                // console.log("index", wordIndex);

                return (
                  <span>
                    <span
                      className="border-b-red-500"
                      style={{
                        borderBottomWidth:
                          word !== expectedWord ? "1px" : undefined,
                      }}
                    >
                      {word.split("").map((letter, letterIndex) => {
                        const expectedLetter = expectedWord?.[letterIndex];
                        return (
                          <span
                            key={letterIndex}
                            style={{
                              color: !expectedLetter
                                ? "pink"
                                : letter !== expectedLetter
                                  ? "red"
                                  : "inherit",
                            }}
                          >
                            {expectedLetter ?? letter}
                          </span>
                        );
                      })}
                      {expectedWord
                        ?.substring(word.length, expectedWord.length)
                        .split("")
                        .map((letter, letterIndex) => (
                          <span key={letterIndex} className="opacity-40">
                            {letter}
                          </span>
                        ))}
                    </span>{" "}
                  </span>
                );
              })}
            </span>

            {value.split("").map((letter, letterIndex) => {
              const expectedLetter =
                randomWords[inputWords.length]?.[letterIndex];
              return (
                <span
                  key={letterIndex}
                  style={{
                    color: !expectedLetter
                      ? "pink"
                      : letter !== expectedLetter
                        ? "red"
                        : "inherit",
                  }}
                  className="relative"
                >
                  {/* <span>
                    Index "{index}"{`\n`}
                    Index value "{index + correctWords.length}"{`\n`}
                    Letter "{letter}"{`\n`}
                    Expected letter "{expectedLetter}"{`\n`}
                  </span> */}
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
                      ? "-0.3rem"
                      : undefined,
                }}
              >
                |
              </span>
            )}

            <span className="opacity-40">
              {randomWords
                .filter((word, wordIndex) => {
                  if (wordIndex < inputWords.length) return;
                  return word;
                })
                .map((word, wordIndex) => (
                  <span>
                    {(wordIndex === 0
                      ? word.substring(value.length, word.length)
                      : word
                    )
                      .split("")
                      .map((letter, letterIndex) => (
                        <span key={letterIndex}>{letter}</span>
                      ))}{" "}
                  </span>
                ))}
            </span>
          </span>
        </>
      )}

      {state === "END" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span>Duration: {duration / 1000}s</span>
            {/* <span>Factor: {minuteFactor}</span> */}
            <span>
              Words per minute:{" "}
              {Math.trunc(
                inputWords.filter((word, wordIndex) => {
                  const expectedWord = randomWords[wordIndex];
                  return word === expectedWord;
                }).length * minuteFactor
              )}
            </span>
          </div>

          <button
            className="text-xs border py-1 px-3 rounded-lg self-center"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      )}

      {state === "PLAYING" && <div>{Math.trunc(elapsedTime / 1000)}</div>}
    </div>
  );
}
