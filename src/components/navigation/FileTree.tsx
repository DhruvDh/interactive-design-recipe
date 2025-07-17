import { useState } from "react";
import type { FileNode } from "../../constants/navigation";

export interface FileTreeProps {
  root: FileNode;
  onOpenFile: (fileId: string) => void;
}

interface FileNodeItemProps {
  node: FileNode;
  onOpenFile: (fileId: string) => void;
  level: number;
  expandedDirs: Set<string>;
  toggleExpanded: (nodeId: string) => void;
}

function FileNodeItem({
  node,
  onOpenFile,
  level,
  expandedDirs,
  toggleExpanded,
}: FileNodeItemProps) {
  const isExpanded = expandedDirs.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const indentClass = level > 0 ? `ml-${level * 4}` : "";

  const handleClick = () => {
    if (node.type === "dir") {
      toggleExpanded(node.id);
    } else {
      onOpenFile(node.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded hover:bg-neutral-200 ${indentClass}`}
      >
        {node.type === "dir" && (
          <span className="text-neutral-500 flex-shrink-0">
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        {node.type === "file" && (
          <span className="text-neutral-500 flex-shrink-0">📄</span>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {node.type === "dir" && hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FileNodeItem
              key={child.id}
              node={child}
              onOpenFile={onOpenFile}
              level={level + 1}
              expandedDirs={expandedDirs}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ root, onOpenFile }: FileTreeProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
    new Set([root.id])
  );

  const toggleExpanded = (nodeId: string) => {
    setExpandedDirs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  return (
    <div>
      <h2 className="text-sm font-medium text-neutral-600 mb-3">Files</h2>
      <div className="space-y-1">
        <FileNodeItem
          node={root}
          onOpenFile={onOpenFile}
          level={0}
          expandedDirs={expandedDirs}
          toggleExpanded={toggleExpanded}
        />
      </div>
    </div>
  );
}
