"use client";

import * as React from "react";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export const title = "React useDebounceCallback Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

type ControlFunctions = {
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
};

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions;

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  const debouncedFunc = React.useRef<ReturnType<typeof debounce>>(null);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debouncedFunc.current) {
        debouncedFunc.current.cancel();
      }
    };
  }, []);

  const debounced = React.useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options);

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args);
    };

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    };

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current;
    };

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    };

    return wrappedFunc;
  }, [func, delay, options]);

  React.useEffect(() => {
    debouncedFunc.current = debounce(func, delay, options);
  }, [func, delay, options]);

  return debounced;
}

export type { DebounceOptions, ControlFunctions };

// ============================================================================
// Demo Component
// ============================================================================

function UseDebounceCallbackDemo() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<string[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchCount, setSearchCount] = React.useState(0);

  const performSearch = React.useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockResults = [
      `${term} - React Component`,
      `${term} - TypeScript Guide`,
      `${term} - Next.js Tutorial`,
    ];

    setResults(mockResults);
    setIsSearching(false);
    setSearchCount((c) => c + 1);
  }, []);

  const debouncedSearch = useDebounceCallback(performSearch, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Debounce Callback Demo</h3>
        <p className="text-sm text-muted-foreground">Search with 500ms debounce delay</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Search Query</Label>
        <div className="min-h-[36px] flex items-center relative">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full h-9 text-sm pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Status</Label>
        <div className="border rounded p-3 min-h-[48px] flex items-center text-sm">
          {isSearching ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Searching...</span>
            </div>
          ) : searchTerm ? (
            <span>Ready (debounced after 500ms)</span>
          ) : (
            <span className="text-muted-foreground">Start typing to search</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Controls</Label>
        <div className="grid grid-cols-2 gap-2 min-h-[32px]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => debouncedSearch.cancel()}
            className="text-sm h-8"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => debouncedSearch.flush()}
            className="text-sm h-8"
          >
            Flush Now
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Results</Label>
            <Badge variant="secondary" className="text-xs">
              {results.length} found
            </Badge>
          </div>
          <div className="space-y-1">
            {results.map((result, index) => (
              <div key={index} className="text-sm p-2 border rounded">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          API calls made: <code className="bg-muted px-1 py-0.5 rounded">{searchCount}</code>
        </div>
      </div>
    </div>
  );
}

export default UseDebounceCallbackDemo;
