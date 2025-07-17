// File System Access API types
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }

  interface FileSystemDirectoryHandle {
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
    queryPermission(): Promise<"granted" | "denied" | "prompt">;
    requestPermission(): Promise<"granted" | "denied">;
  }

  interface FileSystemFileHandle {
    getFile(): Promise<File>;
  }

  interface FileSystemHandle {
    kind: "file" | "directory";
    name: string;
  }
}

export {};
