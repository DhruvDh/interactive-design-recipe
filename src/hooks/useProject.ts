import { useAnalysisContext } from "../contexts/AnalysisContext";

export function useProject() {
  const { currentProject } = useAnalysisContext();

  return {
    dirHandle: currentProject?.handle || null,
    dirKey: currentProject?.id || null,
  };
}
