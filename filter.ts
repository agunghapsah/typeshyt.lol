import { writeFile } from "fs/promises";
import dictonary from "./merged.json";

type Dictionary = Record<
  string,
  {
    MEANINGS: string[][];
    ANTONYMS: string[];
    SYNONYMS: string[];
  }
>;

const filtered = Object.entries(dictonary as Dictionary)
  .filter(([_key, value]) => {
    return value.MEANINGS.length !== 0 && value.SYNONYMS.length !== 0;
  })
  .map(([key]) => {
    return key;
  });

console.log(filtered);

await writeFile("./words.json", JSON.stringify(filtered));
