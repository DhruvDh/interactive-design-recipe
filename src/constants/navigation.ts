/**
 * One item in the Design‑Recipe navigation list.
 *
 * @property id   Stable key, e.g. "step0"
 * @property name Human‑readable label, e.g. "Step 0 — Restate the Problem"
 * @property route React‑Router path segment: "/step/0"
 */
export interface RecipeStepNavItem {
  id: string;
  name: string;
  route: string;
}

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
    // Use webkitRelativePath if available, otherwise fall back to file.name
    let filePath = file.webkitRelativePath || file.name;

    // If filePath doesn't contain a slash, it's likely a single file
    // In this case, we should place it in the root directory
    if (!filePath.includes("/")) {
      filePath = file.name;
    }

    const parts = filePath.split("/").filter((part) => part.trim() !== "");
    let cursor = root;

    parts.forEach((part, idx) => {
      const isFile = idx === parts.length - 1;
      const id = parts.slice(0, idx + 1).join("/");
      let next = cursor.children!.find((c) => c.name === part);

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

/**
 * Hard-coded Design Recipe steps for PoC
 */
export const recipeSteps: RecipeStepNavItem[] = [
  {
    id: "step0",
    name: "Step 0 — Restate the Problem",
    route: "/step/0",
  },
  {
    id: "step1",
    name: "Step 1 — Data Definition",
    route: "/step/1",
  },
  {
    id: "step2",
    name: "Step 2 — Signature & Purpose",
    route: "/step/2",
  },
  {
    id: "step3",
    name: "Step 3 — Examples & Tests",
    route: "/step/3",
  },
  {
    id: "step4",
    name: "Step 4 — Template",
    route: "/step/4",
  },
  {
    id: "step5",
    name: "Step 5 — Implementation",
    route: "/step/5",
  },
];
