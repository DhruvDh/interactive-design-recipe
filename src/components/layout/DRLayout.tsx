import NavSidebar from "./NavSidebar";
import ChatSidebar from "./ChatSidebar";

interface DRLayoutProps {
  children: React.ReactNode;
}

export default function DRLayout({ children }: DRLayoutProps) {
  const handleOpenFile = (fileId: string) => {
    console.log("Opening file:", fileId);
    // TODO: Implement file opening logic
  };

  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr_22rem] font-sans">
      {/* left nav */}
      <NavSidebar onOpenFile={handleOpenFile} />

      {/* centre column */}
      <main className="relative flex justify-center overflow-y-auto bg-neutral-100 p-0.5">
        <div className="w-full max-w-4xl bg-white rounded-3xl m-0.5 p-10 z-10">
          {children}
        </div>
      </main>

      {/* right chat */}
      <ChatSidebar />
    </div>
  );
}
