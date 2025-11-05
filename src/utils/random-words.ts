import HARD from '../../dataset/hard.json';
import NORMAL from '../../dataset/normal.json';
import EASY from '../../dataset/easy.json';

export type Difficulty = (typeof difficulties)[number];
export const difficulties = ['EASY', 'NORMAL', 'HARD'] as const;
export const DEFAULT_DIFFICULTY = difficulties[0];

const dictionaries: Record<Difficulty, string[]> = {
  EASY,
  NORMAL,
  HARD,
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomWords = (difficulty: Difficulty): string[] => {
  const dictionary = dictionaries[difficulty];

  return Array.from({ length: 300 }).map(() => {
    const index = getRandomInt(0, dictionary.length);
    return dictionary[index].toLowerCase();
  });
};
