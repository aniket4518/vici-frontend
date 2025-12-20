"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MousePointerClick, X } from "lucide-react";

export const title = "React useOnClickOutside Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type EventType =
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "focusin"
  | "focusout";

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null> | React.RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = "mousedown",
  eventListenerOptions: AddEventListenerOptions = {}
): void {
  const savedHandler = React.useRef(handler);

  React.useLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent | FocusEvent) => {
      const target = event.target as Node;

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected) {
        return;
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter((r) => Boolean(r.current))
            .every((r) => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target);

      if (isOutside) {
        savedHandler.current(event);
      }
    };

    document.addEventListener(eventType, listener as EventListener, eventListenerOptions);

    return () => {
      document.removeEventListener(eventType, listener as EventListener, eventListenerOptions);
    };
  }, [ref, eventType, eventListenerOptions]);
}

export type { EventType };

// ============================================================================
// Demo Component
// ============================================================================

function UseOnClickOutsideDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);
  const boxRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(boxRef, () => {
    if (isOpen) {
      setIsOpen(false);
      setClickCount((c) => c + 1);
    }
  });

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Click Outside Demo</h3>
        <p className="text-sm text-muted-foreground">Dismiss by clicking outside</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Interactive Box</Label>
        <div
          ref={boxRef}
          onClick={() => setIsOpen(true)}
          className={`min-h-[100px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
            isOpen
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          {isOpen ? (
            <>
              <Badge variant="default" className="text-sm px-3 py-1.5 gap-1.5">
                <MousePointerClick size={14} />
                Active
              </Badge>
              <span className="text-xs text-muted-foreground mt-2">
                Click outside to dismiss
              </span>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">Click to activate</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Outside Clicks</Label>
          <Badge variant="outline" className="text-xs">{clickCount}</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">
            {isOpen ? "Listening for outside clicks..." : "Box is inactive"}
          </code>
        </div>
      </div>

      <div className="min-h-[36px] flex items-center">
        <Button
          onClick={() => {
            setIsOpen(false);
            setClickCount(0);
          }}
          disabled={!isOpen && clickCount === 0}
          variant="outline"
          size="sm"
          className="w-full text-sm h-9 gap-1"
        >
          <X size={14} />
          Reset
        </Button>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Supports multiple refs, touch events, focus events
        </div>
      </div>
    </div>
  );
}

export default UseOnClickOutsideDemo;
