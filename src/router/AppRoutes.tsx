import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import OverviewPage from "../pages/OverviewPage";
import StepRouter from "../components/router/StepRouter";
import FinalisePage from "../pages/FinalisePage";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      {/* route no longer needed – idle state handles */}
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/step/:id" element={<StepRouter />} />
      <Route path="/finalise" element={<FinalisePage />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
