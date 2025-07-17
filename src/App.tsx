import { Routes, Route } from "react-router-dom";
import { ProjectGate } from "./components/project/ProjectGate";
import OverviewPage from "./pages/OverviewPage";
import DRLayout from "./components/layout/DRLayout";
import Home from "./pages/Home";
import About from "./pages/About";

export default function App() {
  return (
    <ProjectGate>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/step/:id"
          element={
            <DRLayout>
              <Home />
            </DRLayout>
          }
        />
      </Routes>
    </ProjectGate>
  );
}
