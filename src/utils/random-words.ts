import words from "../../words.json";

const MAX_WORDS = 10;

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomWords = (): string[] => {
  return Array.from({ length: MAX_WORDS }).map(() => {
    const index = getRandomInt(0, words.length);
    return words[index].toLowerCase();
  });
};
