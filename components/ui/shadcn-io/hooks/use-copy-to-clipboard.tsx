"use client";

import { useCallback, useState } from "react";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const title = "React useCopyToClipboard Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export type UseCopyToClipboardReturn = [(text: string) => Promise<void>, boolean];

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<void> => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.warn("Copy failed", error);
      setIsCopied(false);
    }
  }, []);

  return [copy, isCopied];
}

// ============================================================================
// Demo Component
// ============================================================================

function UseCopyToClipboardDemo() {
  const [copy, isCopied] = useCopyToClipboard();

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Copy to Clipboard Demo</h3>
        <p className="text-sm text-muted-foreground">Click the button to copy text</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Status</Label>
        <div className="min-h-[32px] flex items-center justify-center">
          <Badge
            variant={isCopied ? "default" : "secondary"}
            className="text-base px-4 py-2 font-semibold w-24 justify-center"
          >
            {isCopied ? "Copied!" : "Ready"}
          </Badge>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => copy("Hello from useCopyToClipboard!")}
      >
        {isCopied ? <ClipboardCheckIcon size={16} /> : <ClipboardIcon size={16} />}
        Copy to Clipboard
      </Button>

      <div className="text-center">
        <code className="text-xs bg-muted px-2 py-1 rounded">Hello from useCopyToClipboard!</code>
      </div>
    </div>
  );
}

export default UseCopyToClipboardDemo;
