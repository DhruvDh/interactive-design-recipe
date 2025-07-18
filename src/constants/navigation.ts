import { canonical } from "../utils/paths";

/**
 * Navigation item for the timeline-based Design Recipe flow.
 */
export interface NavItem {
  id: string; // stable key
  name: string; // sidebar label
  route: string; // react‑router path
  category: "project" | "recipe" | "final";
}

/** Timeline in desired visual order */
export const navItems: NavItem[] = [
  {
    id: "select",
    name: "Select Project",
    route: "/select",
    category: "project",
  },
  {
    id: "overview",
    name: "Project Overview",
    route: "/overview",
    category: "project",
  },

  {
    id: "step0",
    name: "Step 0 — Restate",
    route: "/step/0",
    category: "recipe",
  },
  {
    id: "step1",
    name: "Step 1 — Data Definitions",
    route: "/step/1",
    category: "recipe",
  },
  {
    id: "step2",
    name: "Step 2 — Signature & Purpose",
    route: "/step/2",
    category: "recipe",
  },
  {
    id: "step3",
    name: "Step 3 — Examples & Tests",
    route: "/step/3",
    category: "recipe",
  },
  {
    id: "step4",
    name: "Step 4 — Skeleton",
    route: "/step/4",
    category: "recipe",
  },
  {
    id: "step5",
    name: "Step 5 — Implementation Notes",
    route: "/step/5",
    category: "recipe",
  },

  {
    id: "final",
    name: "Finalise Submission",
    route: "/finalise",
    category: "final",
  },
] as const;

/**
 * File tree node for project explorer.
 */
export interface FileNode {
  id: string; // full path, unique
  name: string; // basename
  type: "file" | "dir";
  children?: FileNode[]; // only for type === "dir"
}

/**
 * Build file tree from File[] array
 */
export function buildFileTree(files: File[]): FileNode {
  const root: FileNode = {
    id: "/",
    name: "Project",
    type: "dir",
    children: [],
  };

  for (const file of files) {
    // Use canonical path from utility
    const filePath = canonical(file);

    const parts = filePath
      .split("/")
      .filter((part: string) => part.trim() !== "");
    let cursor = root;

    parts.forEach((part: string, idx: number) => {
      const isFile = idx === parts.length - 1;
      const id = parts.slice(0, idx + 1).join("/");
      let next = cursor.children!.find((c: FileNode) => c.name === part);

      if (!next) {
        next = {
          id,
          name: part,
          type: isFile ? "file" : "dir",
          children: isFile ? undefined : [],
        };
        cursor.children!.push(next);
      }

      cursor = next;
    });
  }

  return root;
}

// Keep the old interface for backwards compatibility during transition
export type RecipeStepNavItem = NavItem;

// Export the old recipeSteps array for backwards compatibility
export const recipeSteps = navItems.filter(
  (item) => item.category === "recipe"
);
