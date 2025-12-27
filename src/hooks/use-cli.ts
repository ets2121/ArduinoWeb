'use client';

import useSWR from 'swr';
import { useDebounce } from './use-debounce';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => res.text());
    const errorMessage = typeof errorBody === 'object' && errorBody.error ? errorBody.error : errorBody;
    const error = new Error(errorMessage || 'An error occurred while fetching the data.');
    throw error;
  }
  
  // Handle cases where the response might be text
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

export function useCli<T>(
  args: (string | null | undefined)[] | null,
  options: any = {}
) {
  const debouncedArgs = useDebounce(args, 300);

  const constructUrl = (args: (string | null | undefined)[] | null): string | null => {
    if (!args) return null;

    const validArgs = args.filter(Boolean) as string[];
    if (validArgs.length === 0) return null;

    const pathParts: string[] = [];
    const queryParts: string[] = [];

    validArgs.forEach(arg => {
      if (arg.startsWith('--')) {
        queryParts.push(arg.substring(2)); // remove --
      } else if (arg.includes('=')) {
         queryParts.push(arg);
      }
      else {
        pathParts.push(arg);
      }
    });
    
    let url = `/api/cli/${pathParts.join('/')}`;
    
    const queryParams = new URLSearchParams();
    queryParts.forEach(part => {
        const [key, ...valueParts] = part.split('=');
        const value = valueParts.join('=');
        queryParams.append(key, value || 'true');
    });

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  };

  const key = constructUrl(debouncedArgs);

  return useSWR<T>(key, fetcher, options);
}
