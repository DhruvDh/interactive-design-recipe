import { Route, Routes } from "react-router-dom";

/* ---------- sidebars ---------- */

function NavSidebar() {
  return (
    <aside className="bg-neutral-800 text-neutral-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold tracking-wide">Navigation</h2>
      <nav className="space-y-2">
        <a className="block hover:underline" href="/">
          Home
        </a>
        <a className="block hover:underline" href="/about">
          About
        </a>
      </nav>
    </aside>
  );
}

function ChatSidebar() {
  return (
    <aside className="bg-neutral-50 border-l border-neutral-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Chat</h2>
      <p className="text-sm text-neutral-600">Chat UI coming soon…</p>
    </aside>
  );
}

/* ---------- pages ---------- */

function Home() {
  return <h1 className="text-3xl font-bold">Home page</h1>;
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
      <main className="relative flex justify-center overflow-y-auto p-8">
        <div
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10
                        -mx-6 sm:-mx-10 lg:-mx-16"
        >
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
