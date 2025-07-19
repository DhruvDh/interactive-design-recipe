import { Routes, Route, Navigate } from "react-router-dom";
import OverviewPage from "../pages/OverviewPage";
import StepRouter from "../components/router/StepRouter";
import FinalisePage from "../pages/FinalisePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      {/* route no longer needed – idle state handles */}
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/step/:id" element={<StepRouter />} />
      <Route path="/finalise" element={<FinalisePage />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
