import { $store } from '@/utils/store';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { watch } from 'valtio/utils';

export const Timer = () => {
  const { elapsedTime, duration } = useSnapshot($store);

  useEffect(() => {
    return watch((get) => {
      const { startTime, state } = get($store);

      if (!startTime || state !== 'PLAYING') {
        console.log('Skip timer. No start time.');
        return;
      }

      // console.log("Starting interval");
      const interval = setInterval(() => {
        // console.log("Setting elapsed time");
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime >= $store.duration) {
          $store.state = 'END';
          $store.elapsedTime = $store.duration;
        }

        $store.elapsedTime = elapsedTime;
      }, 50);

      return () => {
        console.log('Clearing interval');
        clearInterval(interval);
      };
    });
  }, []);

  return <div>{duration / 1000 - Math.trunc(elapsedTime / 1000)}</div>;
};
