"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Minus, RotateCcw } from "lucide-react";

export const title = "React useEventCallback Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useLayoutEffect(effect, deps);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(effect, deps);
  }
}

export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined
): ((...args: Args) => R) | undefined;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined
): ((...args: Args) => R) | undefined {
  const ref = React.useRef<typeof fn>(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return React.useCallback((...args: Args) => ref.current?.(...args), []) as (
    ...args: Args
  ) => R;
}

// ============================================================================
// Demo Component
// ============================================================================

function UseEventCallbackDemo() {
  const [count, setCount] = React.useState(0);
  const [renderCount, setRenderCount] = React.useState(0);

  React.useEffect(() => {
    setRenderCount((c) => c + 1);
  }, []);

  const handleClick = useEventCallback((action: "increment" | "decrement" | "reset") => {
    if (action === "increment") {
      setCount(count + 1);
    } else if (action === "decrement") {
      setCount(count - 1);
    } else {
      setCount(0);
    }
  });

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Event Callback Demo</h3>
        <p className="text-sm text-muted-foreground">Stable reference, fresh state access</p>
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
        <div className="grid grid-cols-3 gap-2 min-h-[36px]">
          <Button
            onClick={() => handleClick("increment")}
            variant="default"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Plus size={14} />
            1
          </Button>
          <Button
            onClick={() => handleClick("decrement")}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Minus size={14} />
            1
          </Button>
          <Button
            onClick={() => handleClick("reset")}
            disabled={count === 0}
            variant="secondary"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <RotateCcw size={14} />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Callback Identity</Label>
          <Badge variant="outline" className="text-xs">Stable</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">handleClick reference never changes</code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          No stale closure—always sees current count: <code className="bg-muted px-1 py-0.5 rounded">{count}</code>
        </div>
      </div>
    </div>
  );
}

export default UseEventCallbackDemo;
