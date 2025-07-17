export interface RecentEntry {
  name: string;
  path: string;
  handle?: FileSystemDirectoryHandle;
  lastAccessed: number;
}
