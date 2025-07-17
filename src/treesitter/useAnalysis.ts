import { useState, useCallback } from "react";
import type {
  DRAnalysis,
  ParseRequest,
  ParseResponse,
  ErrorResponse,
  FileListMeta,
} from "./types";
import AnalysisWorker from "./analysis.worker?worker";

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<DRAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      setAnalysis(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const worker = new AnalysisWorker();

      // Set up worker message handler
      const workerPromise = new Promise<DRAnalysis>((resolve, reject) => {
        worker.onmessage = (e: MessageEvent<ParseResponse | ErrorResponse>) => {
          if (e.data.ok) {
            resolve(e.data.analysis);
          } else {
            reject(new Error(e.data.error));
          }
        };

        worker.onerror = (error) => {
          reject(new Error(`Worker error: ${error.message}`));
        };
      });

      // Convert files to FileListMeta
      const filesMeta: FileListMeta[] = await Promise.all(
        files.map(async (file) => ({
          path: file.webkitRelativePath || file.name,
          text: await file.text(),
          mtime: file.lastModified,
        }))
      );

      // Send files to worker
      const request: ParseRequest = { files: filesMeta };
      worker.postMessage(request);

      // Wait for worker to complete
      const result = await workerPromise;

      setAnalysis(result);
      setLoading(false);

      // Clean up worker
      worker.terminate();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setLoading(false);
      console.error("Analysis error:", err);
    }
  }, []);

  return {
    analysis,
    loading,
    error,
    refresh,
  };
}
