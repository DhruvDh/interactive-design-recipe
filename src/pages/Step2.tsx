import { useState } from "react";
import { useAnalysisContext } from "../contexts/AnalysisContext";

export default function Step2() {
  const { analysis } = useAnalysisContext();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [signature, setSignature] = useState("");
  const [purpose, setPurpose] = useState("");

  const selectedClassInfo = analysis?.classes.find(
    (cls) => cls.name === selectedClass
  );

  const selectedMethodInfo = selectedClassInfo?.methods.find(
    (method) => method.name === selectedMethod
  );

  if (!analysis) {
    return (
      <div className="p-8">
        <div className="text-center text-neutral-500">
          <p>No analysis available</p>
          <p className="text-sm mt-2">
            Please select a Java project to analyze
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Step 2 — Signature & Purpose
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="prose prose-neutral max-w-none mb-6">
            <p className="text-neutral-700 mb-4">
              <strong>Purpose:</strong> Define the function signature and write
              a clear purpose statement describing what the function does.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>What to include:</strong>
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>Function name and parameters with their types</li>
                <li>Return type</li>
                <li>Clear, concise description of what the function does</li>
                <li>Any preconditions or constraints</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="class-select"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Select a class:
              </label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedMethod("");
                }}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
              >
                <option value="">Choose a class...</option>
                {analysis.classes.map((cls) => (
                  <option key={`${cls.name}-${cls.path}`} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedClassInfo && (
              <div>
                <label
                  htmlFor="method-select"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
                  Select a method:
                </label>
                <select
                  id="method-select"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="">Choose a method...</option>
                  {selectedClassInfo.methods.map((method, index) => (
                    <option key={index} value={method.name}>
                      {method.name}() → {method.returnType}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedMethodInfo && (
            <div className="border-l-4 border-neutral-400 pl-4 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {selectedMethodInfo.name}
              </h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <div>
                  <strong>Return Type:</strong> {selectedMethodInfo.returnType}
                </div>
                <div>
                  <strong>Parameters:</strong>{" "}
                  {selectedMethodInfo.parameters.length === 0
                    ? "None"
                    : selectedMethodInfo.parameters
                        .map((p) => `${p.type} ${p.name}`)
                        .join(", ")}
                </div>
                {selectedMethodInfo.modifiers.length > 0 && (
                  <div>
                    <strong>Modifiers:</strong>{" "}
                    {selectedMethodInfo.modifiers.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="signature"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Function Signature
              </label>
              <textarea
                id="signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm font-mono"
                placeholder="public int methodName(String parameter1, int parameter2) {"
              />
            </div>

            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Purpose Statement
              </label>
              <textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm"
                placeholder="// Purpose: This method takes... and returns...
// Preconditions: ...
// Effects: ..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              Signature: {signature.length} characters | Purpose:{" "}
              {purpose.length} characters
            </div>
            <button
              onClick={() => {
                setSignature("");
                setPurpose("");
              }}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Good Purpose Statement Guidelines
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-neutral-700">
                Clearly states what the function does, not how it does it
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-neutral-700">
                Mentions the parameters and their role in the computation
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-neutral-700">
                Describes the return value and its relationship to the inputs
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-neutral-700">
                Includes any important preconditions or constraints
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
