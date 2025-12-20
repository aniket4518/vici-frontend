"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const title = "React useBoolean Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseBooleanReturn = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
};

export function useBoolean(defaultValue = false): UseBooleanReturn {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }
  const [value, setValue] = React.useState(defaultValue);

  const setTrue = React.useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = React.useCallback(() => {
    setValue(false);
  }, []);

  const toggle = React.useCallback(() => {
    setValue((x) => !x);
  }, []);

  return { value, setValue, setTrue, setFalse, toggle };
}

export type { UseBooleanReturn };

// ============================================================================
// Demo Component
// ============================================================================

function UseBooleanDemo() {
  const { value, setTrue, setFalse, toggle } = useBoolean(false);

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Boolean State Demo</h3>
        <p className="text-sm text-muted-foreground">Basic useBoolean hook functionality</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Current State</Label>
        <div className="min-h-[32px] flex items-center justify-center">
          <Badge
            variant={value ? "default" : "secondary"}
            className="text-base px-4 py-2 font-semibold w-20 justify-center"
          >
            {value ? "True" : "False"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 min-h-[32px]">
          <Button
            onClick={setTrue}
            disabled={value}
            variant={value ? "outline" : "default"}
            size="sm"
            className="flex-1 text-xs h-8"
          >
            Set True
          </Button>

          <Button
            onClick={setFalse}
            disabled={!value}
            variant={!value ? "outline" : "destructive"}
            size="sm"
            className="flex-1 text-xs h-8"
          >
            Set False
          </Button>
        </div>

        <div className="min-h-[32px] flex items-center">
          <Button onClick={toggle} variant="outline" size="sm" className="w-full text-xs h-8">
            Toggle State
          </Button>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Raw value: <code className="bg-muted px-1 py-0.5 rounded text-xs">{String(value)}</code>
        </div>
      </div>
    </div>
  );
}

export default UseBooleanDemo;
