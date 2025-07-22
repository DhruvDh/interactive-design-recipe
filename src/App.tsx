import { ToastProvider } from "./contexts/ToastContext";
import DRLayout from "./components/layout/DRLayout";
import { ProjectGate } from "./components/project/ProjectGate";
import { ToastContainer } from "./components/ui/ToastContainer";
import { useAppMachine } from "./state/useAppMachine";
import { AppActorContext } from "./contexts/AppActorContext";

export default function App() {
  const machine = useAppMachine(); // {state,send,actor}


  return (
    <ToastProvider>
      <AppActorContext.Provider value={machine.actor}>
        <ProjectGate>
          {/* still supplies AnalysisContext */}
          <DRLayout machine={machine} />
        </ProjectGate>
      </AppActorContext.Provider>
      <ToastContainer />
    </ToastProvider>
  );
}
