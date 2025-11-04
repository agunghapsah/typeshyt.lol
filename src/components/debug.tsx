import { $store } from '@/utils/store';
import { useSnapshot } from 'valtio';

export const Debug = () => {
  const { state, value, inputHistory } = useSnapshot($store);

  return (
    <pre>{JSON.stringify({ state, value, inputHistory }, undefined, 2)}</pre>
  );
};
