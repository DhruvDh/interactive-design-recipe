import { useState, useEffect, useRef } from "react";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { useProject } from "./useProject";

// Global cache for Y.Doc instances
const docCache = new Map<string, Y.Doc>();

/**
 * Helper function to ensure .design-recipe directory exists
 */
export async function ensureDrFolder(
  dirHandle: FileSystemDirectoryHandle
): Promise<FileSystemDirectoryHandle> {
  return dirHandle.getDirectoryHandle(".design-recipe", { create: true });
}

/**
 * Helper function to write text to a file in .design-recipe directory
 */
export async function writeText(
  projectHandle: FileSystemDirectoryHandle,
  fileName: string,
  text: string
): Promise<void> {
  const drFolder = await ensureDrFolder(projectHandle);

  // Handle nested paths by creating directories as needed
  const parts = fileName.split("/");
  let currentDir = drFolder;

  for (const part of parts.slice(0, -1)) {
    currentDir = await currentDir.getDirectoryHandle(part, { create: true });
  }

  const fileHandle = await currentDir.getFileHandle(parts[parts.length - 1], {
    create: true,
  });
  const ws = await fileHandle.createWritable();
  await ws.write(text);
  await ws.close();
}

/**
 * Helper function to write binary data to a file
 */
export async function writeFile(
  dirHandle: FileSystemDirectoryHandle,
  fileName: string,
  data: Uint8Array
): Promise<void> {
  const drFolder = await ensureDrFolder(dirHandle);
  const fileHandle = await drFolder.getFileHandle(fileName, { create: true });
  const ws = await fileHandle.createWritable();
  await ws.write(data);
  await ws.close();
}

/**
 * Helper function to get a file from the .design-recipe directory
 */
export async function getFile(
  dirHandle: FileSystemDirectoryHandle,
  fileName: string
): Promise<File | null> {
  try {
    const drFolder = await ensureDrFolder(dirHandle);
    const fileHandle = await drFolder.getFileHandle(fileName);
    return await fileHandle.getFile();
  } catch {
    return null;
  }
}

/**
 * Debounce function for batching updates
 */
function debounce<T extends (...args: unknown[]) => void>(
  delay: number,
  fn: T
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

/**
 * Get cached Y.Doc instance or create new one
 */
function getCachedDoc(key: string): Y.Doc | null {
  return docCache.get(key) || null;
}

/**
 * Custom hook to get or create a Y.Doc for a specific step
 */
export function useDoc(stepId: string): Y.Doc | null {
  const { dirHandle, dirKey } = useProject();
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const persistenceRef = useRef<IndexeddbPersistence | null>(null);
  const updateHandlerRef = useRef<((update: Uint8Array) => void) | null>(null);

  useEffect(() => {
    if (!dirHandle || !dirKey) {
      setDoc(null);
      return;
    }

    const key = `${dirKey}:${stepId}`;

    // Get or create doc from cache
    let docInstance = getCachedDoc(key);
    if (!docInstance) {
      docInstance = new Y.Doc();
      docCache.set(key, docInstance);
    }

    const initializeDoc = async () => {
      // Once-only initial FS load
      const file = await getFile(dirHandle, `${stepId}.y`);
      if (file) {
        const buf = new Uint8Array(await file.arrayBuffer());
        if (buf.byteLength) {
          Y.applyUpdate(docInstance!, buf);
        }
      }

      setDoc(docInstance);

      // Set up IndexedDB persistence
      const idb = new IndexeddbPersistence(key, docInstance!);
      persistenceRef.current = idb;

      // Debounced save
      const handler = debounce(3000, () => {
        if (dirHandle) {
          const update = Y.encodeStateAsUpdate(docInstance!);
          writeFile(dirHandle, `${stepId}.y`, update);
        }
      });

      updateHandlerRef.current = handler;
      docInstance!.on("update", handler);
    };

    initializeDoc();

    return () => {
      if (persistenceRef.current) {
        persistenceRef.current.destroy();
      }
      if (updateHandlerRef.current && docInstance) {
        docInstance.off("update", updateHandlerRef.current);
      }
    };
  }, [dirHandle, dirKey, stepId]);

  return doc;
}

/**
 * Custom hook to get the status document for tracking completion status
 */
export function useStatusDoc(): Y.Doc | null {
  return useDoc("status");
}

/**
 * Custom hook to get or create a Y.Text for a specific key
 */
export function useYText(
  doc: Y.Doc | null,
  key: string
): [string, (text: string) => void] {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (!doc) return;

    const yText = doc.getText(key);
    setText(yText.toString());

    const observer = () => {
      setText(yText.toString());
    };

    yText.observe(observer);

    return () => {
      yText.unobserve(observer);
    };
  }, [doc, key]);

  const updateText = (newText: string) => {
    if (!doc) return;
    const yText = doc.getText(key);
    yText.delete(0, yText.length);
    yText.insert(0, newText);
  };

  return [text, updateText];
}

/**
 * Custom hook to get or create a Y.Array for a specific key
 */
export function useYArray<T>(
  doc: Y.Doc | null,
  key: string
): [T[], (items: T[]) => void] {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    if (!doc) return;

    const yArray = doc.getArray<T>(key);
    setItems(yArray.toArray());

    const observer = () => {
      setItems(yArray.toArray());
    };

    yArray.observe(observer);

    return () => {
      yArray.unobserve(observer);
    };
  }, [doc, key]);

  const updateItems = (newItems: T[]) => {
    if (!doc) return;
    const yArray = doc.getArray<T>(key);
    yArray.delete(0, yArray.length);
    yArray.insert(0, newItems);
  };

  return [items, updateItems];
}

/**
 * Custom hook to get or create a Y.Map for a specific key
 */
export function useYMap<T>(
  doc: Y.Doc | null,
  key: string
): [Map<string, T>, (key: string, value: T) => void, (key: string) => void] {
  const [map, setMap] = useState<Map<string, T>>(new Map());

  useEffect(() => {
    if (!doc) return;

    const yMap = doc.getMap<T>(key);
    setMap(new Map(yMap.entries()));

    const observer = () => {
      setMap(new Map(yMap.entries()));
    };

    yMap.observe(observer);

    return () => {
      yMap.unobserve(observer);
    };
  }, [doc, key]);

  const setValue = (key: string, value: T) => {
    if (!doc) return;
    const yMap = doc.getMap<T>(key);
    yMap.set(key, value);
  };

  const deleteValue = (key: string) => {
    if (!doc) return;
    const yMap = doc.getMap<T>(key);
    yMap.delete(key);
  };

  return [map, setValue, deleteValue];
}
