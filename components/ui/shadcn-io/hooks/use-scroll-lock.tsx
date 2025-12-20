"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Lock, Unlock } from "lucide-react";

export const title = "React useScrollLock Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseScrollLockOptions = {
  autoLock?: boolean;
  lockTarget?: HTMLElement | string;
  widthReflow?: boolean;
};

type UseScrollLockReturn = {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
};

type OriginalStyle = {
  overflow: CSSStyleDeclaration["overflow"];
  paddingRight: CSSStyleDeclaration["paddingRight"];
};

const IS_SERVER = typeof window === "undefined";

export function useScrollLock(
  options: UseScrollLockOptions = {}
): UseScrollLockReturn {
  const { autoLock = true, lockTarget, widthReflow = true } = options;
  const [isLocked, setIsLocked] = React.useState(false);
  const target = React.useRef<HTMLElement | null>(null);
  const originalStyle = React.useRef<OriginalStyle | null>(null);

  const lock = React.useCallback(() => {
    if (target.current) {
      const { overflow, paddingRight } = target.current.style;

      // Save the original styles
      originalStyle.current = { overflow, paddingRight };

      // Prevent width reflow
      if (widthReflow) {
        const offsetWidth =
          target.current === document.body
            ? window.innerWidth
            : target.current.offsetWidth;
        const currentPaddingRight =
          parseInt(window.getComputedStyle(target.current).paddingRight, 10) ||
          0;

        const scrollbarWidth = offsetWidth - target.current.scrollWidth;
        target.current.style.paddingRight = `${scrollbarWidth + currentPaddingRight}px`;
      }

      // Lock the scroll
      target.current.style.overflow = "hidden";

      setIsLocked(true);
    }
  }, [widthReflow]);

  const unlock = React.useCallback(() => {
    if (target.current && originalStyle.current) {
      target.current.style.overflow = originalStyle.current.overflow;

      if (widthReflow) {
        target.current.style.paddingRight = originalStyle.current.paddingRight;
      }
    }

    setIsLocked(false);
  }, [widthReflow]);

  React.useLayoutEffect(() => {
    if (IS_SERVER) return;

    if (lockTarget) {
      target.current =
        typeof lockTarget === "string"
          ? document.querySelector(lockTarget)
          : lockTarget;
    }

    if (!target.current) {
      target.current = document.body;
    }

    if (autoLock) {
      lock();
    }

    return () => {
      unlock();
    };
  }, [autoLock, lockTarget, widthReflow, lock, unlock]);

  return { isLocked, lock, unlock };
}

export type { UseScrollLockOptions, UseScrollLockReturn };

// ============================================================================
// Demo Component
// ============================================================================

function UseScrollLockDemo() {
  const { isLocked, lock, unlock } = useScrollLock({ autoLock: false });

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Scroll Lock Demo</h3>
        <p className="text-sm text-muted-foreground">Prevent page scrolling</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Lock Status</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={isLocked ? "default" : "secondary"}
            className="text-lg px-4 py-2 gap-2"
          >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            {isLocked ? "Locked" : "Unlocked"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Controls</Label>
        <div className="grid grid-cols-2 gap-2 min-h-[36px]">
          <Button
            onClick={lock}
            disabled={isLocked}
            variant="default"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Lock size={14} />
            Lock
          </Button>
          <Button
            onClick={unlock}
            disabled={!isLocked}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Unlock size={14} />
            Unlock
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Target</Label>
          <Badge variant="outline" className="text-xs">document.body</Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">
            overflow: {isLocked ? "hidden" : "auto"}
          </code>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Info</Label>
        <div className="border rounded p-3 space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Width reflow</span>
            <Badge variant="secondary" className="text-xs">Prevented</Badge>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Scrollbar compensation</span>
            <Badge variant="secondary" className="text-xs">Active</Badge>
          </div>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Try scrolling the page when locked
        </div>
      </div>
    </div>
  );
}

export default UseScrollLockDemo;
