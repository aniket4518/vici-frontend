"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor } from "lucide-react";

export const title = "React useTernaryDarkMode Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "use-ternary-dark-mode";

export type TernaryDarkMode = "system" | "dark" | "light";

export type TernaryDarkModeOptions = {
  defaultValue?: TernaryDarkMode;
  localStorageKey?: string;
  initializeWithValue?: boolean;
};

export type TernaryDarkModeReturn = {
  isDarkMode: boolean;
  ternaryDarkMode: TernaryDarkMode;
  setTernaryDarkMode: React.Dispatch<React.SetStateAction<TernaryDarkMode>>;
  toggleTernaryDarkMode: () => void;
};

const IS_SERVER = typeof window === "undefined";

function useMediaQueryInternal(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = React.useState<boolean>(() => {
    if (IS_SERVER) return defaultValue;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    const matchMedia = window.matchMedia(query);
    const handleChange = () => setMatches(matchMedia.matches);
    handleChange();
    matchMedia.addEventListener("change", handleChange);
    return () => matchMedia.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

function useLocalStorageInternal<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (IS_SERVER) return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (value) => {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      if (!IS_SERVER) {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

export function useTernaryDarkMode({
  defaultValue = "system",
  localStorageKey = LOCAL_STORAGE_KEY,
}: TernaryDarkModeOptions = {}): TernaryDarkModeReturn {
  const isDarkOS = useMediaQueryInternal(COLOR_SCHEME_QUERY);
  const [mode, setMode] = useLocalStorageInternal<TernaryDarkMode>(
    localStorageKey,
    defaultValue
  );

  const isDarkMode = mode === "dark" || (mode === "system" && isDarkOS);

  const toggleTernaryDarkMode = React.useCallback(() => {
    const modes: TernaryDarkMode[] = ["light", "system", "dark"];
    setMode((prevMode): TernaryDarkMode => {
      const nextIndex = (modes.indexOf(prevMode) + 1) % modes.length;
      return modes[nextIndex];
    });
  }, [setMode]);

  return {
    isDarkMode,
    ternaryDarkMode: mode,
    setTernaryDarkMode: setMode,
    toggleTernaryDarkMode,
  };
}

// ============================================================================
// Demo Component
// ============================================================================

function UseTernaryDarkModeDemo() {
  const { isDarkMode, ternaryDarkMode, setTernaryDarkMode, toggleTernaryDarkMode } =
    useTernaryDarkMode({ localStorageKey: "demo-ternary-dark-mode" });

  const getModeIcon = () => {
    switch (ternaryDarkMode) {
      case "light":
        return <Sun size={18} />;
      case "dark":
        return <Moon size={18} />;
      case "system":
        return <Monitor size={18} />;
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Ternary Dark Mode Demo</h3>
        <p className="text-sm text-muted-foreground">Light / System / Dark</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Current Mode</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge variant="default" className="text-lg px-4 py-2 gap-2 capitalize">
            {getModeIcon()}
            {ternaryDarkMode}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Select Mode</Label>
        <div className="grid grid-cols-3 gap-2 min-h-[36px]">
          <Button
            onClick={() => setTernaryDarkMode("light")}
            variant={ternaryDarkMode === "light" ? "default" : "outline"}
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Sun size={14} />
            Light
          </Button>
          <Button
            onClick={() => setTernaryDarkMode("system")}
            variant={ternaryDarkMode === "system" ? "default" : "outline"}
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Monitor size={14} />
            System
          </Button>
          <Button
            onClick={() => setTernaryDarkMode("dark")}
            variant={ternaryDarkMode === "dark" ? "default" : "outline"}
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Moon size={14} />
            Dark
          </Button>
        </div>
      </div>

      <div className="min-h-[36px] flex items-center">
        <Button
          onClick={toggleTernaryDarkMode}
          variant="secondary"
          size="sm"
          className="w-full text-sm h-9"
        >
          Toggle Mode (cycle)
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Resolved Value</Label>
          <Badge variant="outline" className="text-xs gap-1">
            {isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
            {isDarkMode ? "Dark" : "Light"}
          </Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">isDarkMode: {String(isDarkMode)}</code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Persists preference, respects OS setting
        </div>
      </div>
    </div>
  );
}

export default UseTernaryDarkModeDemo;
