"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Maximize, Monitor } from "lucide-react";
import debounce from "lodash.debounce";

export const title = "React useWindowSize Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type WindowSize<T extends number | undefined = number | undefined> = {
  width: T;
  height: T;
};

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: number;
};

const IS_SERVER = typeof window === "undefined";

// SSR version of useWindowSize.
export function useWindowSize(options: UseWindowSizeOptions<false>): WindowSize;
// CSR version of useWindowSize.
export function useWindowSize(
  options?: Partial<UseWindowSizeOptions<true>>
): WindowSize<number>;
export function useWindowSize(
  options: Partial<UseWindowSizeOptions<boolean>> = {}
): WindowSize | WindowSize<number> {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const [windowSize, setWindowSize] = React.useState<WindowSize>(() => {
    if (initializeWithValue) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: undefined,
      height: undefined,
    };
  });

  const debouncedSetWindowSize = React.useMemo(
    () =>
      options.debounceDelay
        ? debounce(setWindowSize, options.debounceDelay)
        : setWindowSize,
    [options.debounceDelay]
  );

  React.useEffect(() => {
    const handleSize = () => {
      debouncedSetWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleSize();
    window.addEventListener("resize", handleSize);

    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [debouncedSetWindowSize]);

  return windowSize;
}

export type { WindowSize, UseWindowSizeOptions };

// ============================================================================
// Demo Component
// ============================================================================

function UseWindowSizeDemo() {
  const { width, height } = useWindowSize();

  const getBreakpoint = () => {
    if (!width) return "unknown";
    if (width < 640) return "xs";
    if (width < 768) return "sm";
    if (width < 1024) return "md";
    if (width < 1280) return "lg";
    if (width < 1536) return "xl";
    return "2xl";
  };

  const getOrientation = () => {
    if (!width || !height) return "unknown";
    return width > height ? "Landscape" : "Portrait";
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Window Size Demo</h3>
        <p className="text-sm text-muted-foreground">Live viewport dimensions</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Viewport Size</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge variant="default" className="text-xl px-4 py-2 gap-2 font-mono">
            <Maximize size={18} />
            {width ?? "—"} × {height ?? "—"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Dimensions</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Width</div>
            <Badge variant="outline" className="text-lg font-mono">
              {width ?? "—"}px
            </Badge>
          </div>
          <div className="border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Height</div>
            <Badge variant="outline" className="text-lg font-mono">
              {height ?? "—"}px
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Breakpoints</Label>
        <div className="border rounded p-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Tailwind Breakpoint</span>
            <Badge variant="secondary" className="text-xs font-mono">
              {getBreakpoint()}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Orientation</span>
            <Badge variant="secondary" className="text-xs gap-1">
              <Monitor size={10} />
              {getOrientation()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Resize window to see live updates
        </div>
      </div>
    </div>
  );
}

export default UseWindowSizeDemo;
