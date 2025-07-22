import { getFile, writeText } from "./useYjs";

/**
 * Return a per-project UUID, persisting it to
 * `.design-recipe/dr-key` if it does not exist yet.
 */
export async function ensureDrKey(
  dir: FileSystemDirectoryHandle
): Promise<string> {
  // Try to read existing key
  const existing = await getFile(dir, "dr-key");
  if (existing) return (await existing.text()).trim();

  // Create new one
  const key = crypto.randomUUID();
  await writeText(dir, "dr-key", key);
  return key;
}
