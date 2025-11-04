import { Result } from '@/components/result';
import { Timer } from '@/components/timer';
import { Typer } from '@/components/typer';
import { $store } from '@/utils/store';
import { createFileRoute } from '@tanstack/react-router';
import { useSnapshot } from 'valtio';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const { state } = useSnapshot($store, { sync: true });

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
        p-18
        gap-16
      `}
    >
      <h1 className="text-7xl font-bold">typeshyt</h1>

      <div className="flex flex-col gap-6">
        {/* <Debug /> */}
        {state !== 'END' && <Timer />}
        {state !== 'END' ? <Typer /> : <Result />}
      </div>
    </div>
  );
}
