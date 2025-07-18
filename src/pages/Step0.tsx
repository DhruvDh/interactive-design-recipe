import { useState } from "react";
import { useDoc, useYText, useYArray } from "../hooks/useYjs";
import { useUndo } from "../hooks/useUndoManager";
import { useAnalysisContext } from "../contexts/AnalysisContext";

export default function Step0() {
  const { analysis } = useAnalysisContext();
  const doc = useDoc("step0");
  const undoManager = useUndo(doc ? [doc.getText("problem")] : null);

  const [restatementText, setRestatementText] = useYText(doc, "restatement");
  const [edgeCases, setEdgeCases] = useYArray<string>(doc, "edgeCases");

  const [newEdgeCase, setNewEdgeCase] = useState("");

  const handleAddEdgeCase = () => {
    if (newEdgeCase.trim()) {
      const updatedEdgeCases = [...edgeCases, newEdgeCase.trim()];
      setEdgeCases(updatedEdgeCases);
      setNewEdgeCase("");
    }
  };

  const handleRemoveEdgeCase = (index: number) => {
    const updatedEdgeCases = edgeCases.filter((_, i) => i !== index);
    setEdgeCases(updatedEdgeCases);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEdgeCase();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Step 0 — Restate the Problem
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
              <strong>Purpose:</strong> Clearly understand and restate the
              problem in your own words.
            </p>

            <p className="text-neutral-700 mb-4">
              Before writing any code, it's essential to understand exactly what
              you're trying to solve. Read the problem statement carefully and
              write it in your own words below.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Tip:</strong> A good problem restatement includes:
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>What inputs does the function/method need?</li>
                <li>What output should it produce?</li>
                <li>Any constraints or special cases to consider?</li>
                <li>Examples of expected behavior</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="problem-statement"
              className="block text-sm font-medium text-neutral-700"
            >
              Problem Restatement
            </label>
            <textarea
              id="problem-statement"
              value={restatementText}
              onChange={(e) => setRestatementText(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm font-mono"
              placeholder="Write your understanding of the problem here...

Example format:
- Problem: Design a function that...
- Input: The function takes...
- Output: It should return...
- Constraints: ...
- Examples: 
  - Input: ... → Output: ...
  - Input: ... → Output: ..."
            />
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              {restatementText.length} characters
            </div>
            <button
              onClick={() => setRestatementText("")}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Edge Cases Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Edge Cases & Special Conditions
          </h2>
          <p className="text-neutral-700 mb-4">
            List potential edge cases, special conditions, or assumptions that
            need to be handled:
          </p>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newEdgeCase}
                onChange={(e) => setNewEdgeCase(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter an edge case or special condition..."
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm"
              />
              <button
                onClick={handleAddEdgeCase}
                className="px-4 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 transition text-sm"
              >
                Add
              </button>
            </div>

            {edgeCases.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-700">
                  Listed Edge Cases:
                </h3>
                <div className="space-y-1">
                  {edgeCases.map((edgeCase, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-neutral-50 p-2 rounded"
                    >
                      <span className="flex-1 text-sm text-neutral-800">
                        {edgeCase}
                      </span>
                      <button
                        onClick={() => handleRemoveEdgeCase(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Context */}
        {analysis && (
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Project Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-neutral-700">Classes</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.classes.length}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-neutral-700">Interfaces</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.interfaces.length}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-neutral-700">Methods</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {analysis.classes.reduce(
                    (sum, cls) => sum + cls.methods.length,
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
