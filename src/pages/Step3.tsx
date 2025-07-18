import { useState } from "react";
import { useDoc, useYArray } from "../hooks/useYjs";
import { useUndo } from "../hooks/useUndoManager";
import { useAnalysisContext } from "../contexts/AnalysisContext";
import { writeText } from "../hooks/useYjs";
import { useToast } from "../hooks/useToast";
import type { MethodInfo, ClassInfo } from "../treesitter/types";

interface TestExample {
  input: string;
  expected: string;
  note: string;
}

export default function Step3() {
  const { analysis, currentProject } = useAnalysisContext();
  const doc = useDoc("step3");
  const { addToast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const undoManager = useUndo(
    doc && selectedMethod ? [doc.getArray(`examples.${selectedMethod}`)] : null
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

  // Use per-method examples array
  const [examples, setExamples] = useYArray<TestExample>(
    doc,
    selectedMethod ? `examples.${selectedMethod}` : "examples"
  );

  const addExample = () => {
    const newExample: TestExample = {
      input: "",
      expected: "",
      note: "",
    };
    setExamples([...examples, newExample]);
  };

  const updateExample = (
    index: number,
    field: keyof TestExample,
    value: string
  ) => {
    const updatedExamples = [...examples];
    updatedExamples[index] = { ...updatedExamples[index], [field]: value };
    setExamples(updatedExamples);
  };

  const removeExample = (index: number) => {
    const updatedExamples = examples.filter((_, i) => i !== index);
    setExamples(updatedExamples);
  };

  const generateJUnitTest = async () => {
    if (!selectedMethodInfo || !currentProject?.handle) {
      addToast("Please select a method and ensure project is loaded", "error");
      return;
    }

    setIsGenerating(true);

    try {
      const className = selectedMethodInfo.className;
      const methodName = selectedMethodInfo.method.name;
      const returnType = selectedMethodInfo.method.returnType;

      // Generate JUnit test class
      const testClassName = `${className}Test`;
      const testMethodName = `test${
        methodName.charAt(0).toUpperCase() + methodName.slice(1)
      }`;

      let junitCode = `import org.junit.Test;
import org.junit.Assert;
import static org.junit.Assert.*;

public class ${testClassName} {

    @Test
    public void ${testMethodName}() {
        // Test cases generated from Step 3 examples
        ${className} instance = new ${className}();
        
`;

      // Add test cases from examples
      examples.forEach((example, index) => {
        if (example.input && example.expected) {
          junitCode += `        // Test case ${index + 1}`;
          if (example.note) {
            junitCode += ` - ${example.note}`;
          }
          junitCode += `\n`;

          if (returnType === "void") {
            junitCode += `        // ${example.input} should result in ${example.expected}\n`;
            junitCode += `        // TODO: Add assertion for void method\n`;
          } else {
            junitCode += `        ${returnType} result${
              index + 1
            } = instance.${methodName}(${example.input});\n`;
            junitCode += `        assertEquals(${example.expected}, result${
              index + 1
            });\n`;
          }
          junitCode += `\n`;
        }
      });

      junitCode += `    }
}`;

      // Write to file system in .design-recipe/tests/ directory
      const fileName = `tests/Step3_${className}Test.java`;
      await writeText(currentProject.handle, fileName, junitCode);

      addToast(`JUnit test generated: ${fileName}`, "success");
    } catch (error) {
      console.error("Failed to generate JUnit test:", error);
      addToast("Failed to generate JUnit test", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Step 3 — Examples & Tests
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
              <strong>Purpose:</strong> Pin down the method's behavior with real
              examples before or during coding. Convert these examples into
              automated tests.
            </p>

            <p className="text-neutral-700 mb-4">
              Create a comprehensive table of test cases covering typical
              inputs, edge cases, and error scenarios.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Test cases should include:</strong>
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>Normal usage scenarios</li>
                <li>Edge cases (empty inputs, boundary values)</li>
                <li>Error scenarios (null inputs, invalid data)</li>
                <li>Mixed content or special conditions</li>
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
              Select a method to test:
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
            <div className="border-l-4 border-green-400 pl-4 bg-green-50 p-4 rounded-r-lg mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Testing: {selectedMethodInfo.className}.
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

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Test Examples
            </h2>
            <button
              onClick={addExample}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
            >
              + Add Example
            </button>
          </div>

          {examples.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-neutral-300">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="border border-neutral-300 px-4 py-2 text-left text-sm font-medium text-neutral-700">
                      Input
                    </th>
                    <th className="border border-neutral-300 px-4 py-2 text-left text-sm font-medium text-neutral-700">
                      Expected Output
                    </th>
                    <th className="border border-neutral-300 px-4 py-2 text-left text-sm font-medium text-neutral-700">
                      Notes / Rationale
                    </th>
                    <th className="border border-neutral-300 px-4 py-2 text-left text-sm font-medium text-neutral-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {examples.map((example, index) => (
                    <tr key={index} className="hover:bg-neutral-50">
                      <td className="border border-neutral-300 px-4 py-2">
                        <input
                          type="text"
                          value={example.input}
                          onChange={(e) =>
                            updateExample(index, "input", e.target.value)
                          }
                          placeholder="e.g., 'Hello', null, 42"
                          className="w-full px-2 py-1 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-500"
                        />
                      </td>
                      <td className="border border-neutral-300 px-4 py-2">
                        <input
                          type="text"
                          value={example.expected}
                          onChange={(e) =>
                            updateExample(index, "expected", e.target.value)
                          }
                          placeholder="e.g., 5, throws IllegalArgumentException"
                          className="w-full px-2 py-1 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-500"
                        />
                      </td>
                      <td className="border border-neutral-300 px-4 py-2">
                        <input
                          type="text"
                          value={example.note}
                          onChange={(e) =>
                            updateExample(index, "note", e.target.value)
                          }
                          placeholder="e.g., Normal case, Edge case, Error scenario"
                          className="w-full px-2 py-1 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-500"
                        />
                      </td>
                      <td className="border border-neutral-300 px-4 py-2">
                        <button
                          onClick={() => removeExample(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <p className="mb-4">No test examples yet.</p>
              <p className="text-sm">
                Click "Add Example" to create your first test case.
              </p>
            </div>
          )}
        </div>

        {selectedMethodInfo && examples.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Generate JUnit Tests
            </h2>
            <p className="text-neutral-700 mb-4">
              Convert your test examples into a JUnit test class. The generated
              test will be saved to the project's{" "}
              <code className="bg-neutral-100 px-1 rounded">
                .design-recipe/tests/
              </code>{" "}
              folder.
            </p>
            <button
              onClick={generateJUnitTest}
              disabled={isGenerating}
              className="px-6 py-3 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isGenerating ? "Generating..." : "Generate JUnit Test"}
            </button>
          </div>
        )}

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
