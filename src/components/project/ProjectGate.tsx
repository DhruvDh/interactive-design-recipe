import { useState, useCallback, useContext, useEffect } from "react";
import { AnalysisContext } from "../../contexts/AnalysisContext";
import { useAnalysis } from "../../treesitter/useAnalysis";
import { ensureDrFolder } from "../../hooks/useYjs";
import { AppActorContext } from "../../contexts/AppActorContext";
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
  const actor = useContext(AppActorContext);
  const state = actor?.getSnapshot();
  const send = actor?.send;

  // Monitor machine state and trigger analysis when needed
  useEffect(() => {
    if (state?.matches("analysing") && state.context.files.length > 0 && send) {
      const triggerAnalysis = async () => {
        try {
          // Ensure .design-recipe directory exists if we have a directory handle
          if (state.context.dir) {
            try {
              await ensureDrFolder(state.context.dir);
            } catch (err) {
              console.error("Failed to create .design-recipe directory:", err);
            }

            // Create recent entry
            const recentEntry: RecentEntry = {
              id: crypto.randomUUID(),
              name: state.context.dir.name,
              path: state.context.dir.name,
              handle: state.context.dir,
              lastAccessed: Date.now(),
              hasPermission: true,
            };
            setCurrentProject(recentEntry);
          }

          // Start analysis
          await refresh(state.context.files);

          // When analysis is complete, notify the machine
          if (analysis) {
            send({ type: "PARSE_OK", analysis });
          }
        } catch (err) {
          console.error("Analysis failed:", err);
          send({ type: "PARSE_FAIL", message: String(err) });
        }
      };

      triggerAnalysis();
    }
  }, [state, refresh, analysis, send]);

  // Legacy handle folder select for compatibility
  const handleFolderSelect = useCallback(async () => {
    // This is now handled by the machine, but kept for compatibility
  }, []);

  const contextValue: AnalysisContextType = {
    analysis,
    loading,
    error,
    refresh,
    currentProject,
    files: state?.context.files.length > 0 ? state.context.files : files,
    handleFolderSelect,
  };

  return (
    <AnalysisContext.Provider value={contextValue}>
      {children}
    </AnalysisContext.Provider>
  );
}
