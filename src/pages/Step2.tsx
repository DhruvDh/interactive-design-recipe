import { useState } from "react";
import { useDoc, useYMap } from "../hooks/useYjs";
import { useUndo } from "../hooks/useUndoManager";
import { useAnalysisContext } from "../contexts/AnalysisContext";
import type { MethodInfo, ClassInfo } from "../treesitter/types";

export default function Step2() {
  const { analysis } = useAnalysisContext();
  const doc = useDoc("step2");
  const undoManager = useUndo(doc ? [doc.getMap("signatures")] : null);

  const [methodData, setMethodData] = useYMap<string>(doc, "methodData");
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  // Get all methods from all classes
  const allMethods: Array<{
    key: string;
    className: string;
    method: MethodInfo;
    classInfo: ClassInfo;
  }> = [];

  if (analysis) {
    analysis.classes.forEach((classInfo) => {
      classInfo.methods.forEach((method) => {
        const key = `${classInfo.name}.${method.name}`;
        allMethods.push({ key, className: classInfo.name, method, classInfo });
      });
    });
  }

  const selectedMethodInfo = allMethods.find((m) => m.key === selectedMethod);

  const handleMethodDataChange = (field: string, value: string) => {
    if (selectedMethod) {
      const key = `${selectedMethod}.${field}`;
      setMethodData(key, value);
    }
  };

  const getMethodData = (field: string): string => {
    if (selectedMethod) {
      const key = `${selectedMethod}.${field}`;
      return methodData.get(key) || "";
    }
    return "";
  };

  const formatMethodSignature = (
    method: MethodInfo,
    className: string
  ): string => {
    const modifiers = method.modifiers.join(" ");
    const params = method.parameters
      .map((p) => `${p.type} ${p.name}`)
      .join(", ");
    return `${modifiers} ${method.returnType} ${className}.${method.name}(${params})`.trim();
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Step 2 — Signature & Purpose
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
              <strong>Purpose:</strong> Provide a contract describing the
              method's signature and intent, including how it handles errors and
              what it guarantees.
            </p>

            <p className="text-neutral-700 mb-4">
              Select a method to analyze, then write a succinct purpose
              statement that clarifies what the method does, its preconditions,
              and postconditions.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Good purpose statements include:</strong>
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>What the method does</li>
                <li>When it should be used</li>
                <li>Preconditions the caller must meet</li>
                <li>Postconditions or guaranteed outcomes</li>
                <li>Expected exceptions for invalid inputs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="mb-6">
            <label
              htmlFor="method-select"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Select a method to analyze:
            </label>
            <select
              id="method-select"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            >
              <option value="">Choose a method...</option>
              {allMethods.map((methodInfo) => (
                <option key={methodInfo.key} value={methodInfo.key}>
                  {methodInfo.className}.{methodInfo.method.name}() -{" "}
                  {methodInfo.method.returnType}
                </option>
              ))}
            </select>
          </div>

          {selectedMethodInfo && (
            <div className="space-y-6">
              <div className="border-l-4 border-neutral-400 pl-4 bg-neutral-50 p-4 rounded-r-lg">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Method Signature
                </h3>
                <pre className="text-sm text-neutral-800 font-mono bg-white p-3 rounded border overflow-x-auto">
                  {formatMethodSignature(
                    selectedMethodInfo.method,
                    selectedMethodInfo.className
                  )}
                </pre>
                {selectedMethodInfo.method.javadoc && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-neutral-700 mb-1">
                      Existing Javadoc:
                    </h4>
                    <pre className="text-xs text-neutral-600 bg-white p-2 rounded border whitespace-pre-wrap">
                      {selectedMethodInfo.method.javadoc}
                    </pre>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Purpose Statement
                  </label>
                  <textarea
                    value={getMethodData("purpose")}
                    onChange={(e) =>
                      handleMethodDataChange("purpose", e.target.value)
                    }
                    placeholder="Write a clear purpose statement describing what this method does..."
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Preconditions
                  </label>
                  <textarea
                    value={getMethodData("preconditions")}
                    onChange={(e) =>
                      handleMethodDataChange("preconditions", e.target.value)
                    }
                    placeholder="List what must be true before calling this method (e.g., parameters cannot be null, ranges, etc.)..."
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Postconditions
                  </label>
                  <textarea
                    value={getMethodData("postconditions")}
                    onChange={(e) =>
                      handleMethodDataChange("postconditions", e.target.value)
                    }
                    placeholder="Describe what will be true after the method completes successfully..."
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm"
                  />
                </div>
              </div>

              {selectedMethodInfo.method.parameters.length > 0 && (
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">
                    Parameters:
                  </h4>
                  <div className="space-y-1">
                    {selectedMethodInfo.method.parameters.map(
                      (param, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                            {param.type}
                          </span>
                          <span className="font-medium">{param.name}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!selectedMethodInfo && allMethods.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="text-center">
              <p className="text-neutral-500 mb-4">
                No methods found in the current project analysis.
              </p>
              <p className="text-sm text-neutral-400">
                Make sure you have selected a Java project with methods in your
                classes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
