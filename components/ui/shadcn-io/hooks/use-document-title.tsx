"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";

export const title = "React useDocumentTitle Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

export function useDocumentTitle(title: string): void {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
}

// ============================================================================
// Demo Component
// ============================================================================

function UseDocumentTitleDemo() {
  const [counter, setCounter] = React.useState(0);
  const [customTitle, setCustomTitle] = React.useState("");

  const documentTitle = customTitle || `Clicked ${counter} times`;
  useDocumentTitle(documentTitle);

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Document Title Demo</h3>
        <p className="text-sm text-muted-foreground">Check your browser tab title</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Click Counter</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge
            variant={counter === 0 ? "secondary" : "default"}
            className="text-3xl px-6 py-3 font-mono font-bold"
          >
            {counter}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 min-h-[36px]">
          <Button
            onClick={() => setCounter((c) => c + 1)}
            variant="default"
            size="sm"
            className="text-sm h-9"
          >
            Increment
          </Button>
          <Button
            onClick={() => setCounter(0)}
            disabled={counter === 0}
            variant="outline"
            size="sm"
            className="text-sm h-9"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Custom Title</Label>
        <div className="min-h-[36px] flex items-center">
          <Input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Type a custom title..."
            className="w-full h-9 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between min-h-[20px]">
          <Label className="text-sm font-medium">Current Title</Label>
          <Badge variant="outline" className="text-xs px-2 py-0.5 gap-1">
            <FileText size={10} />
            Live
          </Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs text-center break-all">{documentTitle}</code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Look at your browser tab to see the title
        </div>
      </div>
    </div>
  );
}

export default UseDocumentTitleDemo;
