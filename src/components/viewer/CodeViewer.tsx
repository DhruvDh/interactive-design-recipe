import { useState, useEffect } from "react";

export interface CodeViewerProps {
  openFiles: string[];
  activeFile: string | null;
  onCloseFile: (fileId: string) => void;
  onSetActiveFile: (fileId: string) => void;
}

// Mock file content for PoC - in real app would fetch from filesystem
const mockFileContent: Record<string, string> = {
  "project/src/App.tsx": `import { Route, Routes } from "react-router-dom";
import NavSidebar from "./components/layout/NavSidebar";
import ChatSidebar from "./components/layout/ChatSidebar";
import Home from "./pages/Home";
import About from "./pages/About";

export default function App() {
  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr_22rem] font-sans">
      <NavSidebar />
      <main className="relative flex justify-center overflow-y-auto bg-neutral-100 p-0.5">
        <div className="w-full max-w-4xl bg-white rounded-3xl m-0.5 p-10 z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/step/:id" element={<Home />} />
          </Routes>
        </div>
      </main>
      <ChatSidebar />
    </div>
  );
}`,
  "project/src/main.tsx": `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)`,
  "project/package.json": `{
  "name": "design-recipe",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@ibm/plex": "^6.4.1",
    "@tailwindcss/vite": "^4.1.11",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.3",
    "tailwindcss": "^4.1.11"
  }
}`,
  "project/README.md": `# Design Recipe

A step-by-step guide for systematic program design.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start development server: \`npm run dev\`
3. Navigate through the Design Recipe steps in the sidebar
4. Explore project files in the file tree

## Design Recipe Steps

- Step 0: Restate the Problem
- Step 1: Data Definition  
- Step 2: Signature & Purpose
- Step 3: Examples & Tests
- Step 4: Template
- Step 5: Implementation
`,
};

function getFileName(filePath: string): string {
  const parts = filePath.split("/");
  return parts[parts.length - 1];
}

export function CodeViewer({
  openFiles,
  activeFile,
  onCloseFile,
  onSetActiveFile,
}: CodeViewerProps) {
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load content for newly opened files
    openFiles.forEach((fileId) => {
      if (!fileContents[fileId]) {
        const content =
          mockFileContent[fileId] ||
          `// Content for ${fileId}\n// This is a placeholder - in a real app, content would be loaded from the filesystem`;
        setFileContents((prev) => ({ ...prev, [fileId]: content }));
      }
    });
  }, [openFiles, fileContents]);

  if (openFiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-500">
        <div className="text-center">
          <p className="text-lg mb-2">No files open</p>
          <p className="text-sm">
            Select a file from the sidebar to view its contents
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Bar */}
      <div className="flex border-b border-neutral-200 bg-neutral-50">
        {openFiles.map((fileId) => (
          <div
            key={fileId}
            className={`flex items-center gap-2 px-4 py-2 border-r border-neutral-200 cursor-pointer transition ${
              activeFile === fileId
                ? "bg-white border-b-2 border-b-indigo-500 text-indigo-600"
                : "hover:bg-neutral-100"
            }`}
            onClick={() => onSetActiveFile(fileId)}
          >
            <span className="text-sm font-medium">{getFileName(fileId)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseFile(fileId);
              }}
              className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 rounded px-1"
              aria-label={`Close ${getFileName(fileId)}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* File Content */}
      <div className="flex-1 overflow-auto">
        {activeFile && (
          <div className="p-4">
            <div className="mb-2 text-sm text-neutral-600 font-mono">
              {activeFile}
            </div>
            <pre className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 overflow-auto text-sm font-mono whitespace-pre-wrap">
              <code>{fileContents[activeFile] || "Loading..."}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
