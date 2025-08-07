import { useState, useEffect, useRef } from "react";
import * as Y from "yjs";

/**
 * Updated useUndo hook with new signature as specified in the guide
 * Each Step passes only the Y object(s) it mutates.
 */
export function useUndo(
  tracked:
    | (Y.AbstractType<unknown> | Y.Array<unknown> | Y.Text | Y.Map<unknown>)[]
    | null
): Y.UndoManager | null {
  const [um, setUM] = useState<Y.UndoManager | null>(null);
  const prevRef = useRef<typeof tracked>(null);

  useEffect(() => {
    // Check if the tracked array has actually changed by comparing elements
    const same =
      prevRef.current &&
      tracked &&
      prevRef.current.length === tracked.length &&
      prevRef.current.every((v, i) => v === tracked[i]);

    if (same) return;

    // Clean up previous manager
    if (um) um.destroy();
    prevRef.current = tracked;

    if (tracked && tracked.length > 0) {
      const manager = new Y.UndoManager(tracked);
      setUM(manager);

      return () => {
        manager.destroy();
      };
    } else {
      setUM(null);
    }
  }, [tracked, um]); // Include um in dependencies

  return um;
}
