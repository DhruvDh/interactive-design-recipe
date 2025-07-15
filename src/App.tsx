import { Route, Routes } from "react-router-dom";
import NavSidebar from "./components/layout/NavSidebar";
import ChatSidebar from "./components/layout/ChatSidebar";
import Home from "./pages/Home";
import About from "./pages/About";

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
