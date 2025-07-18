import { useState } from "react";
import { useDoc, useYMap } from "../hooks/useYjs";
import { useUndo } from "../hooks/useUndoManager";
import { useAnalysisContext } from "../contexts/AnalysisContext";

export default function Step1() {
  const { analysis } = useAnalysisContext();
  const doc = useDoc("step1");
  const undoManager = useUndo(doc ? [doc.getMap("definitions")] : null);

  const [fieldConstraints, setFieldConstraint] = useYMap<string>(
    doc,
    "fieldConstraints"
  );
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(
    new Set()
  );

  const toggleClass = (className: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(className)) {
      newExpanded.delete(className);
    } else {
      newExpanded.add(className);
    }
    setExpandedClasses(newExpanded);
  };

  const handleConstraintChange = (
    className: string,
    fieldName: string,
    value: string
  ) => {
    const key = `${className}.${fieldName}`;
    setFieldConstraint(key, value);
  };

  const getConstraint = (className: string, fieldName: string): string => {
    const key = `${className}.${fieldName}`;
    return fieldConstraints.get(key) || "";
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Step 1 — Data Definitions
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
              <strong>Purpose:</strong> Specify which Java types or classes the
              method will use or produce. Declare preconditions and
              postconditions for the data.
            </p>

            <p className="text-neutral-700 mb-4">
              Review the classes and fields detected in your project. For each
              field, specify any constraints, preconditions, or invariants that
              must hold.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Examples of constraints:</strong>
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>age ≥ 0 and age ≤ 150</li>
                <li>email must contain @ symbol</li>
                <li>balance cannot be negative</li>
                <li>name must not be null or empty</li>
              </ul>
            </div>
          </div>
        </div>

        {analysis && analysis.classes.length > 0 ? (
          <div className="space-y-6">
            {analysis.classes.map((classInfo) => (
              <div
                key={`${classInfo.name}-${classInfo.path}`}
                className="bg-white rounded-lg shadow-sm border border-neutral-200"
              >
                <div
                  className="px-6 py-4 border-b border-neutral-200 cursor-pointer hover:bg-neutral-50 transition"
                  onClick={() => toggleClass(classInfo.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {classInfo.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {classInfo.path}
                      </p>
                      {classInfo.javadoc && (
                        <div className="mt-2 p-2 bg-neutral-50 rounded text-sm">
                          <pre className="whitespace-pre-wrap text-xs text-neutral-700">
                            {classInfo.javadoc}
                          </pre>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-neutral-500">
                        {classInfo.fields.length} fields
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedClasses.has(classInfo.name)
                            ? "rotate-180"
                            : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedClasses.has(classInfo.name) && (
                  <div className="px-6 py-4">
                    {classInfo.fields.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-md font-medium text-neutral-800">
                          Fields
                        </h4>
                        {classInfo.fields.map((field) => (
                          <div
                            key={field.name}
                            className="border border-neutral-200 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">
                                    {field.type}
                                  </span>
                                  <span className="font-medium text-neutral-900">
                                    {field.name}
                                  </span>
                                  {field.modifiers.length > 0 && (
                                    <span className="text-xs text-neutral-500">
                                      ({field.modifiers.join(", ")})
                                    </span>
                                  )}
                                </div>
                                {field.javadoc && (
                                  <div className="mb-2 p-2 bg-neutral-50 rounded text-sm">
                                    <pre className="whitespace-pre-wrap text-xs text-neutral-700">
                                      {field.javadoc}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Constraints / Preconditions
                              </label>
                              <textarea
                                value={getConstraint(
                                  classInfo.name,
                                  field.name
                                )}
                                onChange={(e) =>
                                  handleConstraintChange(
                                    classInfo.name,
                                    field.name,
                                    e.target.value
                                  )
                                }
                                placeholder="Enter constraints, preconditions, or invariants for this field..."
                                rows={3}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500 text-sm">
                        No fields found in this class.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="text-center">
              <p className="text-neutral-500 mb-4">
                No classes found in the current project analysis.
              </p>
              <p className="text-sm text-neutral-400">
                Make sure you have selected a Java project with .java files.
              </p>
            </div>
          </div>
        )}

        {analysis && analysis.interfaces.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Interfaces
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.interfaces.map((interfaceInfo) => (
                  <div
                    key={`${interfaceInfo.name}-${interfaceInfo.path}`}
                    className="border border-neutral-200 rounded-lg p-4"
                  >
                    <h3 className="font-medium text-neutral-900 mb-1">
                      {interfaceInfo.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-2">
                      {interfaceInfo.path}
                    </p>
                    {interfaceInfo.javadoc && (
                      <div className="mb-2 p-2 bg-neutral-50 rounded text-sm">
                        <pre className="whitespace-pre-wrap text-xs text-neutral-700">
                          {interfaceInfo.javadoc}
                        </pre>
                      </div>
                    )}
                    <div className="text-xs text-neutral-500">
                      {interfaceInfo.methods.length} methods,{" "}
                      {interfaceInfo.constants.length} constants
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
