import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export { capitalize, debounce };
