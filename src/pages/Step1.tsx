import { useState } from "react";
import { useAnalysisContext } from "../contexts/AnalysisContext";

export default function Step1() {
  const { analysis } = useAnalysisContext();
  const [selectedClass, setSelectedClass] = useState<string>("");

  const selectedClassInfo = analysis?.classes.find(
    (cls) => cls.name === selectedClass
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
          Step 1 — Data Definition
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="mb-6">
            <label
              htmlFor="class-select"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Select a class to analyze:
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            >
              <option value="">Choose a class...</option>
              {analysis.classes.map((cls) => (
                <option key={`${cls.name}-${cls.path}`} value={cls.name}>
                  {cls.name} ({cls.path})
                </option>
              ))}
            </select>
          </div>

          {selectedClassInfo && (
            <div className="space-y-6">
              <div className="border-l-4 border-neutral-400 pl-4">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  {selectedClassInfo.name}
                </h2>
                <p className="text-sm text-neutral-600 mb-4">
                  {selectedClassInfo.path}
                </p>
              </div>

              {/* Fields Section */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">
                  Fields ({selectedClassInfo.fields.length})
                </h3>
                {selectedClassInfo.fields.length === 0 ? (
                  <p className="text-neutral-500 text-sm">No fields found</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClassInfo.fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
                      >
                        <span className="font-mono text-sm text-neutral-700">
                          {field.type}
                        </span>
                        <span className="font-medium text-neutral-900">
                          {field.name}
                        </span>
                        {field.modifiers.length > 0 && (
                          <span className="text-xs text-neutral-500">
                            {field.modifiers.join(", ")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Methods Section */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">
                  Methods ({selectedClassInfo.methods.length})
                </h3>
                {selectedClassInfo.methods.length === 0 ? (
                  <p className="text-neutral-500 text-sm">No methods found</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClassInfo.methods.map((method, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
                      >
                        <span className="font-mono text-sm text-neutral-700">
                          {method.returnType}
                        </span>
                        <span className="font-medium text-neutral-900">
                          {method.name}()
                        </span>
                        {method.modifiers.length > 0 && (
                          <span className="text-xs text-neutral-500">
                            {method.modifiers.join(", ")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Constructors Section */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">
                  Constructors ({selectedClassInfo.constructors.length})
                </h3>
                {selectedClassInfo.constructors.length === 0 ? (
                  <p className="text-neutral-500 text-sm">
                    No constructors found
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedClassInfo.constructors.map(
                      (constructor, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
                        >
                          <span className="font-medium text-neutral-900">
                            {selectedClassInfo.name}()
                          </span>
                          {constructor.modifiers.length > 0 && (
                            <span className="text-xs text-neutral-500">
                              {constructor.modifiers.join(", ")}
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
