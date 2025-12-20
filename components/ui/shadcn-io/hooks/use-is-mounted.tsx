"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const title = "React useIsMounted Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export function useIsMounted(): () => boolean {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return React.useCallback(() => isMounted.current, []);
}

// ============================================================================
// Demo Component
// ============================================================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function AsyncComponent() {
  const [status, setStatus] = React.useState<"loading" | "success">("loading");
  const isMounted = useIsMounted();

  React.useEffect(() => {
    void delay(2000).then(() => {
      if (isMounted()) {
        setStatus("success");
      }
    });
  }, [isMounted]);

  return (
    <div className="border rounded p-3 min-h-[60px] flex items-center justify-center">
      <Badge
        variant={status === "loading" ? "secondary" : "default"}
        className="text-sm px-3 py-1 gap-2"
      >
        {status === "loading" && <Loader2 size={14} className="animate-spin" />}
        {status === "loading" ? "Loading..." : "Data loaded!"}
      </Badge>
    </div>
  );
}

function UseIsMountedDemo() {
  const [showComponent, setShowComponent] = React.useState(false);

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Mount State Demo</h3>
        <p className="text-sm text-muted-foreground">Safe async with mount checking</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Component State</Label>
        <div className="min-h-[40px] flex items-center justify-center">
          <Badge
            variant={showComponent ? "default" : "secondary"}
            className="text-base px-4 py-2 font-semibold"
          >
            {showComponent ? "Mounted" : "Unmounted"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Async Component (2s delay)</Label>
        {showComponent ? (
          <AsyncComponent />
        ) : (
          <div className="border rounded p-3 min-h-[60px] flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Click button to mount</span>
          </div>
        )}
      </div>

      <div className="min-h-[36px] flex items-center">
        <Button
          onClick={() => setShowComponent(!showComponent)}
          variant={showComponent ? "outline" : "default"}
          size="sm"
          className="w-full text-sm h-9"
        >
          {showComponent ? "Unmount Component" : "Mount Component"}
        </Button>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Mount then quickly unmount to test safety
        </div>
      </div>
    </div>
  );
}

export default UseIsMountedDemo;
