import { createContext, useContext } from "react";
import type { DRAnalysis } from "../treesitter/types";
import type { RecentEntry } from "../types/storage";

export interface AnalysisContextType {
  analysis: DRAnalysis | null;
  loading: boolean;
  error: string | null;
  refresh: (files: File[]) => Promise<void>;
  currentProject: RecentEntry | null;
}

export const AnalysisContext = createContext<AnalysisContextType | null>(null);

export const useAnalysisContext = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysisContext must be used within a ProjectGate");
  }
  return context;
};
