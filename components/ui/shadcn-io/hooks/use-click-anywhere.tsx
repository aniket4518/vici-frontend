"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const title = "React useClickAnywhere Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

function useEventListener(eventName: string, handler: (event: MouseEvent) => void) {
  const savedHandler = React.useRef(handler);

  React.useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const eventListener = (event: Event) => savedHandler.current(event as MouseEvent);
    document.addEventListener(eventName, eventListener);
    return () => document.removeEventListener(eventName, eventListener);
  }, [eventName]);
}

export function useClickAnyWhere(handler: (event: MouseEvent) => void): void {
  useEventListener("click", (event) => {
    handler(event);
  });
}

// ============================================================================
// Demo Component
// ============================================================================

function UseClickAnywhereDemo() {
  const [clickCount, setClickCount] = React.useState(0);
  const [lastClick, setLastClick] = React.useState<{ x: number; y: number } | null>(null);

  useClickAnyWhere((event) => {
    setClickCount((prev) => prev + 1);
    setLastClick({ x: event.clientX, y: event.clientY });
  });

  const reset = () => {
    setTimeout(() => {
      setClickCount(0);
      setLastClick(null);
    }, 0);
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Click Detection Demo</h3>
        <p className="text-sm text-muted-foreground">Click anywhere on the page</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Total Clicks</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge variant="default" className="text-2xl px-6 py-3 font-bold">
            {clickCount}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Last Click Position</Label>
        <div className="min-h-[32px] flex items-center justify-center">
          {lastClick ? (
            <code className="bg-muted px-3 py-1.5 rounded text-sm">
              x: {lastClick.x}, y: {lastClick.y}
            </code>
          ) : (
            <span className="text-xs text-muted-foreground">Click anywhere to see position</span>
          )}
        </div>
      </div>

      <Button onClick={reset} variant="outline" size="sm" className="w-full">
        Reset Counter
      </Button>
    </div>
  );
}

export default UseClickAnywhereDemo;
