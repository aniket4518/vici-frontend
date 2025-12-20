"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const title = "React useIsomorphicLayoutEffect Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// ============================================================================
// Demo Component
// ============================================================================

function UseIsomorphicLayoutEffectDemo() {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [effectType, setEffectType] = React.useState("Detecting...");
  const elementRef = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const type = typeof window !== "undefined" ? "useLayoutEffect" : "useEffect";
    setEffectType(type);

    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    }
  }, []);

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Isomorphic Layout Effect</h3>
        <p className="text-sm text-muted-foreground">SSR-safe DOM measurements</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Active Effect Type</Label>
        <div className="min-h-[40px] flex items-center justify-center">
          <Badge
            variant={effectType === "useLayoutEffect" ? "default" : "secondary"}
            className="text-base px-4 py-2 font-semibold"
          >
            {effectType}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Measured Element</Label>
        <div
          ref={elementRef}
          className="bg-primary/10 border-2 border-primary/50 rounded-lg p-4 min-h-[60px] flex items-center justify-center"
        >
          <p className="text-sm font-medium">Measure me!</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Dimensions</Label>
          <Badge variant="outline" className="text-xs">Synchronous</Badge>
        </div>
        <div className="border rounded p-2 min-h-[40px] flex items-center justify-center">
          {dimensions.width > 0 ? (
            <div className="flex gap-3">
              <code className="text-xs">W: {dimensions.width}px</code>
              <code className="text-xs">H: {dimensions.height}px</code>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Measuring...</span>
          )}
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          No SSR warnings, synchronous DOM access
        </div>
      </div>
    </div>
  );
}

export default UseIsomorphicLayoutEffectDemo;
