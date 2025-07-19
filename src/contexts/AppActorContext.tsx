import { createContext } from "react";
import type { useAppMachine } from "../state/useAppMachine";

/* Machine context so child components can use useActor */
export const AppActorContext = createContext<
  ReturnType<typeof useAppMachine>["actor"]
>(null!);
