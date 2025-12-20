"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { FileCode, Loader2, CheckCircle2, XCircle, Circle } from "lucide-react";

export const title = "React useScript Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseScriptStatus = "idle" | "loading" | "ready" | "error";

type UseScriptOptions = {
  shouldPreventLoad?: boolean;
  removeOnUnmount?: boolean;
  id?: string;
};

const cachedScriptStatuses = new Map<string, UseScriptStatus | undefined>();

function getScriptNode(src: string) {
  const node: HTMLScriptElement | null = document.querySelector(
    `script[src="${src}"]`
  );
  const status = node?.getAttribute("data-status") as
    | UseScriptStatus
    | undefined;

  return {
    node,
    status,
  };
}

export function useScript(
  src: string | null,
  options?: UseScriptOptions
): UseScriptStatus {
  const [status, setStatus] = React.useState<UseScriptStatus>(() => {
    if (!src || options?.shouldPreventLoad) {
      return "idle";
    }

    if (typeof window === "undefined") {
      return "loading";
    }

    return cachedScriptStatuses.get(src) ?? "loading";
  });

  React.useEffect(() => {
    if (!src || options?.shouldPreventLoad) {
      return;
    }

    const cachedScriptStatus = cachedScriptStatuses.get(src);
    if (cachedScriptStatus === "ready" || cachedScriptStatus === "error") {
      setStatus(cachedScriptStatus);
      return;
    }

    const script = getScriptNode(src);
    let scriptNode = script.node;

    if (!scriptNode) {
      scriptNode = document.createElement("script");
      scriptNode.src = src;
      scriptNode.async = true;
      if (options?.id) {
        scriptNode.id = options.id;
      }
      scriptNode.setAttribute("data-status", "loading");
      document.body.appendChild(scriptNode);

      const setAttributeFromEvent = (event: Event) => {
        const scriptStatus: UseScriptStatus =
          event.type === "load" ? "ready" : "error";

        scriptNode?.setAttribute("data-status", scriptStatus);
      };

      scriptNode.addEventListener("load", setAttributeFromEvent);
      scriptNode.addEventListener("error", setAttributeFromEvent);
    } else {
      setStatus(script.status ?? cachedScriptStatus ?? "loading");
    }

    const setStateFromEvent = (event: Event) => {
      const newStatus = event.type === "load" ? "ready" : "error";
      setStatus(newStatus);
      cachedScriptStatuses.set(src, newStatus);
    };

    scriptNode.addEventListener("load", setStateFromEvent);
    scriptNode.addEventListener("error", setStateFromEvent);

    return () => {
      if (scriptNode) {
        scriptNode.removeEventListener("load", setStateFromEvent);
        scriptNode.removeEventListener("error", setStateFromEvent);
      }

      if (scriptNode && options?.removeOnUnmount) {
        scriptNode.remove();
        cachedScriptStatuses.delete(src);
      }
    };
  }, [src, options?.shouldPreventLoad, options?.removeOnUnmount, options?.id]);

  return status;
}

export type { UseScriptStatus, UseScriptOptions };

// ============================================================================
// Demo Component
// ============================================================================

function UseScriptDemo() {
  const [shouldLoad, setShouldLoad] = React.useState(false);

  // Using a reliable CDN script for demo
  const status = useScript(
    shouldLoad ? "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js" : null
  );

  const getStatusIcon = () => {
    switch (status) {
      case "idle":
        return <Circle size={16} />;
      case "loading":
        return <Loader2 size={16} className="animate-spin" />;
      case "ready":
        return <CheckCircle2 size={16} />;
      case "error":
        return <XCircle size={16} />;
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case "ready":
        return "default";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Script Loader Demo</h3>
        <p className="text-sm text-muted-foreground">Dynamic script loading</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Loading Status</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={getStatusVariant()}
            className="text-lg px-4 py-2 gap-2 capitalize"
          >
            {getStatusIcon()}
            {status}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Script URL</Label>
        <div className="border rounded p-2 min-h-[48px] flex items-center">
          <code className="text-xs break-all">
            {shouldLoad
              ? "cdn.jsdelivr.net/.../lodash.min.js"
              : "No script queued"}
          </code>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Script Info</Label>
          <Badge variant="outline" className="text-xs gap-1">
            <FileCode size={12} />
            Lodash
          </Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">
            {status === "ready"
              ? "window._ is available"
              : status === "loading"
                ? "Downloading..."
                : "Not loaded"}
          </code>
        </div>
      </div>

      <div className="min-h-[36px] flex items-center">
        <Button
          onClick={() => setShouldLoad(!shouldLoad)}
          variant={shouldLoad ? "secondary" : "default"}
          size="sm"
          className="w-full text-sm h-9"
        >
          {shouldLoad ? "Reset Demo" : "Load Script"}
        </Button>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Cached globally, shared across components
        </div>
      </div>
    </div>
  );
}

export default UseScriptDemo;
