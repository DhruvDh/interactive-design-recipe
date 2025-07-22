import NavSidebar from "./NavSidebar";
import ChatSidebar from "./ChatSidebar";
import CodeViewer from "../viewer/CodeViewer";
import { Card } from "../ui/Card";
import AppRoutes from "../../router/AppRoutes";
import { useRouteSync } from "../../hooks/useRouteSync";

interface Props {
  machine: ReturnType<typeof import("../../state/useAppMachine").useAppMachine>;
}

export default function DRLayout({ machine }: Props) {
  const { state, send } = machine;

  useRouteSync(state, send);
  // Debug logging
  console.log("DRLayout received machine:", machine);
  console.log("DRLayout state:", state);

  const openTabs = state.context.openTabs;
  const activeTab = openTabs[openTabs.length - 1] ?? null;

  /* -------- helper events -------- */
  const ui = {
    openFile: (id: string) => send({ type: "OPEN_FILE", id }),
    closeTab: (id: string) => {
      const next = openTabs.filter((t: string) => t !== id);
      send({ type: next.length ? "OPEN_FILE" : "CLOSE_ALL", id: next[0] });
    },
    backToRecipe: () => send({ type: "CLOSE_ALL" }),
  };

  const timelineDisabled =
    !state.matches("ready") &&
    !state.matches("viewingCode") &&
    !state.matches("finalising");

  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr_22rem] font-sans">
      {/* ---------- LEFT ------------- */}
      <NavSidebar
        onOpenFile={ui.openFile}
        timelineDisabled={timelineDisabled}
      />

      {/* ---------- CENTRE ----------- */}
      {state.matches("idle") && (
        <Card>
          <IdleScreen send={send} handleFolderPick={machine.handleFolderPick} />
        </Card>
      )}
      {state.matches("selecting") && (
        <Card>
          <FolderSpinner />
        </Card>
      )}
      {state.matches("analysing") && (
        <Card>
          <AnalysisSpinner />
        </Card>
      )}
      {state.matches("ready") && (
        <Card>
          <AppRoutes />
        </Card>
      )}
      {state.matches("viewingCode") && (
        <CodeViewer
          tabs={openTabs}
          active={activeTab}
          onActivate={(id) => send({ type: "OPEN_FILE", id })}
          onClose={ui.closeTab}
          onBack={ui.backToRecipe}
        />
      )}
      {state.matches("finalising") && (
        <Card>
          <AppRoutes />
        </Card>
      )}

      {/* ---------- RIGHT ------------ */}
      <ChatSidebar />
    </div>
  );
}

/* -------------------------------------- helpers */
interface IdleScreenProps {
  send: (event: { type: "PICK" }) => void;
  handleFolderPick: () => Promise<void>;
}

function IdleScreen({ send, handleFolderPick }: IdleScreenProps) {
  const handlePickFolder = () => {
    send({ type: "PICK" });
    handleFolderPick();
  };

  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold">Design‑Recipe Workbench</h1>
      <p className="text-brand-700">Select a Java project folder to start.</p>
      <button
        onClick={handlePickFolder}
        className="px-6 py-3 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition"
      >
        Select Folder
      </button>
    </div>
  );
}

const FolderSpinner = () => (
  <p className="py-10 text-center">Waiting for folder selection…</p>
);
const AnalysisSpinner = () => (
  <p className="py-10 text-center">Parsing project…</p>
);
