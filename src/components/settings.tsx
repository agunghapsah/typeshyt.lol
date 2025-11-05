import { difficulties } from '@/utils/random-words';
import { $store, durations } from '@/utils/store';
import { useSnapshot } from 'valtio';
import { INPUT_ID } from './typer';

export const Settings = () => {
  const { duration, difficulty } = useSnapshot($store);

  return (
    <div
      className={`
        [&_button]:px-3
        [&_button]:py-1.5
        [&_button]:border
        [&_button]:rounded-xl
        flex
        flex-col
        items-center
        md:flex-row
        gap-6
        md:gap-8
      `}
    >
      <div className="flex gap-2">
        {durations.map((value) => (
          <button
            onClick={() => {
              $store.duration = value;
              document.getElementById(INPUT_ID)?.focus();
            }}
            className={
              duration === value
                ? ''
                : `
                border-gray-700
                text-gray-500
                `
            }
            key={value}
          >
            {value / 1000}s
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        {difficulties.map((value) => (
          <button
            onClick={() => {
              $store.difficulty = value;
              document.getElementById(INPUT_ID)?.focus();
            }}
            className={
              difficulty === value
                ? ''
                : `
                border-gray-700
                text-gray-500
                `
            }
            key={value}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};
