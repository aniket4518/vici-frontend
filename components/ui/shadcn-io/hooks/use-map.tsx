"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Trash2 } from "lucide-react";

export const title = "React useMap Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type MapOrEntries<K, V> = Map<K, V> | [K, V][];

type UseMapActions<K, V> = {
  set: (key: K, value: V) => void;
  setAll: (entries: MapOrEntries<K, V>) => void;
  remove: (key: K) => void;
  reset: Map<K, V>["clear"];
};

type UseMapReturn<K, V> = [
  Omit<Map<K, V>, "set" | "clear" | "delete">,
  UseMapActions<K, V>
];

export function useMap<K, V>(
  initialState: MapOrEntries<K, V> = new Map()
): UseMapReturn<K, V> {
  const [map, setMap] = React.useState(new Map(initialState));

  const actions: UseMapActions<K, V> = {
    set: React.useCallback((key, value) => {
      setMap((prev) => {
        const copy = new Map(prev);
        copy.set(key, value);
        return copy;
      });
    }, []),

    setAll: React.useCallback((entries) => {
      setMap(() => new Map(entries));
    }, []),

    remove: React.useCallback((key) => {
      setMap((prev) => {
        const copy = new Map(prev);
        copy.delete(key);
        return copy;
      });
    }, []),

    reset: React.useCallback(() => {
      setMap(() => new Map());
    }, []),
  };

  return [map, actions];
}

export type { MapOrEntries, UseMapActions, UseMapReturn };

// ============================================================================
// Demo Component
// ============================================================================

function UseMapDemo() {
  const [map, { set, remove, reset }] = useMap<string, string>([
    ["name", "John"],
    ["role", "Admin"],
  ]);

  const handleAdd = () => {
    const key = `key-${Date.now().toString().slice(-4)}`;
    set(key, "Value");
  };

  const handleRemove = () => {
    const firstKey = Array.from(map.keys())[0];
    if (firstKey) {
      remove(firstKey);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Map State Demo</h3>
        <p className="text-sm text-muted-foreground">Key-value state with CRUD helpers</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Map Contents</Label>
          <Badge variant="secondary" className="text-xs">
            {map.size} items
          </Badge>
        </div>
        <div className="border rounded p-2 min-h-[100px] max-h-[120px] overflow-y-auto">
          {map.size === 0 ? (
            <div className="h-[84px] flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Empty map</span>
            </div>
          ) : (
            <div className="space-y-1">
              {Array.from(map.entries()).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-1.5 bg-muted rounded text-xs"
                >
                  <code className="font-mono">{key}</code>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {value}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 min-h-[36px]">
          <Button
            onClick={handleAdd}
            variant="default"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Plus size={14} />
            Add
          </Button>
          <Button
            onClick={handleRemove}
            disabled={map.size === 0}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Minus size={14} />
            Remove
          </Button>
          <Button
            onClick={reset}
            disabled={map.size === 0}
            variant="secondary"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <Trash2 size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          Immutable updates, type-safe operations
        </div>
      </div>
    </div>
  );
}

export default UseMapDemo;
