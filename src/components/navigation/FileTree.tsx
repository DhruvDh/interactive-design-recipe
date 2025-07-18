import { useState, useRef, useEffect } from "react";
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
  focusedNodeId?: string;
  setFocusedNodeId: (nodeId: string | undefined) => void;
  handleVerticalNavigation: (direction: "up" | "down") => void;
}

function FileNodeItem({
  node,
  onOpenFile,
  level,
  expandedDirs,
  toggleExpanded,
  focusedNodeId,
  setFocusedNodeId,
  handleVerticalNavigation,
}: FileNodeItemProps) {
  const isExpanded = expandedDirs.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isFocused = focusedNodeId === node.id;
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused && nodeRef.current) {
      nodeRef.current.focus();
    }
  }, [isFocused]);

  const handleClick = () => {
    setFocusedNodeId(node.id);
    if (node.type === "dir") {
      toggleExpanded(node.id);
    } else {
      onOpenFile(node.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleClick();
        break;
      case "ArrowRight":
        e.preventDefault();
        if (node.type === "dir" && !isExpanded) {
          toggleExpanded(node.id);
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (node.type === "dir" && isExpanded) {
          toggleExpanded(node.id);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        handleVerticalNavigation("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        handleVerticalNavigation("down");
        break;
    }
  };

  return (
    <div>
      <div
        ref={nodeRef}
        role="treeitem"
        aria-level={level + 1}
        aria-expanded={node.type === "dir" ? isExpanded : undefined}
        tabIndex={isFocused ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded hover:bg-neutral-200"
        style={{ marginLeft: level * 1 + "rem" }}
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
              focusedNodeId={focusedNodeId}
              setFocusedNodeId={setFocusedNodeId}
              handleVerticalNavigation={handleVerticalNavigation}
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
  const [focusedNodeId, setFocusedNodeId] = useState<string | undefined>(
    undefined
  );

  // Flatten the tree to get all visible nodes for arrow navigation
  const getVisibleNodes = (
    node: FileNode,
    expanded: Set<string>,
    result: FileNode[] = []
  ): FileNode[] => {
    result.push(node);
    if (node.type === "dir" && node.children && expanded.has(node.id)) {
      node.children.forEach((child) =>
        getVisibleNodes(child, expanded, result)
      );
    }
    return result;
  };

  const handleVerticalNavigation = (direction: "up" | "down") => {
    if (!focusedNodeId) {
      // If no node is focused, focus the first visible node
      const visibleNodes = getVisibleNodes(root, expandedDirs);
      if (visibleNodes.length > 0) {
        setFocusedNodeId(visibleNodes[0].id);
      }
      return;
    }

    const visibleNodes = getVisibleNodes(root, expandedDirs);
    const currentIndex = visibleNodes.findIndex(
      (node) => node.id === focusedNodeId
    );

    if (currentIndex === -1) return;

    if (direction === "up" && currentIndex > 0) {
      setFocusedNodeId(visibleNodes[currentIndex - 1].id);
    } else if (direction === "down" && currentIndex < visibleNodes.length - 1) {
      setFocusedNodeId(visibleNodes[currentIndex + 1].id);
    }
  };

  const toggleExpanded = (nodeId: string) => {
    setExpandedDirs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        // Collapsing directory - check if focused node becomes hidden
        if (focusedNodeId && focusedNodeId.startsWith(nodeId + "/")) {
          // Focus is on a child that will be hidden, move to parent
          setFocusedNodeId(nodeId);
        }
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
      <div role="tree" className="space-y-1">
        <FileNodeItem
          node={root}
          onOpenFile={onOpenFile}
          level={0}
          expandedDirs={expandedDirs}
          toggleExpanded={toggleExpanded}
          focusedNodeId={focusedNodeId}
          setFocusedNodeId={setFocusedNodeId}
          handleVerticalNavigation={handleVerticalNavigation}
        />
      </div>
    </div>
  );
}
