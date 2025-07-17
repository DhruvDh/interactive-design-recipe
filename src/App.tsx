import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavSidebar from "./components/layout/NavSidebar";
import ChatSidebar from "./components/layout/ChatSidebar";
import { CodeViewer } from "./components/viewer/CodeViewer";
import Home from "./pages/Home";
import About from "./pages/About";

/* ---------- root layout ---------- */

export default function App() {
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const handleOpenFile = (fileId: string) => {
    // Prevent duplicate files
    if (!openFiles.includes(fileId)) {
      setOpenFiles((prev) => [...prev, fileId]);
    }
    setActiveFile(fileId);
  };

  const handleCloseFile = (fileId: string) => {
    setOpenFiles((prev) => prev.filter((id) => id !== fileId));

    // If closing the active file, set active to the last remaining file
    if (activeFile === fileId) {
      const remainingFiles = openFiles.filter((id) => id !== fileId);
      setActiveFile(
        remainingFiles.length > 0
          ? remainingFiles[remainingFiles.length - 1]
          : null
      );
    }
  };

  const handleSetActiveFile = (fileId: string) => {
    setActiveFile(fileId);
  };

  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr_22rem] font-sans">
      {/* left nav */}
      <NavSidebar onOpenFile={handleOpenFile} />

      {/* centre column */}
      <main className="relative flex justify-center overflow-y-auto bg-neutral-100 p-0.5">
        <div className="w-full max-w-4xl bg-white rounded-3xl m-0.5 p-10 z-10">
          {/* Show CodeViewer when files are open, otherwise show routes */}
          {openFiles.length > 0 ? (
            <CodeViewer
              openFiles={openFiles}
              activeFile={activeFile}
              onCloseFile={handleCloseFile}
              onSetActiveFile={handleSetActiveFile}
            />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              {/* Design Recipe step routes */}
              <Route path="/step/:id" element={<Home />} />
            </Routes>
          )}
        </div>
      </main>

      {/* right chat */}
      <ChatSidebar />
    </div>
  );
}
