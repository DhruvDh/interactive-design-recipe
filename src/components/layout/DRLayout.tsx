import { useState } from "react";
import NavSidebar from "./NavSidebar";
import ChatSidebar from "./ChatSidebar";
import CodeViewer from "../viewer/CodeViewer";
import { Card } from "../ui/Card";

type ViewMode = "card" | "code";

interface DRLayoutProps {
  children: React.ReactNode;
}

export default function DRLayout({ children }: DRLayoutProps) {
  const [mode, setMode] = useState<ViewMode>("card");
  const [tabs, setTabs] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const openFile = (id: string) => {
    setTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActive(id);
    setMode("code");
  };

  const closeFile = (id: string) => {
    setTabs((prev) => prev.filter((t) => t !== id));
    if (id === active) {
      setActive(null);
    }
    if (tabs.length === 1) {
      setMode("card");
    }
  };

  const handleBack = () => {
    setMode("card");
  };

  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr_22rem] font-sans">
      {/* left nav */}
      <NavSidebar onOpenFile={openFile} />

      {/* centre column */}
      {mode === "card" ? (
        <Card>{children}</Card>
      ) : (
        <CodeViewer
          tabs={tabs}
          active={active}
          onClose={closeFile}
          onActivate={setActive}
          onBack={handleBack}
        />
      )}

      {/* right chat */}
      <ChatSidebar />
    </div>
  );
}
