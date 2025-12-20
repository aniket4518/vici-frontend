"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Monitor, Smartphone, RotateCw } from "lucide-react";
import debounce from "lodash.debounce";

export const title = "React useScreen Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseScreenOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: number;
};

const IS_SERVER = typeof window === "undefined";

export function useScreen(options: UseScreenOptions<false>): Screen | undefined;
export function useScreen(options?: Partial<UseScreenOptions<true>>): Screen;
export function useScreen(
  options: Partial<UseScreenOptions<boolean>> = {}
): Screen | undefined {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const readScreen = () => {
    if (IS_SERVER) {
      return undefined;
    }
    return window.screen;
  };

  const [screen, setScreen] = React.useState<Screen | undefined>(() => {
    if (initializeWithValue) {
      return readScreen();
    }
    return undefined;
  });

  const debouncedSetScreen = React.useMemo(
    () =>
      options.debounceDelay
        ? debounce(setScreen, options.debounceDelay)
        : setScreen,
    [options.debounceDelay]
  );

  React.useEffect(() => {
    const handleSize = () => {
      const newScreen = readScreen();

      if (newScreen) {
        const {
          width,
          height,
          availHeight,
          availWidth,
          colorDepth,
          orientation,
          pixelDepth,
        } = newScreen;

        debouncedSetScreen({
          width,
          height,
          availHeight,
          availWidth,
          colorDepth,
          orientation,
          pixelDepth,
        } as Screen);
      }
    };

    handleSize();
    window.addEventListener("resize", handleSize);

    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [debouncedSetScreen]);

  return screen;
}

export type { UseScreenOptions };

// ============================================================================
// Demo Component
// ============================================================================

function UseScreenDemo() {
  const screen = useScreen();
  const isLandscape = screen ? screen.width > screen.height : false;

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Screen Info Demo</h3>
        <p className="text-sm text-muted-foreground">Device display properties</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Screen Dimensions</Label>
        <div className="min-h-[60px] flex items-center justify-center gap-2">
          <Badge variant="default" className="text-lg px-4 py-2 gap-2">
            {isLandscape ? <Monitor size={18} /> : <Smartphone size={18} />}
            {screen ? `${screen.width} × ${screen.height}` : "Loading..."}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Available Space</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Width</div>
            <Badge variant="outline" className="text-sm font-mono">
              {screen?.availWidth ?? "—"}px
            </Badge>
          </div>
          <div className="border rounded p-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Height</div>
            <Badge variant="outline" className="text-sm font-mono">
              {screen?.availHeight ?? "—"}px
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Display Properties</Label>
        <div className="border rounded p-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Color Depth</span>
            <Badge variant="secondary" className="text-xs">
              {screen?.colorDepth ?? "—"} bit
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Pixel Depth</span>
            <Badge variant="secondary" className="text-xs">
              {screen?.pixelDepth ?? "—"} bit
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Orientation</span>
            <Badge variant="secondary" className="text-xs gap-1">
              <RotateCw size={10} />
              {screen?.orientation?.type?.split("-")[0] ?? "—"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Physical screen info, excludes OS UI
        </div>
      </div>
    </div>
  );
}

export default UseScreenDemo;
