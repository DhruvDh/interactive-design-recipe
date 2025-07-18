import { useState, useCallback } from "react";
import { AnalysisContext } from "../../contexts/AnalysisContext";
import { useAnalysis } from "../../treesitter/useAnalysis";
import { ensureDrFolder } from "../../hooks/useYjs";
import type { AnalysisContextType } from "../../contexts/AnalysisContext";

interface ProjectGateProps {
  children: React.ReactNode;
}

interface RecentEntry {
  id: string;
  name: string;
  path: string;
  handle: FileSystemDirectoryHandle;
  lastAccessed: number;
  hasPermission: boolean;
}

export function ProjectGate({ children }: ProjectGateProps) {
  const [currentProject, setCurrentProject] = useState<RecentEntry | null>(
    null
  );
  const { analysis, loading, error, refresh, files } = useAnalysis();

  // Handle folder selection
  const handleFolderSelect = useCallback(
    async (dirHandle: FileSystemDirectoryHandle) => {
      try {
        const files: File[] = [];

        // Recursively read files from directory
        async function readDirectory(
          handle: FileSystemDirectoryHandle,
          path = ""
        ) {
          for await (const [name, entry] of handle.entries()) {
            const fullPath = path ? `${path}/${name}` : name;

            if (entry.kind === "file") {
              const fileHandle = entry as FileSystemFileHandle;
              const file = await fileHandle.getFile();
              // Only include Java files for now
              if (file.name.endsWith(".java")) {
                // Add webkitRelativePath for compatibility
                Object.defineProperty(file, "webkitRelativePath", {
                  value: fullPath,
                  writable: false,
                });
                files.push(file);
              }
            } else if (entry.kind === "directory") {
              await readDirectory(entry as FileSystemDirectoryHandle, fullPath);
            }
          }
        }

        await readDirectory(dirHandle);

        // Create recent entry
        const recentEntry: RecentEntry = {
          id: crypto.randomUUID(),
          name: dirHandle.name,
          path: dirHandle.name, // For now, use name as path
          handle: dirHandle,
          lastAccessed: Date.now(),
          hasPermission: true,
        };

        setCurrentProject(recentEntry);

        // Ensure .design-recipe directory exists
        try {
          await ensureDrFolder(dirHandle);
        } catch (err) {
          console.error("Failed to create .design-recipe directory:", err);
        }

        // Start analysis
        await refresh(files);
      } catch (err) {
        console.error("Failed to process folder:", err);
      }
    },
    [refresh]
  );

  // If no project is selected, still provide context to children
  // The routing will handle showing the appropriate page
  const contextValue: AnalysisContextType = {
    analysis,
    loading,
    error,
    refresh,
    currentProject,
    files,
    handleFolderSelect,
  };

  return (
    <AnalysisContext.Provider value={contextValue}>
      {children}
    </AnalysisContext.Provider>
  );
}
