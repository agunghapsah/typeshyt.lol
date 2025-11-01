import { getRandomWords } from "@/utils/random-words";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

const randomWords = getRandomWords();
const words = randomWords.join(" ");
const MAX_TIME = 3_000;

// Characters per minute
// Words per minute
// Accuracy

function App() {
  const ref = useRef<HTMLInputElement>(null);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [state, setState] = useState<"IDLE" | "PLAYING" | "END">("IDLE");

  useEffect(() => {
    const onType = (event: KeyboardEvent) => {
      setState("PLAYING");
      ref.current?.focus();
      setStartTime(Date.now());
    };

    window.document.addEventListener("keydown", onType);

    return () => {
      window.document.removeEventListener("keydown", onType);
    };
  }, []);

  // useEffect(() => {
  //   if (!startTime) return;

  //   const interval = setInterval(() => {
  //     setElapsedTime(() => {
  //       const elapsedTime = Date.now() - startTime;
  //       if (elapsedTime >= MAX_TIME) {
  //         setState("END");
  //         return MAX_TIME;
  //       }
  //       return elapsedTime;
  //     });
  //   }, 50);

  //   return () => clearInterval(interval);
  // }, [startTime]);

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
                  randomWords[correctWords.length + words.length - 2];

                console.log("FOUND NEW WORD:", word);
                console.log("EXPECTED WORD:", expectedWord);

                if (word === expectedWord) {
                  setValue("");
                  setCorrectWords((value) => [...value, word]);
                }
              } else {
                setValue(value);
              }
            }}
          />

          <span className="tracking-wide">
            <span>
              {correctWords.map((word) => {
                return <span>{word} </span>;
              })}
            </span>

            {value.split("").map((letter, index) => {
              const expectedLetter = randomWords[correctWords.length][index];
              return (
                <span
                  key={index}
                  style={{
                    color: letter !== expectedLetter ? "red" : "inherit",
                  }}
                  className="relative"
                >
                  {/* <span>
                    Index "{index}"{`\n`}
                    Index value "{index + correctWords.length}"{`\n`}
                    Letter "{letter}"{`\n`}
                    Expected letter "{expectedLetter}"{`\n`}
                  </span> */}
                  {letter}
                  {index === value.length - 1 && (
                    <span className="animate-pulse absolute -right-1">|</span>
                  )}
                </span>
              );
            })}

            {value.length === 0 && (
              <span className="animate-pulse absolute">|</span>
            )}

            <span className="opacity-40">
              {randomWords
                .filter((word, wordIndex) => {
                  if (wordIndex < correctWords.length) return;
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
        <div>
          <span>Good job!</span>
        </div>
      )}

      {state === "PLAYING" && <div>{Math.trunc(elapsedTime / 1000)}</div>}
    </div>
  );
}
