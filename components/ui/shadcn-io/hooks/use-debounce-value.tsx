"use client";

import * as React from "react";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const title = "React useDebounceValue Hook";

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

type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions;

type UseDebounceValueOptions<T> = DebounceOptions & {
  equalityFn?: (left: T, right: T) => boolean;
};

export function useDebounceValue<T>(
  initialValue: T | (() => T),
  delay: number,
  options?: UseDebounceValueOptions<T>
): [T, DebouncedState<(value: T) => void>] {
  const eq = options?.equalityFn ?? ((left: T, right: T) => left === right);
  const unwrappedInitialValue =
    initialValue instanceof Function ? initialValue() : initialValue;
  const [debouncedValue, setDebouncedValue] = React.useState<T>(unwrappedInitialValue);
  const previousValueRef = React.useRef<T | undefined>(unwrappedInitialValue);
  const debouncedFunc = React.useRef<ReturnType<typeof debounce>>(null);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debouncedFunc.current) {
        debouncedFunc.current.cancel();
      }
    };
  }, []);

  const updateDebouncedValue = React.useMemo(() => {
    const debouncedFuncInstance = debounce(setDebouncedValue, delay, options);

    const wrappedFunc: DebouncedState<(value: T) => void> = (value: T) => {
      return debouncedFuncInstance(value);
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
  }, [delay, options]);

  React.useEffect(() => {
    debouncedFunc.current = debounce(setDebouncedValue, delay, options);
  }, [delay, options]);

  // Update the debounced value if the initial value changes
  if (!eq(previousValueRef.current as T, unwrappedInitialValue)) {
    updateDebouncedValue(unwrappedInitialValue);
    previousValueRef.current = unwrappedInitialValue;
  }

  return [debouncedValue, updateDebouncedValue];
}

export type { UseDebounceValueOptions, DebouncedState };

// ============================================================================
// Demo Component
// ============================================================================

function UseDebounceValueDemo() {
  const [inputValue, setInputValue] = React.useState("Hello");
  const [debouncedValue, setValue] = useDebounceValue(inputValue, 500);
  const [updateCount, setUpdateCount] = React.useState(0);

  // Track when debounced value actually changes
  React.useEffect(() => {
    setUpdateCount((c) => c + 1);
  }, [debouncedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setValue(value);
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Debounce Value Demo</h3>
        <p className="text-sm text-muted-foreground">Value updates 500ms after you stop typing</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Input Value</Label>
        <div className="min-h-[36px] flex items-center">
          <Input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Type something..."
            className="w-full h-9 text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Live Value</Label>
          <div className="border rounded p-3 min-h-[44px] flex items-center">
            <code className="text-sm break-all">{inputValue || <span className="text-muted-foreground">Empty</span>}</code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Debounced Value</Label>
            <Badge variant="secondary" className="text-xs">
              500ms delay
            </Badge>
          </div>
          <div className="border rounded p-3 min-h-[44px] flex items-center border-primary/50">
            <code className="text-sm break-all text-primary font-medium">
              {debouncedValue || <span className="text-muted-foreground">Empty</span>}
            </code>
          </div>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Debounced updates: <code className="bg-muted px-1 py-0.5 rounded">{updateCount}</code>
        </div>
      </div>
    </div>
  );
}

export default UseDebounceValueDemo;
