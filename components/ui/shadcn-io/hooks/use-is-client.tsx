"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Monitor, Server } from "lucide-react";

export const title = "React useIsClient Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export function useIsClient(): boolean {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// ============================================================================
// Demo Component
// ============================================================================

function UseIsClientDemo() {
  const isClient = useIsClient();

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Client Detection Demo</h3>
        <p className="text-sm text-muted-foreground">SSR-safe browser API access</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Environment</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={isClient ? "default" : "secondary"}
            className="text-xl px-6 py-3 font-semibold gap-2"
          >
            {isClient ? <Monitor size={20} /> : <Server size={20} />}
            {isClient ? "Client" : "Server"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Browser Info</Label>
        <div className="border rounded p-3 min-h-[60px] flex items-center justify-center">
          {isClient ? (
            <div className="text-xs space-y-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-muted-foreground">Screen:</span>
                <Badge variant="outline" className="text-xs">
                  {window.screen.width}x{window.screen.height}
                </Badge>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-muted-foreground">Online:</span>
                <Badge variant="outline" className="text-xs">
                  {navigator.onLine ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              Browser APIs not available during SSR
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Hook Value</Label>
          <Badge variant={isClient ? "default" : "secondary"} className="text-xs">
            {isClient ? "true" : "false"}
          </Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">useIsClient() = {String(isClient)}</code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          {isClient ? "Hydration complete, browser APIs ready" : "Waiting for client hydration"}
        </div>
      </div>
    </div>
  );
}

export default UseIsClientDemo;
