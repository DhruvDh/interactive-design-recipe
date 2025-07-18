import { useState } from "react";
import { useDoc, useYArray } from "../hooks/useYjs";
import { useUndo } from "../hooks/useUndoManager";
import { useAnalysisContext } from "../contexts/AnalysisContext";
import type { MethodInfo, ClassInfo } from "../treesitter/types";

export default function Step4() {
  const { analysis } = useAnalysisContext();
  const doc = useDoc("step4");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [newItem, setNewItem] = useState("");

  const undoManager = useUndo(
    doc && selectedMethod ? [doc.getArray(`skeleton.${selectedMethod}`)] : null
  );

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

  // Use per-method skeleton array - don't clear on method change
  const [skeletonItems, setSkeletonItems] = useYArray<string>(
    doc,
    selectedMethod ? `skeleton.${selectedMethod}` : "skeleton"
  );

  const handleMethodChange = (methodKey: string) => {
    setSelectedMethod(methodKey);
    // Don't clear the array - let useYArray handle the method switching
  };

  const addSkeletonItem = () => {
    if (newItem.trim()) {
      const updatedItems = [...skeletonItems, newItem.trim()];
      setSkeletonItems(updatedItems);
      setNewItem("");
    }
  };

  const removeSkeletonItem = (index: number) => {
    const updatedItems = skeletonItems.filter((_, i) => i !== index);
    setSkeletonItems(updatedItems);
  };

  const updateSkeletonItem = (index: number, value: string) => {
    const updatedItems = [...skeletonItems];
    updatedItems[index] = value;
    setSkeletonItems(updatedItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkeletonItem();
    }
  };

  const templateTypes = [
    {
      name: "Simple Function",
      description: "Basic input → processing → output",
      template: [
        "1. Validate input parameters",
        "2. Initialize result variable",
        "3. Process the input",
        "4. Return the result",
      ],
    },
    {
      name: "List Processing",
      description: "Iterate through a collection",
      template: [
        "1. Check if list is null or empty",
        "2. Initialize accumulator/result",
        "3. Loop through each item",
        "4. Process each item",
        "5. Return final result",
      ],
    },
    {
      name: "Search/Find",
      description: "Find an item in a collection",
      template: [
        "1. Validate search criteria",
        "2. Iterate through collection",
        "3. Check if current item matches",
        "4. Return item if found",
        "5. Return null/default if not found",
      ],
    },
    {
      name: "Conditional Logic",
      description: "Multiple paths based on conditions",
      template: [
        "1. Evaluate primary condition",
        "2. Handle true case",
        "3. Handle false case",
        "4. Return appropriate result",
      ],
    },
  ];

  const applyTemplate = (template: string[]) => {
    setSkeletonItems([...skeletonItems, ...template]);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Step 4 — Skeleton
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
              <strong>Purpose:</strong> Outline the logical flow of the solution
              before writing complete code. This prevents mixing everything in
              one big, messy implementation.
            </p>

            <p className="text-neutral-700 mb-4">
              Write a high-level pseudocode or comment structure that references
              how you'll handle each test scenario.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Good skeleton steps:</strong>
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>Input validation and error handling</li>
                <li>Data structure initialization</li>
                <li>Main processing logic</li>
                <li>Result computation and return</li>
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
              Select a method to create skeleton for:
            </label>
            <select
              id="method-select"
              value={selectedMethod}
              onChange={(e) => handleMethodChange(e.target.value)}
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
            <div className="border-l-4 border-purple-400 pl-4 bg-purple-50 p-4 rounded-r-lg">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Skeleton for: {selectedMethodInfo.className}.
                {selectedMethodInfo.method.name}()
              </h3>
              <div className="text-sm text-neutral-600">
                <div>
                  <strong>Returns:</strong>{" "}
                  {selectedMethodInfo.method.returnType}
                </div>
                {selectedMethodInfo.method.parameters.length > 0 && (
                  <div>
                    <strong>Parameters:</strong>{" "}
                    {selectedMethodInfo.method.parameters
                      .map((p) => `${p.type} ${p.name}`)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedMethodInfo && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                Method Skeleton Steps
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a skeleton step..."
                  className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                />
                <button
                  onClick={addSkeletonItem}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm"
                >
                  Add Step
                </button>
              </div>
            </div>

            {skeletonItems.length > 0 ? (
              <div className="space-y-3">
                {skeletonItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-neutral-500 w-8">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateSkeletonItem(index, e.target.value)
                      }
                      className="flex-1 px-2 py-1 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-500"
                    />
                    <button
                      onClick={() => removeSkeletonItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <p className="mb-4">No skeleton steps yet.</p>
                <p className="text-sm">
                  Add steps to outline your method's logical flow.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Template Types
          </h2>
          <p className="text-neutral-700 mb-6">
            Use these common patterns as starting points for your skeleton:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templateTypes.map((template, index) => (
              <div
                key={index}
                className="border border-neutral-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-neutral-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  {template.description}
                </p>
                <div className="space-y-1 mb-3">
                  {template.template.map((step, stepIndex) => (
                    <div key={stepIndex} className="text-xs text-neutral-500">
                      {step}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => applyTemplate(template.template)}
                  disabled={!selectedMethod}
                  className="w-full px-3 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                >
                  Apply Template
                </button>
              </div>
            ))}
          </div>
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
