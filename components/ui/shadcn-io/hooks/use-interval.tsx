"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw } from "lucide-react";

export const title = "React useInterval Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = React.useRef<() => void>(undefined);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// ============================================================================
// Demo Component
// ============================================================================

function UseIntervalDemo() {
  const [count, setCount] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(true);
  const [delay, setDelay] = React.useState(1000);

  useInterval(
    () => {
      setCount((c) => c + 1);
    },
    isRunning ? delay : null
  );

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Interval Demo</h3>
        <p className="text-sm text-muted-foreground">Auto-incrementing counter</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Count</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={isRunning ? "default" : "secondary"}
            className="text-3xl px-6 py-3 font-mono font-bold"
          >
            {count}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 min-h-[36px]">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "outline" : "default"}
            size="sm"
            className="text-sm h-9 gap-1"
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            onClick={() => setCount(0)}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </Button>
          <Button
            onClick={() => setDelay((d) => (d === 1000 ? 500 : 1000))}
            variant="outline"
            size="sm"
            className="text-sm h-9"
          >
            {delay}ms
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Status</Label>
          <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
            {isRunning ? "Running" : "Paused"}
          </Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">
            useInterval(callback, {isRunning ? `${delay}` : "null"})
          </code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Pass null to pause, number to run
        </div>
      </div>
    </div>
  );
}

export default UseIntervalDemo;
