'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { XIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { cn, debounce } from '@/lib/utils';

interface SearchInputProps<T> {
  className?: string;
  emptyResultsMessage?: string;
  placeholder: string;
  results?: Array<T>;
  isLoading?: boolean;
  onSearch: (keyword: string) => void;
  onSelect?: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
  getItemKey?: (item: T) => string | number;
  selectedItems?: Array<T>;
  onRemoveItem?: (itemKey: string | number) => void;
  renderBadge?: (item: T) => React.ReactNode;
  searchKeyword?: string;
}

const SearchInput = <T,>({
  className,
  emptyResultsMessage = 'No results found.',
  placeholder,
  results = [],
  isLoading = false,
  onSearch,
  onSelect,
  renderItem,
  getItemKey,
  selectedItems,
  onRemoveItem,
  renderBadge,
  searchKeyword,
}: SearchInputProps<T>) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedOnSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value.toLowerCase());
        if (value && value.length > 0) {
          setOpen(true);
        }
      }, 400),
    [onSearch]
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedOnSearch(value);
  };

  useEffect(() => {
    return () => debouncedOnSearch.cancel();
  }, [debouncedOnSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSelectItem = (item: T) => {
    onSelect?.(item);
    setOpen(false);
    setInputValue('');
    onSearch('');
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative">
        <Command
          className="w-full rounded-lg border shadow-md"
          shouldFilter={false}
        >
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={handleInputChange}
            onFocus={() => setOpen(true)}
          />
          {open && (isLoading || searchKeyword) && (
            <CommandList className="bg-background absolute top-full left-0 z-50 mt-1 w-full rounded-md border shadow-lg">
              {isLoading && (
                <CommandGroup>
                  <CommandItem disabled>
                    <Spinner className="mr-2" /> Searching...
                  </CommandItem>
                </CommandGroup>
              )}

              {!isLoading && searchKeyword && results.length === 0 && (
                <CommandEmpty>{emptyResultsMessage}</CommandEmpty>
              )}

              {!isLoading && results.length > 0 && (
                <CommandGroup heading="Results">
                  {results.map((item) => {
                    const key = getItemKey
                      ? getItemKey(item)
                      : (item as any).id;
                    const content = renderItem
                      ? renderItem(item)
                      : ((item as any).name ??
                        (item as any).title ??
                        `#${key}`);

                    return (
                      <CommandItem
                        key={key}
                        onSelect={() => handleSelectItem(item)}
                        className="cursor-pointer"
                      >
                        {content}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
      </div>
      {selectedItems && selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 py-2 pb-0">
          {selectedItems.map((item) => {
            const key = getItemKey ? getItemKey(item) : (item as any).id;
            return (
              <Badge
                key={key}
                variant="secondary"
                className="gap-1 pr-1 text-xs"
              >
                {renderBadge ? (
                  renderBadge(item)
                ) : (
                  <span>{(item as any).name || key}</span>
                )}
                {onRemoveItem && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(key)}
                    className="hover:bg-muted rounded-sm p-0.5 transition-colors"
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
