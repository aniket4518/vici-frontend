"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Trash2 } from "lucide-react";

export const title = "React useSessionStorage Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

declare global {
  interface WindowEventMap {
    "session-storage": CustomEvent;
  }
}

type UseSessionStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseSessionStorageOptions<T> = {}
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

      let parsed: unknown;
      try {
        parsed = JSON.parse(value);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return defaultValue;
      }

      return parsed as T;
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
      const raw = window.sessionStorage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValueToUse;
    }
  }, [initialValue, key, deserializer]);

  const [storedValue, setStoredValue] = React.useState(() => {
    if (initializeWithValue) {
      return readValue();
    }
    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (value) => {
      if (IS_SERVER) {
        console.warn(
          `Tried setting sessionStorage key "${key}" even though environment is not a client`
        );
        return;
      }

      try {
        const newValue =
          value instanceof Function ? value(readValue()) : value;

        window.sessionStorage.setItem(key, serializer(newValue));
        setStoredValue(newValue);
        window.dispatchEvent(new StorageEvent("session-storage", { key }));
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, serializer, readValue]
  );

  const removeValue = React.useCallback(() => {
    if (IS_SERVER) {
      console.warn(
        `Tried removing sessionStorage key "${key}" even though environment is not a client`
      );
      return;
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    window.sessionStorage.removeItem(key);
    setStoredValue(defaultValue);
    window.dispatchEvent(new StorageEvent("session-storage", { key }));
  }, [key, initialValue]);

  React.useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent | Event) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("session-storage", handleStorageChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("session-storage", handleStorageChange as EventListener);
    };
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
}

export type { UseSessionStorageOptions };

// ============================================================================
// Demo Component
// ============================================================================

function UseSessionStorageDemo() {
  const [counter, setCounter, removeCounter] = useSessionStorage(
    "demo-session-counter",
    0
  );

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Session Storage Demo</h3>
        <p className="text-sm text-muted-foreground">Tab-scoped persistent state</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Session Counter</Label>
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
            <Plus size={14} />1
          </Button>
          <Button
            onClick={() => setCounter((prev) => prev - 1)}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Minus size={14} />1
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
          <Badge variant="outline" className="text-xs">sessionStorage</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">&quot;demo-session-counter&quot;: {counter}</code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Persists in tab, clears on tab close
        </div>
      </div>
    </div>
  );
}

export default UseSessionStorageDemo;
