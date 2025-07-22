import { get, set, del } from "idb-keyval";

const KEY = "dr-last-project";

export async function saveLastProjectHandle(
  handle: FileSystemDirectoryHandle
) {
  await set(KEY, handle);
}

export const loadLastProjectHandle = (): Promise<
  FileSystemDirectoryHandle | undefined
> => get(KEY);

export const clearLastProjectHandle = () => del(KEY);
