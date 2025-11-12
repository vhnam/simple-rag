import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export { capitalize, debounce };
