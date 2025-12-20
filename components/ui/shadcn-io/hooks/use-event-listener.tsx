"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Keyboard } from "lucide-react";

export const title = "React useEventListener Hook";

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

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;

// Element Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions
): void;

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: React.RefObject<Document>,
  options?: boolean | AddEventListenerOptions
): void;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement
>(
  eventName: KW | KH,
  handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event) => void,
  element?: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = React.useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    const targetElement: T | Window = element?.current ?? window;

    if (!(targetElement && targetElement.addEventListener)) return;

    const listener: typeof handler = (event) => {
      savedHandler.current(event);
    };

    targetElement.addEventListener(eventName, listener, options);

    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

export { useEventListener };

// ============================================================================
// Demo Component
// ============================================================================

function UseEventListenerDemo() {
  const [keyPressed, setKeyPressed] = React.useState<string>("");
  const [keyCount, setKeyCount] = React.useState(0);

  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    setKeyPressed(event.key);
    setKeyCount((c) => c + 1);
  }, []);

  useEventListener("keydown", handleKeyDown);

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Event Listener Demo</h3>
        <p className="text-sm text-muted-foreground">Press any key to capture it</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Last Key Pressed</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={keyPressed ? "default" : "secondary"}
            className="text-2xl px-6 py-3 font-mono font-bold gap-2"
          >
            <Keyboard size={20} />
            {keyPressed || "None"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Key Presses</Label>
          <Badge variant="outline" className="text-xs">{keyCount}</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">Listening to window keydown event</code>
        </div>
      </div>

      <div className="min-h-[36px] flex items-center">
        <Button
          onClick={() => {
            setKeyPressed("");
            setKeyCount(0);
          }}
          disabled={!keyPressed && keyCount === 0}
          variant="outline"
          size="sm"
          className="w-full text-sm h-9"
        >
          Clear
        </Button>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Auto-cleanup on unmount, no memory leaks
        </div>
      </div>
    </div>
  );
}

export default UseEventListenerDemo;
