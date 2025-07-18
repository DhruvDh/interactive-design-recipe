import { useDoc, useYText } from "../hooks/useYjs";
import { useUndo } from "../hooks/useUndoManager";
import { useAnalysisContext } from "../contexts/AnalysisContext";

export default function Step5() {
  const { analysis } = useAnalysisContext();
  const doc = useDoc("step5");
  const undoManager = useUndo(doc ? [doc.getText("implementation")] : null);

  const [notes, setNotes] = useYText(doc, "notes");

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Step 5 — Implementation Notes
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => undoManager?.undo()}
              disabled={!undoManager}
              className="px-3 py-1 text-sm bg-neutral-200 hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              Undo
            </button>
            <button
              onClick={() => undoManager?.redo()}
              disabled={!undoManager}
              className="px-3 py-1 text-sm bg-neutral-200 hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              Redo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="prose prose-neutral max-w-none mb-6">
            <p className="text-neutral-700 mb-4">
              <strong>Purpose:</strong> Document insights, challenges, and
              decisions made during implementation. This sprint focuses on
              planning — actual coding happens in your IDE.
            </p>

            <p className="text-neutral-700 mb-4">
              Use this space to record implementation notes, considerations, and
              reminders for when you write the actual code in your Java
              development environment.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Good implementation notes include:</strong>
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>Algorithm choices and trade-offs</li>
                <li>Performance considerations</li>
                <li>Edge cases to handle carefully</li>
                <li>Helper methods that might be needed</li>
                <li>Testing strategies</li>
                <li>Refactoring opportunities</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="space-y-4">
            <label
              htmlFor="implementation-notes"
              className="block text-sm font-medium text-neutral-700"
            >
              Implementation Notes
            </label>
            <textarea
              id="implementation-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm"
              placeholder="Write your implementation notes here...

Example notes:
- Algorithm: Using binary search for O(log n) lookup
- Edge cases: Handle null inputs and empty arrays
- Performance: Consider caching results for repeated queries
- Testing: Need to verify behavior with negative numbers
- Refactoring: Extract validation logic into helper method
- Dependencies: Requires Apache Commons for string utilities"
            />
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              {notes.length} characters
            </div>
            <button
              onClick={() => setNotes("")}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Implementation Workflow
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-neutral-600 font-bold">1.</span>
              <span className="text-neutral-700">
                <strong>Review your design:</strong> Check Steps 0-4 to ensure
                your plan is solid
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neutral-600 font-bold">2.</span>
              <span className="text-neutral-700">
                <strong>Set up your IDE:</strong> Create the Java classes and
                methods identified in your analysis
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neutral-600 font-bold">3.</span>
              <span className="text-neutral-700">
                <strong>Implement incrementally:</strong> Start with the
                skeleton from Step 4 and fill in each section
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neutral-600 font-bold">4.</span>
              <span className="text-neutral-700">
                <strong>Test continuously:</strong> Run your JUnit tests from
                Step 3 after each major change
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neutral-600 font-bold">5.</span>
              <span className="text-neutral-700">
                <strong>Refine and iterate:</strong> Update your notes here as
                you discover new insights
              </span>
            </div>
          </div>
        </div>

        {analysis && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Project Context
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-neutral-50 p-3 rounded border">
                <div className="font-medium text-neutral-700">
                  Classes to implement
                </div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.classes.length}
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded border">
                <div className="font-medium text-neutral-700">
                  Methods to implement
                </div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.classes.reduce(
                    (sum, cls) => sum + cls.methods.length,
                    0
                  )}
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded border">
                <div className="font-medium text-neutral-700">
                  Interfaces to implement
                </div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.interfaces.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
