import { ProjectGate } from "./components/project/ProjectGate";
import DRLayout from "./components/layout/DRLayout";
import { ToastProvider } from "./contexts/ToastContext";
import { ToastContainer } from "./components/ui/ToastContainer";
import AppRoutes from "./router/AppRoutes";

export default function App() {
  return (
    <ToastProvider>
      <ProjectGate>
        <DRLayout>       {/* 3-pane shell */}
          <AppRoutes />  {/* centre routed content */}
        </DRLayout>
      </ProjectGate>
      <ToastContainer />
    </ToastProvider>
  );
}
