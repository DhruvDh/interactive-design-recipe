import { TimelineNav } from "../navigation/TimelineNav";
import { FileTree } from "../navigation/FileTree";
import { buildFileTree } from "../../constants/navigation";
import { useAnalysisContext } from "../../contexts/AnalysisContext";

export interface NavSidebarProps {
  readonly onOpenFile: (fileId: string) => void;
  readonly timelineDisabled?: boolean;
}

export default function NavSidebar({
  onOpenFile,
  timelineDisabled = false,
}: NavSidebarProps) {
  const { files } = useAnalysisContext();

  // Build file tree from current files
  const fileTree = buildFileTree(files);

  return (
    <aside
      data-testid="nav-sidebar"
      className="bg-neutral-100 text-neutral-800 p-4 flex flex-col gap-6 overflow-y-auto"
    >
      {/* 1. Design-Recipe Timeline */}
      <TimelineNav disabled={timelineDisabled} />

      <hr className="border-neutral-300" />

      {/* 2. File Explorer */}
      <FileTree root={fileTree} onOpenFile={onOpenFile} />
    </aside>
  );
}
