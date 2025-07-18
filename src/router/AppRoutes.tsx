import { Routes, Route, Navigate } from "react-router-dom";
import SelectProjectPage from "../pages/SelectProjectPage";
import OverviewPage from "../pages/OverviewPage";
import StepRouter from "../components/router/StepRouter";
import FinalisePage from "../pages/FinalisePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/project" replace />} />
      <Route path="/project" element={<SelectProjectPage />} />
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/step/:id" element={<StepRouter />} />
      <Route path="/finalise" element={<FinalisePage />} />
      <Route path="*" element={<Navigate to="/project" replace />} />
    </Routes>
  );
}
