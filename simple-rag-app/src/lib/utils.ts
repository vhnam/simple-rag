import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import merge from 'lodash/merge';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export { capitalize, debounce, merge };
