import { useState, useEffect } from "react";
import { useAnalysisContext } from "../../contexts/AnalysisContext";

export interface CodeViewerProps {
  openFiles: string[];
  activeFile: string | null;
  onCloseFile: (fileId: string) => void;
  onSetActiveFile: (fileId: string) => void;
}

export default function CodeViewer({
  openFiles,
  activeFile,
  onCloseFile,
  onSetActiveFile,
}: CodeViewerProps) {
  const { files } = useAnalysisContext();
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load content for newly opened files
    const loadFileContents = async () => {
      for (const fileId of openFiles) {
        if (!fileContents[fileId]) {
          // Find the file in the files array
          const file = files.find(
            (f) => (f.webkitRelativePath || f.name) === fileId
          );
          let content: string;

          if (file) {
            try {
              content = await file.text();
            } catch (error) {
              content = `// Error loading file: ${error}`;
            }
          } else {
            content = `// File not found: ${fileId}`;
          }

          setFileContents((prev) => ({ ...prev, [fileId]: content }));
        }
      }
    };

    loadFileContents();
  }, [openFiles, fileContents, files]);

  if (openFiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-500">
        <div className="text-center">
          <p className="text-lg mb-2">No files open</p>
          <p className="text-sm">
            Open a file from the project explorer to view its contents
          </p>
        </div>
      </div>
    );
  }

  const handleCloseFile = (fileId: string) => {
    setFileContents((prev) => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
    onCloseFile(fileId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-neutral-200 bg-neutral-50">
        {openFiles.map((fileId) => (
          <div
            key={fileId}
            className={`flex items-center gap-2 px-4 py-2 border-r border-neutral-200 cursor-pointer transition ${
              activeFile === fileId
                ? "bg-white border-b-2 border-b-neutral-500 text-neutral-700"
                : "hover:bg-neutral-100"
            }`}
            onClick={() => onSetActiveFile(fileId)}
          >
            <span className="text-sm">{fileId.split("/").pop()}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseFile(fileId);
              }}
              className="text-neutral-400 hover:text-neutral-600 text-lg leading-none"
              aria-label={`Close ${fileId.split("/").pop()}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* File content */}
      <div className="flex-1 overflow-auto">
        {activeFile && (
          <pre className="p-4 text-sm font-mono leading-relaxed text-neutral-800 whitespace-pre-wrap">
            {fileContents[activeFile] || "Loading..."}
          </pre>
        )}
      </div>
    </div>
  );
}
