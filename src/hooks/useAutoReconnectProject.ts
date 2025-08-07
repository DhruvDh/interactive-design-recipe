import { useEffect } from "react";
import type { ActorRefFrom } from "xstate";
import { loadLastProjectHandle } from "../utils/lastProject";
import { appMachine } from "../state/appMachine";
import { ensureDrKey } from "./useDrKey";

export function useAutoReconnectProject(
  actor: ActorRefFrom<typeof appMachine>
) {
  useEffect(() => {
    (async () => {
      const handle = await loadLastProjectHandle();
      if (!handle) return;

      const perm = await handle.queryPermission();
      if (perm !== "granted") return;

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
