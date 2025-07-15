import { Route, Routes } from "react-router-dom";

/* ---------- sidebars ---------- */

function NavSidebar() {
  return (
    <aside className="bg-neutral-100 text-neutral-800 p-6 space-y-4">
      <h1 className="text-lg font-semibold tracking-wide">Navigation</h1>
    </aside>
  );
}

function ChatSidebar() {
  return (
    <aside className="bg-neutral-100  p-6">
      <h1 className="text-lg font-semibold mb-4">Chat</h1>
      <p className="text-sm text-neutral-600">Chat UI coming soon…</p>
    </aside>
  );
}

/* ---------- pages ---------- */

function Home() {
  return <h1 className="text-3xl font-bold">Data Definition</h1>;
}
function About() {
  return <h1 className="text-3xl font-bold">About page</h1>;
}

/* ---------- root layout ---------- */

export default function App() {
  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr_22rem] font-sans">
      {/* left nav */}
      <NavSidebar />

      {/* centre column */}
      <main className="relative flex justify-center overflow-y-auto bg-neutral-100 p-0.5">
        <div className="w-full max-w-4xl bg-white rounded-3xl m-0.5 p-10 z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>

      {/* right chat */}
      <ChatSidebar />
    </div>
  );
}
