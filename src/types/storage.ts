export interface RecentEntry {
  id: string;
  name: string;
  path: string;
  handle?: FileSystemDirectoryHandle;
  lastAccessed: number;
  hasPermission?: boolean;
}
