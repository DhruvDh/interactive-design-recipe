import { createMachine, assign } from "xstate";
import type { DRAnalysis } from "../treesitter/types";

/** Public events */
export type AppEvent =
  | { type: "PICK" }
  | {
      type: "SELECTED";
      dir: FileSystemDirectoryHandle;
      files: File[];
      dirKey: string;
    }
  | { type: "CANCEL" }
  | { type: "PARSE_OK"; analysis: DRAnalysis }
  | { type: "PARSE_FAIL"; message: string }
  | { type: "OPEN_FILE"; id: string }
  | { type: "CLOSE_ALL" }
  | { type: "FINALISE" }
  | { type: "RESET" }
  | { type: "BACK_TO_RECIPE" };

export interface AppContext {
  dir?: FileSystemDirectoryHandle;
  dirKey?: string;
  files: File[];
  analysis?: DRAnalysis;
  openTabs: string[];
}

export const appMachine = createMachine({
  id: "dr-app",
  context: { files: [], openTabs: [] } as AppContext,
  initial: "idle",

  types: {} as {
    context: AppContext;
    events: AppEvent;
  },

  states: {
    idle: {
      on: { PICK: "selecting" },
    },

    selecting: {
      on: {
        SELECTED: {
          target: "analysing",
          actions: assign({
            dir: ({ event }) => event.dir,
            files: ({ event }) => event.files,
            dirKey: ({ event }) => event.dirKey,
          }),
        },
        CANCEL: "idle",
      },
    },

    analysing: {
      on: {
        PARSE_OK: {
          target: "ready",
          actions: assign({
            analysis: ({ event }) => event.analysis,
          }),
        },
        PARSE_FAIL: { target: "idle" },
      },
    },

    ready: {
      on: {
        OPEN_FILE: {
          target: "viewingCode",
          actions: assign({
            openTabs: ({ context, event }) => [
              ...new Set([...context.openTabs, event.id]),
            ],
          }),
        },
        FINALISE: "finalising",
        RESET: "idle",
      },
    },

    viewingCode: {
      on: {
        CLOSE_ALL: { target: "ready", actions: assign({ openTabs: [] }) },
        OPEN_FILE: {
          actions: assign({
            openTabs: ({ context, event }) => [
              ...new Set([...context.openTabs, event.id]),
            ],
          }),
        },
        RESET: "idle",
      },
    },

    finalising: {
      on: {
        RESET: "idle",
        OPEN_FILE: "viewingCode",
        BACK_TO_RECIPE: "ready",
      },
    },
  },
});
