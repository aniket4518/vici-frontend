"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export const title = "React useIntersectionObserver Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
  initialIsIntersecting?: boolean;
};

type IntersectionReturn = [
  (node?: Element | null) => void,
  boolean,
  IntersectionObserverEntry | undefined
] & {
  ref: (node?: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  initialIsIntersecting = false,
  onChange,
}: UseIntersectionObserverOptions = {}): IntersectionReturn {
  const [ref, setRef] = React.useState<Element | null>(null);

  const [state, setState] = React.useState<State>(() => ({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  }));

  const callbackRef = React.useRef<UseIntersectionObserverOptions["onChange"]>(undefined);
  callbackRef.current = onChange;

  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  React.useEffect(() => {
    if (!ref) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (frozen) return;

    let unobserve: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some((t) => entry.intersectionRatio >= t);

          setState({ isIntersecting, entry });

          if (callbackRef.current) {
            callbackRef.current(isIntersecting, entry);
          }

          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        });
      },
      { threshold, root, rootMargin }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, JSON.stringify(threshold), root, rootMargin, frozen, freezeOnceVisible]);

  const prevRef = React.useRef<Element | null>(null);

  React.useEffect(() => {
    if (
      !ref &&
      state.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.current !== state.entry.target
    ) {
      prevRef.current = state.entry.target;
      setState({ isIntersecting: initialIsIntersecting, entry: undefined });
    }
  }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting]);

  const result = [setRef, !!state.isIntersecting, state.entry] as IntersectionReturn;

  result.ref = result[0];
  result.isIntersecting = result[1];
  result.entry = result[2];

  return result;
}

export type { UseIntersectionObserverOptions, IntersectionReturn };

// ============================================================================
// Demo Component
// ============================================================================

function UseIntersectionObserverDemo() {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: false,
  });

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Intersection Observer Demo</h3>
        <p className="text-sm text-muted-foreground">Scroll to detect visibility</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Visibility State</Label>
        <div className="min-h-[40px] flex items-center justify-center">
          <Badge
            variant={isIntersecting ? "default" : "secondary"}
            className="text-base px-4 py-2 font-semibold gap-2"
          >
            {isIntersecting ? <Eye size={16} /> : <EyeOff size={16} />}
            {isIntersecting ? "Visible" : "Not Visible"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Scroll Container</Label>
        <div className="h-32 overflow-y-auto border rounded">
          <div className="h-20 flex items-center justify-center text-xs text-muted-foreground">
            Scroll down
          </div>

          <div
            ref={ref}
            className={`mx-3 my-4 p-4 rounded border-2 border-dashed text-center transition-colors ${
              isIntersecting ? "border-primary bg-primary/10" : "border-muted bg-muted/30"
            }`}
          >
            <p className="text-sm font-medium">
              {isIntersecting ? "In viewport" : "Target element"}
            </p>
          </div>

          <div className="h-20 flex items-center justify-center text-xs text-muted-foreground">
            Scroll up
          </div>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Triggers at 50% visibility threshold
        </div>
      </div>
    </div>
  );
}

export default UseIntersectionObserverDemo;
