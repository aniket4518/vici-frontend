"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Trash2 } from "lucide-react";

export const title = "React useLocalStorage Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const { initializeWithValue = true } = options;

  const serializer = React.useCallback(
    (value: T): string => {
      if (options.serializer) {
        return options.serializer(value);
      }
      return JSON.stringify(value);
    },
    [options]
  );

  const deserializer = React.useCallback(
    (value: string): T => {
      if (options.deserializer) {
        return options.deserializer(value);
      }
      if (value === "undefined") {
        return undefined as unknown as T;
      }
      const defaultValue =
        initialValue instanceof Function ? initialValue() : initialValue;
      try {
        return JSON.parse(value) as T;
      } catch {
        return defaultValue;
      }
    },
    [options, initialValue]
  );

  const readValue = React.useCallback((): T => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    if (IS_SERVER) {
      return initialValueToUse;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch {
      return initialValueToUse;
    }
  }, [initialValue, key, deserializer]);

  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (initializeWithValue) {
      return readValue();
    }
    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (value) => {
      if (IS_SERVER) {
        return;
      }

      try {
        const newValue =
          value instanceof Function ? value(readValue()) : value;
        window.localStorage.setItem(key, serializer(newValue));
        setStoredValue(newValue);
        window.dispatchEvent(new StorageEvent("local-storage", { key }));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serializer, readValue]
  );

  const removeValue = React.useCallback(() => {
    if (IS_SERVER) {
      return;
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    window.localStorage.removeItem(key);
    setStoredValue(defaultValue);
    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  }, [key, initialValue]);

  React.useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key !== key) {
        return;
      }
      setStoredValue(readValue());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage" as any, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage" as any, handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
}

export type { UseLocalStorageOptions };

// ============================================================================
// Demo Component
// ============================================================================

function UseLocalStorageDemo() {
  const [counter, setCounter, removeCounter] = useLocalStorage("demo-counter", 0);

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Local Storage Demo</h3>
        <p className="text-sm text-muted-foreground">Persistent state across sessions</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Persistent Counter</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge variant="default" className="text-3xl px-6 py-3 font-mono font-bold">
            {counter}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 min-h-[36px]">
          <Button
            onClick={() => setCounter((prev) => prev + 1)}
            variant="default"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Plus size={14} />
            1
          </Button>
          <Button
            onClick={() => setCounter((prev) => prev - 1)}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Minus size={14} />
            1
          </Button>
          <Button
            onClick={removeCounter}
            variant="secondary"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Storage Key</Label>
          <Badge variant="outline" className="text-xs">localStorage</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">"demo-counter": {counter}</code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Refresh page to verify persistence
        </div>
      </div>
    </div>
  );
}

export default UseLocalStorageDemo;
