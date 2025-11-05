import { proxy } from 'valtio';
import {
  DEFAULT_DIFFICULTY,
  getRandomWords,
  type Difficulty,
} from './random-words';
import { replaceArray } from './replace-array';
import { emptyArray } from './empty-array';
import { isValidCharacter } from './is-valid-character';
import { INPUT_ID } from '@/components/typer';
import { subscribeKey } from 'valtio/utils';

type Duration = (typeof durations)[number];
export const durations = [15_000, 30_000, 45_000, 60_000] as const;
export const DEFAULT_DURATION = durations[0];

type Store = {
  isFocus: boolean;
  startTime: number | undefined;
  elapsedTime: number;
  duration: Duration;
  difficulty: Difficulty;

  inputHistory: {
    timestamp: number;
    letter: string;
    expectedLetter: string;
  }[];

  state: 'IDLE' | 'PLAYING' | 'END';
  randomWords: string[];
  inputWords: string[];
  value: string;
  setValue: (value: string) => void;
  reset: () => void;
};

export const $store = proxy<Store>({
  isFocus: false,
  startTime: undefined,
  elapsedTime: 0,
  duration: DEFAULT_DURATION,
  difficulty: DEFAULT_DIFFICULTY,
  state: 'IDLE',
  randomWords: getRandomWords(DEFAULT_DIFFICULTY),
  inputWords: [],
  inputHistory: [],
  value: '',
  setValue: (value) => {
    // Start on type
    if ($store.state === 'IDLE' && isValidCharacter(value.trim())) {
      const input = document.getElementById(INPUT_ID);
      input?.focus();
      $store.state = 'PLAYING';
      $store.startTime = $store.startTime ?? Date.now();
      $store.value = value.trim();
      return;
    }

    // Add new word on space
    if (
      $store.state === 'PLAYING' &&
      !value.startsWith(' ') &&
      value.endsWith(' ')
    ) {
      const word = value.trim();
      $store.inputWords.push(word);
      $store.value = '';
      return;
    }

    // Set value
    if ($store.state === 'PLAYING') {
      $store.value = value.trim();
    }
  },
  reset: () => {
    replaceArray($store.randomWords, getRandomWords($store.difficulty));
    emptyArray($store.inputWords);
    $store.value = '';
    $store.elapsedTime = 0;
    $store.startTime = undefined;

    setTimeout(() => {
      $store.state = 'IDLE';
    });
  },
});

subscribeKey($store, 'difficulty', (difficulty) => {
  replaceArray($store.randomWords, getRandomWords(difficulty));
});
