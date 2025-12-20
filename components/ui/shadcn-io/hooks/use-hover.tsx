"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const title = "React useHover Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export function useHover<T extends HTMLElement = HTMLElement>(
  elementRef: React.RefObject<T | null>
): boolean {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [elementRef]);

  return isHovered;
}

// ============================================================================
// Demo Component
// ============================================================================

function UseHoverDemo() {
  const hoverRef = React.useRef<HTMLDivElement>(null);
  const isHovered = useHover<HTMLDivElement>(hoverRef);

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Hover Demo</h3>
        <p className="text-sm text-muted-foreground">Move your mouse over the target area</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Hover State</Label>
        <div className="min-h-[40px] flex items-center justify-center">
          <Badge
            variant={isHovered ? "default" : "secondary"}
            className="text-base px-4 py-2 font-semibold"
          >
            {isHovered ? "Hovering" : "Not Hovering"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Hover Target</Label>
        <div
          ref={hoverRef}
          className={`rounded-lg min-h-[100px] flex items-center justify-center transition-all duration-200 cursor-pointer border-2 ${
            isHovered
              ? "bg-primary/10 border-primary"
              : "bg-muted/50 border-transparent"
          }`}
        >
          <p className="text-sm text-center text-muted-foreground">
            {isHovered ? "Mouse is over this area" : "Hover over me"}
          </p>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Uses mouseenter/mouseleave events
        </div>
      </div>
    </div>
  );
}

export default UseHoverDemo;
