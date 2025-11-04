import { $store } from '@/utils/store';
import { useSnapshot } from 'valtio';

export const Debug = () => {
  const { state, value } = useSnapshot($store);

  return <pre>{JSON.stringify({ state, value }, undefined, 2)}</pre>;
};
