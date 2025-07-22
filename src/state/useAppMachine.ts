import { useMachine } from "@xstate/react";
import { appMachine } from "./appMachine";
import { clearDocCache } from "../hooks/useYjs";

/**
 * Adapter that provides the state machine with helper functions
 * for folder selection and analysis integration.
 */
export function useAppMachine() {
  const [state, send, actor] = useMachine(appMachine);
  

  // Clear cache when resetting
  const originalSend = send;
  const wrappedSend = (event: Parameters<typeof send>[0]) => {
    if (
      typeof event === "object" &&
      event !== null &&
      "type" in event &&
      event.type === "RESET"
    ) {
      clearDocCache();
    }
    originalSend(event);
  };

  // Helper function to handle folder selection
  const handleFolderPick = async () => {
    try {
      if (!("showDirectoryPicker" in window)) {
        throw new Error("Browser lacks File System Access API");
      }

      const dir = await (
        window as {
          showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
        }
      ).showDirectoryPicker();
      const files: File[] = [];

      async function walk(handle: FileSystemDirectoryHandle, prefix = "") {
        for await (const [name, entry] of handle.entries()) {
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
      await walk(dir);
      wrappedSend({ type: "SELECTED", dir, files });
    } catch {
      wrappedSend({ type: "CANCEL" });
    }
  };

  return { state, send: wrappedSend, actor, handleFolderPick };
}
