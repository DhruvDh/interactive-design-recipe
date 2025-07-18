import { useState, useEffect } from "react";
import { useAnalysisContext } from "../../contexts/AnalysisContext";
import { canonical } from "../../utils/paths";

export interface CodeViewerProps {
  tabs: string[]; // canonical ids
  active: string | null;
  onClose(id: string): void;
  onActivate(id: string): void;
  onBack(): void; // show recipe card again
}

export default function CodeViewer({
  tabs,
  active,
  onClose,
  onActivate,
  onBack,
}: CodeViewerProps) {
  const { files } = useAnalysisContext();
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadFileContents = async () => {
      for (const tabId of tabs) {
        if (!fileContents[tabId] && !isLoading[tabId]) {
          setIsLoading((prev) => ({ ...prev, [tabId]: true }));

          try {
            // Find the file in the files array using canonical path
            const fileObj = files.find((f) => canonical(f) === tabId);

            if (fileObj) {
              const content = await fileObj.text();
              setFileContents((prev) => ({ ...prev, [tabId]: content }));
            } else {
              setFileContents((prev) => ({
                ...prev,
                [tabId]: `// File not found: ${tabId}`,
              }));
            }
          } catch (error) {
            setFileContents((prev) => ({
              ...prev,
              [tabId]: `// Error loading file: ${error}`,
            }));
          } finally {
            setIsLoading((prev) => ({ ...prev, [tabId]: false }));
          }
        }
      }
    };

    loadFileContents();
  }, [tabs, files, fileContents, isLoading]);

  const handleCloseTab = (tabId: string) => {
    setFileContents((prev) => {
      const updated = { ...prev };
      delete updated[tabId];
      return updated;
    });
    setIsLoading((prev) => {
      const updated = { ...prev };
      delete updated[tabId];
      return updated;
    });
    onClose(tabId);
  };

  const handleCloseLastTab = () => {
    if (tabs.length === 1) {
      onBack();
    }
  };

  if (tabs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-500">
        <div className="text-center">
          <p className="text-lg mb-2">No files open</p>
          <p className="text-sm">
            Select a file from the project explorer to view its contents
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl m-0.5 overflow-hidden">
      {/* Header with back button */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 text-sm"
        >
          ← Back to Recipe
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-neutral-200 bg-neutral-50">
        {tabs.map((tabId) => (
          <div
            key={tabId}
            className={`flex items-center gap-2 px-4 py-2 border-r border-neutral-200 cursor-pointer transition ${
              active === tabId
                ? "bg-white border-b-2 border-b-neutral-500 text-neutral-700"
                : "hover:bg-neutral-100"
            }`}
            onClick={() => onActivate(tabId)}
          >
            <span className="text-sm">{tabId.split("/").pop()}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(tabId);
                if (tabs.length === 1) {
                  handleCloseLastTab();
                }
              }}
              className="text-neutral-400 hover:text-neutral-600 text-lg leading-none"
              aria-label={`Close ${tabId.split("/").pop()}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* File content */}
      <div className="flex-1 overflow-auto">
        {active &&
          (isLoading[active] ? (
            <div className="h-full flex items-center justify-center text-neutral-500">
              <p>Loading...</p>
            </div>
          ) : (
            <pre className="p-4 text-sm font-mono leading-relaxed text-neutral-800 whitespace-pre-wrap">
              {fileContents[active] || "Loading..."}
            </pre>
          ))}
      </div>
    </div>
  );
}
