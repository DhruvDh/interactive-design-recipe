import { useState } from "react";

export default function Step4() {
  const [template, setTemplate] = useState("");
  const [templateType, setTemplateType] = useState("structural");

  const structuralTemplate = `// Template for processing data structures
public ReturnType methodName(DataType input) {
    // If the data is empty/null:
    if (input == null || input.isEmpty()) {
        return ...;
    }
    
    // If the data is a simple value:
    if (input.isSimpleValue()) {
        return ...;
    }
    
    // If the data is compound:
    // Process each component and combine results
    return combine(
        process(input.getComponent1()),
        process(input.getComponent2()),
        ...
    );
}`;

  const recursiveTemplate = `// Template for recursive functions
public ReturnType methodName(DataType input) {
    // Base case(s):
    if (input.isBaseCase()) {
        return ...;
    }
    
    // Recursive case:
    // Process the input and make a recursive call
    return combine(
        process(input.getCurrentPart()),
        methodName(input.getReducedProblem())
    );
}`;

  const iterativeTemplate = `// Template for iterative processing
public ReturnType methodName(DataType input) {
    // Initialize result
    ResultType result = initialValue;
    
    // Process each element
    for (ElementType element : input) {
        // Update result based on current element
        result = update(result, element);
    }
    
    return result;
}`;

  const getTemplate = () => {
    switch (templateType) {
      case "structural":
        return structuralTemplate;
      case "recursive":
        return recursiveTemplate;
      case "iterative":
        return iterativeTemplate;
      default:
        return structuralTemplate;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Step 4 — Template
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="prose prose-neutral max-w-none mb-6">
            <p className="text-neutral-700 mb-4">
              <strong>Purpose:</strong> Create a template that outlines the
              structure of your function based on the data it processes.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Template types:</strong>
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>
                  <strong>Structural:</strong> Based on the structure of input
                  data
                </li>
                <li>
                  <strong>Recursive:</strong> For problems that can be broken
                  down
                </li>
                <li>
                  <strong>Iterative:</strong> For processing collections or
                  sequences
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="template-type"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Template Type
            </label>
            <select
              id="template-type"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            >
              <option value="structural">Structural Template</option>
              <option value="recursive">Recursive Template</option>
              <option value="iterative">Iterative Template</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="template-example"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Template Example
            </label>
            <textarea
              id="template-example"
              value={getTemplate()}
              readOnly
              rows={20}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-sm font-mono"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="template"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Your Template
              </label>
              <textarea
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm font-mono"
                placeholder="Write your function template here...

// Consider:
// - What are the different cases for your input?
// - How do you handle each case?
// - What helper functions might you need?
// - Are there any recursive patterns?"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              Template: {template.length} characters
            </div>
            <button
              onClick={() => setTemplate("")}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Structural Template
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-neutral-700">
                  Based on data structure
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-neutral-700">Handle different cases</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-neutral-700">Process components</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Recursive Template
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span className="text-neutral-700">Define base cases</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span className="text-neutral-700">Make recursive calls</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span className="text-neutral-700">Combine results</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Iterative Template
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span className="text-neutral-700">Initialize accumulator</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span className="text-neutral-700">Process each element</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span className="text-neutral-700">Update result</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
