"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export const title = "React useCountdown Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type CountdownOptions = {
  countStart: number;
  intervalMs?: number;
  isIncrement?: boolean;
  countStop?: number;
};

type CountdownControllers = {
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
};

export type UseCountdownReturn = [number, CountdownControllers];

export function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: CountdownOptions): UseCountdownReturn {
  const [count, setCount] = React.useState(countStart);
  const [isRunning, setIsRunning] = React.useState(false);
  const savedCallback = React.useRef<() => void>(undefined);

  const increment = React.useCallback(() => setCount((x) => x + 1), []);
  const decrement = React.useCallback(() => setCount((x) => x - 1), []);
  const resetCount = React.useCallback(() => setCount(countStart), [countStart]);

  const startCountdown = React.useCallback(() => setIsRunning(true), []);
  const stopCountdown = React.useCallback(() => setIsRunning(false), []);

  const resetCountdown = React.useCallback(() => {
    setIsRunning(false);
    resetCount();
  }, [resetCount]);

  const countdownCallback = React.useCallback(() => {
    if (count === countStop) {
      setIsRunning(false);
      return;
    }
    if (isIncrement) {
      increment();
    } else {
      decrement();
    }
  }, [count, countStop, decrement, increment, isIncrement]);

  // Store callback in ref
  React.useEffect(() => {
    savedCallback.current = countdownCallback;
  }, [countdownCallback]);

  // Set up interval
  React.useEffect(() => {
    if (!isRunning) return;

    const tick = () => savedCallback.current?.();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [isRunning, intervalMs]);

  return [count, { startCountdown, stopCountdown, resetCountdown }];
}

export type { CountdownOptions, CountdownControllers };

// ============================================================================
// Demo Component
// ============================================================================

function UseCountdownDemo() {
  const [intervalValue, setIntervalValue] = React.useState<number>(1000);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 30,
      intervalMs: intervalValue,
    });

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Countdown Timer Demo</h3>
        <p className="text-sm text-muted-foreground">Start, stop, and reset the timer</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Current Time</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={count === 0 ? "destructive" : count <= 5 ? "secondary" : "default"}
            className="text-3xl px-6 py-3 font-mono font-bold"
          >
            {count}s
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 min-h-[36px]">
          <Button
            onClick={startCountdown}
            disabled={count === 0}
            variant="default"
            size="sm"
            className="flex-1 text-sm h-9"
          >
            Start
          </Button>
          <Button
            onClick={stopCountdown}
            variant="outline"
            size="sm"
            className="flex-1 text-sm h-9"
          >
            Stop
          </Button>
          <Button
            onClick={resetCountdown}
            variant="outline"
            size="sm"
            className="flex-1 text-sm h-9"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between min-h-[20px]">
          <Label className="text-sm font-medium">Speed</Label>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {intervalValue}ms
          </Badge>
        </div>
        <div className="min-h-[20px] flex items-center">
          <Slider
            value={[intervalValue]}
            onValueChange={(value) => setIntervalValue(value[0])}
            min={200}
            max={2000}
            step={200}
            className="w-full"
          />
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Timer updates every <code className="bg-muted px-1 py-0.5 rounded text-xs">{intervalValue}ms</code>
        </div>
      </div>
    </div>
  );
}

export default UseCountdownDemo;
