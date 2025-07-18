import { useState } from "react";

export default function Step0() {
  const [problemStatement, setProblemStatement] = useState("");

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Step 0 — Restate the Problem
        </h1>

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
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
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
              {problemStatement.length} characters
            </div>
            <button
              onClick={() => setProblemStatement("")}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Next Steps
          </h2>
          <p className="text-neutral-700 mb-4">
            Once you've clearly restated the problem, you'll move on to:
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-neutral-700 font-bold">1.</span>
              <span className="text-neutral-700">
                Define the data structures you'll need
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-neutral-700 font-bold">2.</span>
              <span className="text-neutral-700">
                Write the function signature and purpose statement
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-neutral-700 font-bold">3.</span>
              <span className="text-neutral-700">
                Create examples and test cases
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-neutral-700 font-bold">4.</span>
              <span className="text-neutral-700">
                Design the function template
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-neutral-700 font-bold">5.</span>
              <span className="text-neutral-700">Implement the solution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
