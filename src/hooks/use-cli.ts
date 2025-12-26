'use client';

import useSWR from 'swr';
import { useDebounce } from './use-debounce';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.json();
    const error = new Error(errorBody.error || 'An error occurred while fetching the data.');
    throw error;
  }
  return res.json();
};

export function useCli<T>(
  args: (string | null | undefined)[] | null,
  options: any = {}
) {
  const debouncedArgs = useDebounce(args, 300);

  const key = debouncedArgs ? `/api/cli/${debouncedArgs.filter(Boolean).join('/')}` : null;

  return useSWR<T>(key, fetcher, options);
}
