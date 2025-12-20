"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Timer, Play, Square, RotateCcw } from "lucide-react";

export const title = "React useTimeout Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay === null || typeof delay !== "number") return;

    const tick = () => savedCallback.current();

    const id = setTimeout(tick, delay);

    return () => clearTimeout(id);
  }, [delay]);
}

// ============================================================================
// Demo Component
// ============================================================================

function UseTimeoutDemo() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [hasCompleted, setHasCompleted] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);

  const handleTimeout = React.useCallback(() => {
    setHasCompleted(true);
    setIsRunning(false);
  }, []);

  // Countdown interval
  React.useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  useTimeout(handleTimeout, isRunning ? 3000 : null);

  const start = () => {
    setHasCompleted(false);
    setCountdown(3);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    setCountdown(3);
  };

  const reset = () => {
    setIsRunning(false);
    setHasCompleted(false);
    setCountdown(3);
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Timeout Demo</h3>
        <p className="text-sm text-muted-foreground">Delayed callback execution</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Timer Status</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={hasCompleted ? "default" : isRunning ? "secondary" : "outline"}
            className="text-2xl px-6 py-3 gap-2"
          >
            <Timer size={20} />
            {hasCompleted ? "Done!" : isRunning ? `${countdown}s` : "Ready"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Controls</Label>
        <div className="grid grid-cols-3 gap-2 min-h-[36px]">
          <Button
            onClick={start}
            disabled={isRunning}
            variant="default"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Play size={14} />
            Start
          </Button>
          <Button
            onClick={stop}
            disabled={!isRunning}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Square size={14} />
            Stop
          </Button>
          <Button
            onClick={reset}
            disabled={isRunning && !hasCompleted}
            variant="secondary"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Configuration</Label>
          <Badge variant="outline" className="text-xs">3 seconds</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">
            delay: {isRunning ? "3000" : "null"} (paused)
          </code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Auto-cleanup, pass null to pause
        </div>
      </div>
    </div>
  );
}

export default UseTimeoutDemo;
