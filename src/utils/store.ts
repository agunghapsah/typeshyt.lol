import { proxy } from 'valtio';
import { getRandomWords } from './random-words';
import { replaceArray } from './replace-array';
import { emptyArray } from './empty-array';
import { isValidCharacter } from './is-valid-character';
import { INPUT_ID } from '@/components/typer';

export const DEFAULT_DURATION = 15_000;
export const WORD_COUNT = 50;

type Store = {
  isFocus: boolean;
  startTime: number | undefined;
  elapsedTime: number;
  duration: number;

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
  state: 'IDLE',
  randomWords: getRandomWords(WORD_COUNT),
  inputWords: [],
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
    replaceArray($store.randomWords, getRandomWords(WORD_COUNT));
    emptyArray($store.inputWords);
    $store.value = '';
    $store.duration = DEFAULT_DURATION;
    $store.elapsedTime = 0;
    $store.startTime = undefined;

    setTimeout(() => {
      $store.state = 'IDLE';
    });
  },
});
