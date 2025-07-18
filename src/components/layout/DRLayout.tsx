import { useState } from "react";
import NavSidebar from "./NavSidebar";
import ChatSidebar from "./ChatSidebar";
import CodeViewer from "../viewer/CodeViewer";

interface DRLayoutProps {
  children: React.ReactNode;
}

export default function DRLayout({ children }: DRLayoutProps) {
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const handleOpenFile = (fileId: string) => {
    setOpenFiles((prev) => {
      if (!prev.includes(fileId)) {
        return [...prev, fileId];
      }
      return prev;
    });
    setActiveFile(fileId);
  };

  const handleCloseFile = (fileId: string) => {
    setOpenFiles((prev) => {
      const filtered = prev.filter((id) => id !== fileId);

      // If closing active file, set new active file
      if (activeFile === fileId) {
        const currentIndex = prev.indexOf(fileId);
        const newActiveFile =
          filtered.length > 0
            ? filtered[currentIndex > 0 ? currentIndex - 1 : 0]
            : null;
        setActiveFile(newActiveFile);
      }

      return filtered;
    });
  };

  const handleSetActiveFile = (fileId: string) => {
    setActiveFile(fileId);
  };

  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr_22rem] font-sans">
      {/* left nav */}
      <NavSidebar onOpenFile={handleOpenFile} />

      {/* centre column */}
      <main className="relative flex flex-col overflow-hidden bg-neutral-100 p-0.5">
        {openFiles.length > 0 ? (
          <div className="flex-1 flex flex-col">
            {/* Step content in upper portion */}
            <div className="flex-1 bg-white rounded-t-3xl m-0.5 mb-0 p-10 overflow-y-auto">
              {children}
            </div>

            {/* CodeViewer in lower portion */}
            <div className="h-80 bg-white rounded-b-3xl mx-0.5 mb-0.5 overflow-hidden">
              <CodeViewer
                openFiles={openFiles}
                activeFile={activeFile}
                onCloseFile={handleCloseFile}
                onSetActiveFile={handleSetActiveFile}
              />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white rounded-3xl m-0.5 p-10 z-10 mx-auto">
            {children}
          </div>
        )}
      </main>

      {/* right chat */}
      <ChatSidebar />
    </div>
  );
}
