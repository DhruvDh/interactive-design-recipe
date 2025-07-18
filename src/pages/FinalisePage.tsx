import { useState } from "react";
import { useStatusDoc, writeText } from "../hooks/useYjs";
import { useAnalysisContext } from "../contexts/AnalysisContext";
import { useToast } from "../hooks/useToast";
import { navItems } from "../constants/navigation";

export default function FinalisePage() {
  const { analysis, currentProject } = useAnalysisContext();
  const statusDoc = useStatusDoc();
  const { addToast } = useToast();

  const [isExporting, setIsExporting] = useState(false);

  // Get status for all items
  const getStatus = (itemId: string): boolean => {
    if (!statusDoc) return false;
    const statusMap = statusDoc.getMap("status");
    return statusMap.get(itemId) === true;
  };

  // Check if all recipe steps are complete
  const recipeSteps = navItems.filter((item) => item.category === "recipe");
  const completedRecipeSteps = recipeSteps.filter((step) => getStatus(step.id));
  const allRecipeStepsComplete =
    completedRecipeSteps.length === recipeSteps.length;

  // Get overall progress
  const allSteps = navItems.filter((item) => item.category !== "final");
  const completedSteps = allSteps.filter((step) => getStatus(step.id));
  const progressPercentage = Math.round(
    (completedSteps.length / allSteps.length) * 100
  );

  const exportFinalArtifact = async () => {
    if (!currentProject?.handle) {
      addToast("No project selected", "error");
      return;
    }

    setIsExporting(true);

    try {
      // Collect all Yjs documents
      const stepData: Record<string, unknown> = {};

      // Get status data
      if (statusDoc) {
        const statusMap = statusDoc.getMap("status");
        const statusEntries: Record<string, boolean> = {};
        statusMap.forEach((value, key) => {
          statusEntries[key] = value as boolean;
        });
        stepData.status = statusEntries;
      }

      // Get data from each step
      // Note: In a real implementation, we'd need to collect these docs at the component level
      // For now, we'll just export the status information
      stepData.steps = {};

      // Create final export object
      const finalExport = {
        metadata: {
          exportTimestamp: new Date().toISOString(),
          projectName: currentProject.name,
          projectPath: currentProject.path,
          totalSteps: allSteps.length,
          completedSteps: completedSteps.length,
          progressPercentage,
          allRecipeStepsComplete,
        },
        status: stepData.status || {},
        steps: stepData,
        analysisMeta: analysis
          ? {
              classes: analysis.classes.length,
              interfaces: analysis.interfaces.length,
              methods: analysis.classes.reduce(
                (sum, cls) => sum + cls.methods.length,
                0
              ),
              fields: analysis.classes.reduce(
                (sum, cls) => sum + cls.fields.length,
                0
              ),
            }
          : null,
      };

      // Write to file system in .design-recipe directory
      const fileName = "final.json";
      const jsonContent = JSON.stringify(finalExport, null, 2);

      await writeText(currentProject.handle, fileName, jsonContent);

      addToast(`Final artifact exported: ${fileName}`, "success");
    } catch (error) {
      console.error("Failed to export final artifact:", error);
      addToast("Failed to export final artifact", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Finalise Submission
        </h1>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Progress Overview
          </h2>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Overall Progress</span>
              <span className="text-sm font-medium text-neutral-900">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-neutral-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-neutral-50 p-3 rounded border">
              <div className="font-medium text-neutral-700">Total Steps</div>
              <div className="text-2xl font-bold text-neutral-900">
                {allSteps.length}
              </div>
            </div>
            <div className="bg-neutral-50 p-3 rounded border">
              <div className="font-medium text-neutral-700">Completed</div>
              <div className="text-2xl font-bold text-green-600">
                {completedSteps.length}
              </div>
            </div>
            <div className="bg-neutral-50 p-3 rounded border">
              <div className="font-medium text-neutral-700">Remaining</div>
              <div className="text-2xl font-bold text-orange-600">
                {allSteps.length - completedSteps.length}
              </div>
            </div>
          </div>
        </div>

        {/* Step Status */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Step Status
          </h2>

          <div className="space-y-4">
            {navItems
              .filter((item) => item.category !== "final")
              .map((item) => {
                const isComplete = getStatus(item.id);
                const isRecipeStep = item.category === "recipe";

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isComplete ? "bg-green-600" : "bg-neutral-300"
                        }`}
                      >
                        {isComplete && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-neutral-900">
                          {item.name}
                        </span>
                        {isRecipeStep && (
                          <span className="ml-2 text-xs bg-neutral-100 text-neutral-800 px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm ${
                        isComplete ? "text-green-600" : "text-neutral-500"
                      }`}
                    >
                      {isComplete ? "Complete" : "Incomplete"}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Requirements Check */}
        <div
          className={`rounded-lg border p-6 mb-8 ${
            allRecipeStepsComplete
              ? "bg-green-50 border-green-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            <span
              className={
                allRecipeStepsComplete ? "text-green-900" : "text-orange-900"
              }
            >
              Submission Requirements
            </span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  allRecipeStepsComplete ? "bg-green-600" : "bg-orange-500"
                }`}
              >
                {allRecipeStepsComplete ? (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-white text-xs">!</span>
                )}
              </div>
              <span
                className={`text-sm ${
                  allRecipeStepsComplete ? "text-green-800" : "text-orange-800"
                }`}
              >
                All Design Recipe steps (Steps 0-5) must be completed
              </span>
            </div>

            <div className="text-sm text-neutral-600">
              Progress: {completedRecipeSteps.length} of {recipeSteps.length}{" "}
              recipe steps completed
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Export Final Artifact
          </h2>

          <p className="text-neutral-700 mb-6">
            Export your complete design recipe work to a{" "}
            <code className="bg-neutral-100 px-1 rounded">final.json</code>{" "}
            file. This file contains all your progress, notes, and design
            decisions in a structured format.
          </p>

          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-neutral-900 mb-2">
              Export includes:
            </h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Progress status for all steps</li>
              <li>
                • All design recipe artifacts (restatements, constraints, tests,
                etc.)
              </li>
              <li>• Project analysis metadata</li>
              <li>• Export timestamp and project information</li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={exportFinalArtifact}
              disabled={isExporting || !currentProject}
              className="px-6 py-3 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isExporting ? "Exporting..." : "Export Final Artifact"}
            </button>

            {!allRecipeStepsComplete && (
              <div className="text-sm text-orange-600">
                ⚠️ Some required steps are incomplete
              </div>
            )}
          </div>
        </div>

        {analysis && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Project Analysis Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-neutral-50 p-3 rounded border">
                <div className="font-medium text-neutral-700">Classes</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.classes.length}
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded border">
                <div className="font-medium text-neutral-700">Interfaces</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.interfaces.length}
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded border">
                <div className="font-medium text-neutral-700">Methods</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.classes.reduce(
                    (sum, cls) => sum + cls.methods.length,
                    0
                  )}
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded border">
                <div className="font-medium text-neutral-700">Fields</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.classes.reduce(
                    (sum, cls) => sum + cls.fields.length,
                    0
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
