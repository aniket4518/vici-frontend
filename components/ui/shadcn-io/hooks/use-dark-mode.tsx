"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";

export const title = "React useDarkMode Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "usehooks-ts-dark-mode";

type DarkModeOptions = {
  defaultValue?: boolean;
  localStorageKey?: string;
  initializeWithValue?: boolean;
  applyDarkClass?: boolean;
};

type DarkModeReturn = {
  isDarkMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  set: (value: boolean) => void;
};

export function useDarkMode(options: DarkModeOptions = {}): DarkModeReturn {
  const {
    defaultValue = false,
    localStorageKey = LOCAL_STORAGE_KEY,
    initializeWithValue = true,
    applyDarkClass = true,
  } = options;

  const getOSPreference = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia(COLOR_SCHEME_QUERY).matches;
    }
    return defaultValue;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    if (!initializeWithValue) {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(localStorageKey);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${localStorageKey}":`, error);
    }

    return getOSPreference();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(localStorageKey, JSON.stringify(isDarkMode));
    } catch (error) {
      console.error(`Error setting localStorage key "${localStorageKey}":`, error);
    }
  }, [isDarkMode, localStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);

    const handleChange = (e: MediaQueryListEvent) => {
      const savedValue = window.localStorage.getItem(localStorageKey);
      if (savedValue === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [localStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !applyDarkClass) return;

    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode, applyDarkClass]);

  return {
    isDarkMode,
    toggle: () => setIsDarkMode((prev) => !prev),
    enable: () => setIsDarkMode(true),
    disable: () => setIsDarkMode(false),
    set: (value: boolean) => setIsDarkMode(value),
  };
}

export type { DarkModeOptions, DarkModeReturn };

// ============================================================================
// Demo Component
// ============================================================================

function UseDarkModeDemo() {
  const { isDarkMode, toggle, enable, disable } = useDarkMode({
    localStorageKey: "demo-dark-mode",
    applyDarkClass: false,
  });

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Dark Mode Demo</h3>
        <p className="text-sm text-muted-foreground">Toggle, enable, or disable dark mode</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Current Theme</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={isDarkMode ? "default" : "secondary"}
            className="text-2xl px-6 py-3 font-semibold gap-2"
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            {isDarkMode ? "Dark" : "Light"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="min-h-[36px] flex items-center">
          <Button onClick={toggle} variant="default" size="sm" className="w-full text-sm h-9">
            Toggle Theme
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 min-h-[36px]">
          <Button
            onClick={enable}
            disabled={isDarkMode}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Moon size={14} />
            Dark
          </Button>
          <Button
            onClick={disable}
            disabled={!isDarkMode}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Sun size={14} />
            Light
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between min-h-[20px]">
          <Label className="text-sm font-medium">Persisted Value</Label>
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            localStorage
          </Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">
            demo-dark-mode: {isDarkMode ? "true" : "false"}
          </code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Preference persists across browser sessions
        </div>
      </div>
    </div>
  );
}

export default UseDarkModeDemo;
