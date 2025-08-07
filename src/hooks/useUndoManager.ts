import { useRef, useEffect, useMemo } from "react";
import * as Y from "yjs";

/**
 * Stable useUndo hook that prevents recreation loops
 * Uses GUID-based signature to detect actual changes in tracked objects
 */
export function useUndo<T extends Y.AbstractType<unknown>>(
  tracked: readonly T[] | null
): Y.UndoManager | null {
  const mgrRef = useRef<Y.UndoManager>();

  // Create stable signature based on GUIDs
  const signature = useMemo(() => {
    return (
      tracked?.map((t) => (t as unknown as { guid: string }).guid).join("|") ??
      ""
    );
  }, [tracked]);

  useEffect(() => {
    mgrRef.current?.destroy();
    mgrRef.current = tracked?.length ? new Y.UndoManager(tracked) : undefined;
    return () => mgrRef.current?.destroy();
  }, [signature, tracked]);

  return mgrRef.current ?? null;
}
