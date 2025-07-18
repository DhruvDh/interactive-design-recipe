import { Card } from "../components/ui/Card";
import { useAnalysisContext } from "../contexts/AnalysisContext";

export default function SelectProjectPage() {
  const { handleFolderSelect } = useAnalysisContext();

  const handleSelectFolder = async () => {
    try {
      if ("showDirectoryPicker" in window && window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        await handleFolderSelect(dirHandle);
      } else {
        alert(
          "Directory selection is only supported in Chromium-based browsers"
        );
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error selecting folder:", err);
      }
    }
  };

  return (
    <Card>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          Design Recipe Workbench
        </h1>
        <p className="text-neutral-600 mb-8">
          Select a Java project folder to get started with the Design Recipe
          process.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleSelectFolder}
            className="px-6 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Select Project Folder
          </button>

          <p className="text-sm text-neutral-500">
            Choose a folder containing Java source files to begin the Design
            Recipe process
          </p>
        </div>
      </div>
    </Card>
  );
}
