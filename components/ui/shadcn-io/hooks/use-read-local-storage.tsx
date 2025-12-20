"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Database, RefreshCw } from "lucide-react";

export const title = "React useReadLocalStorage Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseReadLocalStorageOptions<T, InitializeWithValue extends boolean | undefined> = {
  deserializer?: (value: string) => T;
  initializeWithValue: InitializeWithValue;
};

const IS_SERVER = typeof window === "undefined";

// SSR version
export function useReadLocalStorage<T>(
  key: string,
  options: UseReadLocalStorageOptions<T, false>
): T | null | undefined;
// CSR version
export function useReadLocalStorage<T>(
  key: string,
  options?: Partial<UseReadLocalStorageOptions<T, true>>
): T | null;
export function useReadLocalStorage<T>(
  key: string,
  options: Partial<UseReadLocalStorageOptions<T, boolean>> = {}
): T | null | undefined {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const deserializer = React.useCallback<(value: string) => T | null>(
    (value) => {
      if (options.deserializer) {
        return options.deserializer(value);
      }
      if (value === "undefined") {
        return undefined as unknown as T;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(value);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
      }

      return parsed as T;
    },
    [options]
  );

  const readValue = React.useCallback((): T | null => {
    if (IS_SERVER) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? deserializer(raw) : null;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  }, [key, deserializer]);

  const [storedValue, setStoredValue] = React.useState(() => {
    if (initializeWithValue) {
      return readValue();
    }
    return undefined;
  });

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
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [key, readValue]);

  return storedValue;
}

export type { UseReadLocalStorageOptions };

// ============================================================================
// Demo Component
// ============================================================================

function UseReadLocalStorageDemo() {
  const storedTheme = useReadLocalStorage<string>("demo-theme");
  const [lastRead, setLastRead] = React.useState<Date | null>(null);

  const setDemoValue = (value: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("demo-theme", JSON.stringify(value));
      window.dispatchEvent(new StorageEvent("local-storage", { key: "demo-theme" }));
      setLastRead(new Date());
    }
  };

  const clearDemoValue = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("demo-theme");
      window.dispatchEvent(new StorageEvent("local-storage", { key: "demo-theme" }));
      setLastRead(new Date());
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Read LocalStorage Demo</h3>
        <p className="text-sm text-muted-foreground">Read-only reactive localStorage</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Current Value</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={storedTheme ? "default" : "secondary"}
            className="text-lg px-4 py-2 gap-2"
          >
            <Database size={18} />
            {storedTheme ?? "null"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Set Value (simulates external write)</Label>
        <div className="grid grid-cols-3 gap-2 min-h-[36px]">
          <Button
            onClick={() => setDemoValue("light")}
            variant={storedTheme === "light" ? "default" : "outline"}
            size="sm"
            className="text-sm h-9"
          >
            Light
          </Button>
          <Button
            onClick={() => setDemoValue("dark")}
            variant={storedTheme === "dark" ? "default" : "outline"}
            size="sm"
            className="text-sm h-9"
          >
            Dark
          </Button>
          <Button
            onClick={() => setDemoValue("system")}
            variant={storedTheme === "system" ? "default" : "outline"}
            size="sm"
            className="text-sm h-9"
          >
            System
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Storage Key</Label>
          <Badge variant="outline" className="text-xs">localStorage</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">&quot;demo-theme&quot;</code>
        </div>
      </div>

      <div className="min-h-[36px] flex items-center">
        <Button
          onClick={clearDemoValue}
          disabled={storedTheme === null}
          variant="outline"
          size="sm"
          className="w-full text-sm h-9 gap-1"
        >
          <RefreshCw size={14} />
          Clear Value
        </Button>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Syncs across tabs via storage events
        </div>
      </div>
    </div>
  );
}

export default UseReadLocalStorageDemo;
