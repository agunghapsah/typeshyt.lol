import { writeFile } from 'fs/promises';
import hardDictonary from './hard-dictionary.json';
import dictionary from './dictionary.json';

type HardDictionary = Record<
  string,
  {
    MEANINGS: string[][];
    ANTONYMS: string[];
    SYNONYMS: string[];
  }
>;

const hard = Object.entries(hardDictonary as HardDictionary)
  .filter(([_key, value]) => {
    return value.MEANINGS.length !== 0 && value.SYNONYMS.length !== 0;
  })
  .map(([key]) => {
    return key;
  });

const normal = dictionary.filter((word) => word.length <= 6);
const easy = dictionary.filter((word) => word.length <= 5);

await Promise.all([
  writeFile('./hard.json', JSON.stringify(hard)),
  writeFile('./normal.json', JSON.stringify(normal)),
  writeFile('./easy.json', JSON.stringify(easy)),
]);
