"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MousePointer2 } from "lucide-react";

export const title = "React useMousePosition Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export type Position = {
  x: number;
  y: number;
  elementX?: number;
  elementY?: number;
  elementPositionX?: number;
  elementPositionY?: number;
};

export function useMousePosition<T extends HTMLElement>(): [
  Position,
  React.RefObject<T>
] {
  const [state, setState] = React.useState<Position>({
    x: 0,
    y: 0,
  });

  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const newState: Position = {
        x: event.pageX,
        y: event.pageY,
      };

      if (ref.current?.nodeType === Node.ELEMENT_NODE) {
        const { left, top } = ref.current.getBoundingClientRect();
        const elementPositionX = left + window.scrollX;
        const elementPositionY = top + window.scrollY;
        const elementX = event.pageX - elementPositionX;
        const elementY = event.pageY - elementPositionY;

        newState.elementPositionX = elementPositionX;
        newState.elementPositionY = elementPositionY;
        newState.elementX = elementX;
        newState.elementY = elementY;
      }

      setState(newState);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return [state, ref];
}

// ============================================================================
// Demo Component
// ============================================================================

function UseMousePositionDemo() {
  const [mouse, trackingRef] = useMousePosition<HTMLDivElement>();

  const isInside =
    mouse.elementX !== undefined &&
    mouse.elementY !== undefined &&
    mouse.elementX >= 0 &&
    mouse.elementY >= 0;

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Mouse Position Demo</h3>
        <p className="text-sm text-muted-foreground">Real-time cursor tracking</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Tracking Area</Label>
        <div
          ref={trackingRef}
          className="border-2 border-dashed rounded-lg h-24 flex items-center justify-center relative cursor-crosshair bg-muted/30"
        >
          <span className="text-sm text-muted-foreground">Move mouse here</span>
          {isInside && (
            <div
              className="absolute w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${mouse.elementX}px`,
                top: `${mouse.elementY}px`,
              }}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Coordinates</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-2 min-h-[50px] flex flex-col items-center justify-center">
            <div className="text-xs text-muted-foreground mb-1">Global (page)</div>
            <Badge variant="outline" className="text-xs font-mono">
              {mouse.x}, {mouse.y}
            </Badge>
          </div>
          <div className="border rounded p-2 min-h-[50px] flex flex-col items-center justify-center">
            <div className="text-xs text-muted-foreground mb-1">Element</div>
            <Badge variant="outline" className="text-xs font-mono">
              {isInside
                ? `${Math.round(mouse.elementX!)}, ${Math.round(mouse.elementY!)}`
                : "—, —"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Status</Label>
          <Badge variant={isInside ? "default" : "secondary"} className="text-xs gap-1">
            <MousePointer2 size={12} />
            {isInside ? "Tracking" : "Outside"}
          </Badge>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Attach ref to any element for relative coordinates
        </div>
      </div>
    </div>
  );
}

export default UseMousePositionDemo;
