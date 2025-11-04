import { INPUT_ID } from '@/components/typer';
import { $store } from '@/utils/store';
import { useEffect } from 'react';

export const useKeyboardEvents = () => {
  useEffect(() => {
    const onType = (event: KeyboardEvent) => {
      // Reset shortcut
      if (
        $store.state === 'END' &&
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'R' || event.key === 'r')
      ) {
        $store.reset();
      }

      // Start on type
      if ($store.state === 'IDLE') {
        const input = document.getElementById(INPUT_ID);
        input?.focus();
        $store.state = 'PLAYING';
        $store.startTime = $store.startTime ?? Date.now();
        return;
      }

      // Edit previous word on backspace
      if (
        $store.state === 'PLAYING' &&
        $store.value.length === 0 &&
        event.key === 'Backspace'
      ) {
        const previousInputWord =
          $store.inputWords[$store.inputWords.length - 1];
        if (!previousInputWord) return;

        const expectedWord = $store.randomWords[$store.inputWords.length - 1];
        if (previousInputWord === expectedWord) return;

        $store.value = previousInputWord;
        $store.inputWords.pop();
      }
    };

    window.document.addEventListener('keydown', onType);

    return () => {
      window.document.removeEventListener('keydown', onType);
    };
  }, []);
};
