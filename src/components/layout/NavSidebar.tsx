import { StepNav } from "../navigation/StepNav";
import { FileTree } from "../navigation/FileTree";
import { recipeSteps, projectRoot } from "../../constants/navigation";

export interface NavSidebarProps {
  onOpenFile: (fileId: string) => void;
}

export default function NavSidebar({ onOpenFile }: NavSidebarProps) {
  return (
    <aside className="bg-neutral-100 text-neutral-800 p-4 flex flex-col gap-6 overflow-y-auto">
      {/* 1. Design-Recipe Steps */}
      <StepNav steps={recipeSteps} />

      <hr className="border-neutral-300" />

      {/* 2. File Explorer */}
      <FileTree root={projectRoot} onOpenFile={onOpenFile} />
    </aside>
  );
}
