import { useEffect } from "react";
import type { ActorRefFrom } from "xstate";
import {
  loadLastProjectHandle,
  clearLastProjectHandle,
} from "../utils/lastProject";
import { appMachine } from "../state/appMachine";
import { ensureDrKey } from "./useDrKey";

export function useAutoReconnectProject(
  actor: ActorRefFrom<typeof appMachine>
) {
  useEffect(() => {
    (async () => {
      let handle: FileSystemDirectoryHandle | undefined;
      try {
        handle = await loadLastProjectHandle();
      } catch (error) {
        console.warn("Failed to load last project handle:", error);
        await clearLastProjectHandle();
        return;
      }
      if (!handle) return;

      let perm = await handle.queryPermission();
      if (perm !== "granted") {
        perm = await handle.requestPermission();
        if (perm !== "granted") return; // user denied → abort
      }

      const dirKey = await ensureDrKey(handle);

      const files: File[] = [];
      async function walk(dir: FileSystemDirectoryHandle, prefix = "") {
        for await (const [name, entry] of dir.entries()) {
          const path = prefix ? `${prefix}/${name}` : name;
          if (entry.kind === "file") {
            const file = await (entry as FileSystemFileHandle).getFile();
            Object.defineProperty(file, "webkitRelativePath", { value: path });
            files.push(file);
          } else {
            await walk(entry as FileSystemDirectoryHandle, path);
          }
        }
      }
      await walk(handle);

      actor.send({ type: "SELECTED", dir: handle, files, dirKey });
    })();
  }, [actor]);
}
