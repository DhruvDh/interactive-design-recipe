import { useState, useCallback, useRef } from "react";
import type {
  DRAnalysis,
  ParseRequest,
  ParseResponse,
  ErrorResponse,
  FileListMeta,
} from "./types";
import AnalysisWorker from "./analysis.worker?worker";
import { useToast } from "../hooks/useToast";

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<DRAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const currentWorkerRef = useRef<Worker | null>(null);
  const { addToast } = useToast();

  const refresh = useCallback(
    async (files: File[]) => {
      setFiles(files);

      // Terminate previous worker if it exists
      if (currentWorkerRef.current) {
        currentWorkerRef.current.terminate();
        currentWorkerRef.current = null;
      }

      if (files.length === 0) {
        setAnalysis(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      // Show parsing toast
      addToast(`Parsing ${files.length} files`, "info", 3000);

      try {
        const worker = new AnalysisWorker();
        currentWorkerRef.current = worker;

        // Set up worker message handler
        const workerPromise = new Promise<DRAnalysis>((resolve, reject) => {
          worker.onmessage = (
            e: MessageEvent<ParseResponse | ErrorResponse>
          ) => {
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

        // Show success toast
        addToast(
          `Parsing complete! Found ${result.classes.length} classes`,
          "success"
        );

        // Clean up worker
        worker.terminate();
        currentWorkerRef.current = null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        setLoading(false);
        console.error("Analysis error:", err);

        // Show error toast
        addToast(`Parsing failed: ${errorMessage}`, "error");

        // Clean up worker on error
        if (currentWorkerRef.current) {
          currentWorkerRef.current.terminate();
          currentWorkerRef.current = null;
        }
      }
    },
    [addToast]
  );

  return {
    analysis,
    loading,
    error,
    refresh,
    files,
  };
}
