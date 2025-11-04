import { Result } from '@/components/result';
import { Timer } from '@/components/timer';
import { Typer } from '@/components/typer';
import { useKeyboardEvents } from '@/hooks/use-keyboard-events';
import { $store } from '@/utils/store';
import { createFileRoute } from '@tanstack/react-router';
import { useSnapshot } from 'valtio';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  useKeyboardEvents();
  const { state } = useSnapshot($store);

  return (
    <div
      className={`
        bg-black
        h-screen
        w-screen
        text-white
        flex
        flex-col
        items-center
        p-8
        gap-4
      `}
    >
      <h1 className="text-4xl font-bold">typeshyt</h1>

      {state === 'PLAYING' && <Timer />}
      {state !== 'END' ? <Typer /> : <Result />}
    </div>
  );
}
