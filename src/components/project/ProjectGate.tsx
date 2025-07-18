import React, { useState, useEffect, useCallback } from "react";
import { get, set } from "idb-keyval";
import { useAnalysis } from "../../treesitter/useAnalysis";
import {
  AnalysisContext,
  type AnalysisContextType,
} from "../../contexts/AnalysisContext";
import type { RecentEntry } from "../../types/storage";

interface ProjectGateProps {
  children: React.ReactNode;
}

const RECENT_FOLDERS_KEY = "recent-folders";

export function ProjectGate({ children }: ProjectGateProps) {
  const [currentProject, setCurrentProject] = useState<RecentEntry | null>(
    null
  );
  const [recentFolders, setRecentFolders] = useState<RecentEntry[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const { analysis, loading, error, refresh, files } = useAnalysis();

  // Load recent folders from indexedDB
  useEffect(() => {
    async function loadRecentFolders() {
      try {
        const stored = await get(RECENT_FOLDERS_KEY);
        if (stored && Array.isArray(stored)) {
          setRecentFolders(stored);
        }
      } catch (err) {
        console.error("Failed to load recent folders:", err);
      } finally {
        setIsLoadingRecent(false);
      }
    }

    loadRecentFolders();
  }, []);

  // Save recent folders to indexedDB
  const saveRecentFolders = useCallback(async (folders: RecentEntry[]) => {
    try {
      await set(RECENT_FOLDERS_KEY, folders);
    } catch (err) {
      console.error("Failed to save recent folders:", err);
    }
  }, []);

  // Add folder to recent list
  const addToRecentFolders = useCallback(
    (entry: RecentEntry) => {
      setRecentFolders((prev) => {
        const filtered = prev.filter((f) => f.id !== entry.id);
        const updated = [entry, ...filtered].slice(0, 5); // Keep only 5 most recent
        saveRecentFolders(updated);
        return updated;
      });
    },
    [saveRecentFolders]
  );

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
        addToRecentFolders(recentEntry);

        // Start analysis
        await refresh(files);
      } catch (err) {
        console.error("Failed to process folder:", err);
      }
    },
    [refresh, addToRecentFolders]
  );

  // Handle "Select folder" button click
  const handleSelectFolder = useCallback(async () => {
    try {
      if ("showDirectoryPicker" in window && window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        await handleFolderSelect(dirHandle);
      } else {
        alert(
          "Directory selection is only supported in Chromium-based browsers"
        );
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error selecting folder:", err);
      }
    }
  }, [handleFolderSelect]);

  // Handle recent folder click
  const handleRecentFolderClick = useCallback(
    async (entry: RecentEntry) => {
      if (!entry.handle) {
        return;
      }

      try {
        // Check if we still have permission
        const permission = await entry.handle.queryPermission();
        if (permission === "granted") {
          // Update permission status
          const updatedEntry = { ...entry, hasPermission: true };
          addToRecentFolders(updatedEntry);
          await handleFolderSelect(entry.handle);
        } else {
          // Try to request permission
          const requestResult = await entry.handle.requestPermission();
          if (requestResult === "granted") {
            const updatedEntry = { ...entry, hasPermission: true };
            addToRecentFolders(updatedEntry);
            await handleFolderSelect(entry.handle);
          } else {
            // Mark as permission revoked
            const updatedEntry = { ...entry, hasPermission: false };
            addToRecentFolders(updatedEntry);
          }
        }
      } catch (err) {
        console.error("Failed to access recent folder:", err);
        // Mark as permission revoked on error
        const updatedEntry = { ...entry, hasPermission: false };
        addToRecentFolders(updatedEntry);
      }
    },
    [handleFolderSelect, addToRecentFolders]
  );

  // If no project is selected, show project picker
  if (!currentProject) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Design Recipe</h1>
          <p className="text-neutral-600 text-center mb-8">
            Select a Java project folder to begin systematic program design
          </p>

          <button
            onClick={handleSelectFolder}
            className="w-full bg-neutral-600 text-white px-4 py-3 rounded-lg hover:bg-neutral-700 transition mb-6"
          >
            Select Java Project Folder
          </button>

          <div className="text-xs text-neutral-500 text-center mb-6">
            Chrome-based browsers only
          </div>

          {!isLoadingRecent && recentFolders.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-neutral-700 mb-3">
                Recent Projects
              </h2>
              <div className="space-y-2">
                {recentFolders.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleRecentFolderClick(entry)}
                    disabled={entry.hasPermission === false}
                    className={`w-full text-left p-3 rounded border transition ${
                      entry.hasPermission === false
                        ? "border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="font-medium text-sm">
                      {entry.name}
                      {entry.hasPermission === false && (
                        <span className="ml-2 text-xs text-neutral-400">
                          (Permission revoked)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {new Date(entry.lastAccessed).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If project is selected, provide analysis context to children
  const contextValue: AnalysisContextType = {
    analysis,
    loading,
    error,
    refresh,
    currentProject,
    files,
  };

  return (
    <AnalysisContext.Provider value={contextValue}>
      {children}
    </AnalysisContext.Provider>
  );
}
