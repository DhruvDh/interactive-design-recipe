import { useNavigate } from "react-router-dom";
import { useAnalysisContext } from "../contexts/AnalysisContext";

export default function OverviewPage() {
  const navigate = useNavigate();
  const { currentProject, analysis, loading, error } = useAnalysisContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-300 border-t-neutral-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Analyzing your Java project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-red-600 mb-4">
              Analysis Error
            </h1>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartDesignRecipe = () => {
    navigate("/step/0");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Project Overview
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Name:</span>
                  <span className="font-medium">
                    {currentProject?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Classes:</span>
                  <span className="font-medium">
                    {analysis?.classes.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Interfaces:</span>
                  <span className="font-medium">
                    {analysis?.interfaces.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Imports:</span>
                  <span className="font-medium">
                    {analysis?.imports.length || 0}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">What You'll Do</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-neutral-700 font-bold">0.</span>
                  <span>Restate the Problem</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-700 font-bold">1.</span>
                  <span>Data Definition</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-700 font-bold">2.</span>
                  <span>Signature & Purpose</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-700 font-bold">3.</span>
                  <span>Examples & Tests</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-700 font-bold">4.</span>
                  <span>Template</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-700 font-bold">5.</span>
                  <span>Implementation</span>
                </div>
              </div>
            </div>
          </div>

          {analysis && analysis.classes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Discovered Classes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.classes.slice(0, 6).map((cls, index) => (
                  <div
                    key={index}
                    className="border border-neutral-200 rounded-lg p-4"
                  >
                    <h3 className="font-medium text-lg mb-2">{cls.name}</h3>
                    <div className="text-sm text-neutral-600 space-y-1">
                      <div>{cls.fields.length} fields</div>
                      <div>{cls.methods.length} methods</div>
                      <div>{cls.constructors.length} constructors</div>
                    </div>
                  </div>
                ))}
              </div>
              {analysis.classes.length > 6 && (
                <p className="text-sm text-neutral-500 mt-4">
                  ...and {analysis.classes.length - 6} more classes
                </p>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              Ready to apply systematic program design to your Java project?
            </p>
            <button
              onClick={handleStartDesignRecipe}
              className="bg-neutral-600 text-white px-8 py-3 rounded-lg hover:bg-neutral-700 transition font-medium"
            >
              Start Step 0 — Restate the Problem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
