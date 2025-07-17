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

/**
 * Hard-coded project file tree for PoC
 */
export const projectRoot: FileNode = {
  id: "project",
  name: "design-recipe",
  type: "dir",
  children: [
    {
      id: "project/src",
      name: "src",
      type: "dir",
      children: [
        {
          id: "project/src/App.tsx",
          name: "App.tsx",
          type: "file",
        },
        {
          id: "project/src/main.tsx",
          name: "main.tsx",
          type: "file",
        },
        {
          id: "project/src/index.css",
          name: "index.css",
          type: "file",
        },
        {
          id: "project/src/components",
          name: "components",
          type: "dir",
          children: [
            {
              id: "project/src/components/layout",
              name: "layout",
              type: "dir",
              children: [
                {
                  id: "project/src/components/layout/NavSidebar.tsx",
                  name: "NavSidebar.tsx",
                  type: "file",
                },
                {
                  id: "project/src/components/layout/ChatSidebar.tsx",
                  name: "ChatSidebar.tsx",
                  type: "file",
                },
              ],
            },
          ],
        },
        {
          id: "project/src/pages",
          name: "pages",
          type: "dir",
          children: [
            {
              id: "project/src/pages/Home.tsx",
              name: "Home.tsx",
              type: "file",
            },
            {
              id: "project/src/pages/About.tsx",
              name: "About.tsx",
              type: "file",
            },
          ],
        },
      ],
    },
    {
      id: "project/package.json",
      name: "package.json",
      type: "file",
    },
    {
      id: "project/tsconfig.json",
      name: "tsconfig.json",
      type: "file",
    },
    {
      id: "project/README.md",
      name: "README.md",
      type: "file",
    },
  ],
};
