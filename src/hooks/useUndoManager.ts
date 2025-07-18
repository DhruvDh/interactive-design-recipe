import { useState, useEffect } from "react";
import * as Y from "yjs";

/**
 * Updated useUndo hook with new signature as specified in the guide
 * Each Step passes only the Y object(s) it mutates.
 */
export function useUndo(
  tracked: (Y.AbstractType<unknown> | Y.Array<unknown> | Y.Text | Y.Map<unknown>)[] | null
): Y.UndoManager | null {
  const [um, setUM] = useState<Y.UndoManager | null>(null);

  useEffect(() => {
    if (tracked && tracked.length > 0) {
      const manager = new Y.UndoManager(tracked);
      setUM(manager);

      return () => {
        manager.destroy();
      };
    } else {
      setUM(null);
    }
  }, [tracked]); // Track the entire array

  return um;
}
