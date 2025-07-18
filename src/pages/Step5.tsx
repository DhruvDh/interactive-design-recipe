import { useState } from "react";

export default function Step5() {
  const [implementation, setImplementation] = useState("");
  const [testResults, setTestResults] = useState("");

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Step 5 — Implementation
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="prose prose-neutral max-w-none mb-6">
            <p className="text-neutral-700 mb-4">
              <strong>Purpose:</strong> Fill in the template with actual code
              that implements the function logic, then test it against your
              examples.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Implementation process:</strong>
              </p>
              <ol className="text-sm text-neutral-600 list-decimal list-inside space-y-1">
                <li>Start with your template from Step 4</li>
                <li>Replace the ... placeholders with actual code</li>
                <li>Implement helper functions if needed</li>
                <li>Run your tests to verify correctness</li>
                <li>Refine and debug as necessary</li>
              </ol>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="implementation"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Implementation Code
              </label>
              <textarea
                id="implementation"
                value={implementation}
                onChange={(e) => setImplementation(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm font-mono"
                placeholder='public ReturnType methodName(ParameterType parameter) {
    // Your implementation here
    
    // Example structure:
    // 1. Handle edge cases
    if (parameter == null) {
        throw new IllegalArgumentException("Parameter cannot be null");
    }
    
    // 2. Main logic
    // ... your implementation ...
    
    // 3. Return result
    return result;
}

// Helper methods (if needed)
private HelperReturnType helperMethod(HelperParameterType param) {
    // Helper implementation
    return helperResult;
}'
              />
            </div>

            <div>
              <label
                htmlFor="test-results"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Test Results
              </label>
              <textarea
                id="test-results"
                value={testResults}
                onChange={(e) => setTestResults(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm font-mono"
                placeholder='Paste your test execution results here...

Example:
✓ testMyFunction_TypicalCase PASSED
✓ testMyFunction_EmptyString PASSED
✓ testMyFunction_ZeroCount PASSED
✓ testMyFunction_NegativeCount PASSED

All tests passed! ✅

OR if there are failures:
✗ testMyFunction_TypicalCase FAILED
  Expected: "hellohellohello"
  Actual: "hello"
  
Fix: Check the loop condition in the implementation'
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              Implementation: {implementation.length} characters | Test Results:{" "}
              {testResults.length} characters
            </div>
            <button
              onClick={() => {
                setImplementation("");
                setTestResults("");
              }}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Implementation Tips
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <span className="text-neutral-700">
                  Start simple - implement the basic case first
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <span className="text-neutral-700">
                  Use meaningful variable names
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <span className="text-neutral-700">
                  Add comments for complex logic
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <span className="text-neutral-700">
                  Handle edge cases explicitly
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <span className="text-neutral-700">
                  Test frequently as you develop
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Testing & Debugging
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">🔍</span>
                <span className="text-neutral-700">
                  Run tests after each change
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">🔍</span>
                <span className="text-neutral-700">
                  Use print statements to debug
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">🔍</span>
                <span className="text-neutral-700">
                  Check boundary conditions
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">🔍</span>
                <span className="text-neutral-700">
                  Verify with additional examples
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">🔍</span>
                <span className="text-neutral-700">
                  Consider performance implications
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-green-50 rounded-lg p-6 border border-green-200">
          <h2 className="text-lg font-semibold text-green-900 mb-4">
            🎉 Congratulations!
          </h2>
          <p className="text-green-800 mb-4">
            You've completed the Design Recipe process! By following these
            systematic steps, you've:
          </p>
          <div className="space-y-2 text-sm text-green-700">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Clearly understood the problem</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Analyzed the data structures involved</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Defined a clear function signature and purpose</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Created comprehensive examples and tests</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Designed a systematic template</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Implemented and tested your solution</span>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-sm">
            This systematic approach helps ensure your code is correct,
            maintainable, and well-tested!
          </p>
        </div>
      </div>
    </div>
  );
}
