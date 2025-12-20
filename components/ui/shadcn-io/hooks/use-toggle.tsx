"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ToggleLeft, ToggleRight, RotateCcw } from "lucide-react";

export const title = "React useToggle Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseToggleReturn = [
  boolean,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>
];

export function useToggle(defaultValue = false): UseToggleReturn {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }

  const [value, setValue] = React.useState(defaultValue);

  const toggle = React.useCallback(() => {
    setValue((x) => !x);
  }, []);

  return [value, toggle, setValue];
}

export type { UseToggleReturn };

// ============================================================================
// Demo Component
// ============================================================================

function UseToggleDemo() {
  const [isOn, toggle, setValue] = useToggle(false);
  const [toggleCount, setToggleCount] = React.useState(0);

  const handleToggle = () => {
    toggle();
    setToggleCount((c) => c + 1);
  };

  const reset = () => {
    setValue(false);
    setToggleCount(0);
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Toggle Demo</h3>
        <p className="text-sm text-muted-foreground">Simple boolean toggle</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Current State</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={isOn ? "default" : "secondary"}
            className="text-2xl px-6 py-3 gap-2"
          >
            {isOn ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            {isOn ? "ON" : "OFF"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Controls</Label>
        <div className="grid grid-cols-2 gap-2 min-h-[36px]">
          <Button
            onClick={handleToggle}
            variant="default"
            size="sm"
            className="text-sm h-9"
          >
            Toggle
          </Button>
          <Button
            onClick={reset}
            disabled={!isOn && toggleCount === 0}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Direct Set</Label>
        <div className="grid grid-cols-2 gap-2 min-h-[36px]">
          <Button
            onClick={() => setValue(true)}
            disabled={isOn}
            variant="outline"
            size="sm"
            className="text-sm h-9"
          >
            Set True
          </Button>
          <Button
            onClick={() => setValue(false)}
            disabled={!isOn}
            variant="outline"
            size="sm"
            className="text-sm h-9"
          >
            Set False
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Toggle Count</Label>
          <Badge variant="outline" className="text-xs">{toggleCount}</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">value: {String(isOn)}</code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Memoized toggle function, stable reference
        </div>
      </div>
    </div>
  );
}

export default UseToggleDemo;
