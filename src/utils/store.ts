import { proxy } from 'valtio';
import { getRandomWords } from './random-words';
import { replaceArray } from './replace-array';
import { emptyArray } from './empty-array';

export const DEFAULT_DURATION = 15_000;
export const WORD_COUNT = 50;

type Store = {
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
  startTime: undefined,
  elapsedTime: 0,
  duration: DEFAULT_DURATION,
  state: 'IDLE',
  randomWords: getRandomWords(WORD_COUNT),
  inputWords: [],
  value: '',
  setValue: (value) => {
    if (value.endsWith(' ')) {
      const word = value.substring(0, value.length - 1);
      $store.inputWords.push(word);
      $store.value = '';
      return;
    }

    $store.value = value;
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
