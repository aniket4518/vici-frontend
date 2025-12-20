"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const title = "React useCounter Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

export function useCounter(initialValue?: number): UseCounterReturn {
  const [count, setCount] = React.useState(initialValue ?? 0);

  const increment = React.useCallback(() => {
    setCount((x) => x + 1);
  }, []);

  const decrement = React.useCallback(() => {
    setCount((x) => x - 1);
  }, []);

  const reset = React.useCallback(() => {
    setCount(initialValue ?? 0);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}

export type { UseCounterReturn };

// ============================================================================
// Demo Component
// ============================================================================

function UseCounterDemo() {
  const { count, increment, decrement, reset, setCount } = useCounter(0);

  const multiplyBy2 = () => {
    setCount((x) => x * 2);
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Counter Demo</h3>
        <p className="text-sm text-muted-foreground">Increment, decrement, reset, or multiply</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Current Count</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={count === 0 ? "secondary" : count > 0 ? "default" : "destructive"}
            className="text-3xl px-6 py-3 font-mono font-bold"
          >
            {count}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 min-h-[36px]">
          <Button
            onClick={increment}
            variant="default"
            size="sm"
            className="text-sm h-9"
          >
            Increment
          </Button>
          <Button
            onClick={decrement}
            variant="outline"
            size="sm"
            className="text-sm h-9"
          >
            Decrement
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 min-h-[36px]">
          <Button
            onClick={reset}
            variant="secondary"
            size="sm"
            className="text-sm h-9"
          >
            Reset
          </Button>
          <Button
            onClick={multiplyBy2}
            variant="destructive"
            size="sm"
            className="text-sm h-9"
          >
            × 2
          </Button>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Count is {count === 0 ? "zero" : count > 0 ? "positive" : "negative"}
        </div>
      </div>
    </div>
  );
}

export default UseCounterDemo;
