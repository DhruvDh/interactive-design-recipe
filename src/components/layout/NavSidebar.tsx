import { StepNav } from "../navigation/StepNav";
import { FileTree } from "../navigation/FileTree";
import { recipeSteps, buildFileTree } from "../../constants/navigation";
import { useAnalysisContext } from "../../contexts/AnalysisContext";

export interface NavSidebarProps {
  onOpenFile: (fileId: string) => void;
}

export default function NavSidebar({ onOpenFile }: NavSidebarProps) {
  const { files } = useAnalysisContext();

  // Build file tree from current files
  const fileTree = buildFileTree(files);

  return (
    <aside className="bg-neutral-100 text-neutral-800 p-4 flex flex-col gap-6 overflow-y-auto">
      {/* 1. Design-Recipe Steps */}
      <StepNav steps={recipeSteps} />

      <hr className="border-neutral-300" />

      {/* 2. File Explorer */}
      <FileTree root={fileTree} onOpenFile={onOpenFile} />
    </aside>
  );
}
