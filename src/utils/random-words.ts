import words from "../../words.json";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomWords = (number: number): string[] => {
  return Array.from({ length: number }).map(() => {
    const index = getRandomInt(0, words.length);
    return words[index].toLowerCase();
  });
};
