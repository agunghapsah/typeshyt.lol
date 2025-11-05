import { $store, durations } from '@/utils/store';
import { useSnapshot } from 'valtio';

export const Settings = () => {
  const { duration } = useSnapshot($store);

  return (
    <div
      className={`
        [&_button]:px-3
        [&_button]:py-1.5
        [&_button]:border
        [&_button]:rounded-xl
        flex
        gap-6
      `}
    >
      <div className="flex gap-3">
        {durations.map((value) => (
          <button
            onClick={() => {
              $store.duration = value;
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
    </div>
  );
};
