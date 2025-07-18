import { Routes, Route } from "react-router-dom";
import { ProjectGate } from "./components/project/ProjectGate";
import OverviewPage from "./pages/OverviewPage";
import DRLayout from "./components/layout/DRLayout";
import StepRouter from "./components/router/StepRouter";
import About from "./pages/About";
import { ToastProvider } from "./contexts/ToastContext";
import { ToastContainer } from "./components/ui/ToastContainer";

export default function App() {
  return (
    <ToastProvider>
      <ProjectGate>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/step/:id"
            element={
              <DRLayout>
                <StepRouter />
              </DRLayout>
            }
          />
        </Routes>
      </ProjectGate>
      <ToastContainer />
    </ToastProvider>
  );
}
