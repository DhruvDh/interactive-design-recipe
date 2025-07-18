import { useState } from "react";

export default function Step3() {
  const [examples, setExamples] = useState("");
  const [tests, setTests] = useState("");

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Step 3 — Examples & Tests
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="prose prose-neutral max-w-none mb-6">
            <p className="text-neutral-700 mb-4">
              <strong>Purpose:</strong> Create concrete examples that illustrate
              how your function should work, then convert them into executable
              tests.
            </p>

            <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-400">
              <p className="text-sm text-neutral-600 mb-2">
                <strong>Examples should include:</strong>
              </p>
              <ul className="text-sm text-neutral-600 list-disc list-inside">
                <li>Typical cases that show normal operation</li>
                <li>Edge cases (empty inputs, boundary values)</li>
                <li>Error cases (invalid inputs, exceptional conditions)</li>
                <li>At least 2-3 examples per function</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="examples"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Examples
              </label>
              <textarea
                id="examples"
                value={examples}
                onChange={(e) => setExamples(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm font-mono"
                placeholder='// Examples for myFunction(String input, int count):

// Typical case:
myFunction("hello", 3) → "hellohellohello"

// Edge case - empty string:
myFunction("", 5) → ""

// Edge case - zero count:
myFunction("test", 0) → ""

// Edge case - negative count:
myFunction("abc", -1) → throw IllegalArgumentException'
              />
            </div>

            <div>
              <label
                htmlFor="tests"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                JUnit Tests
              </label>
              <textarea
                id="tests"
                value={tests}
                onChange={(e) => setTests(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-neutral-500 focus:border-neutral-500 text-sm font-mono"
                placeholder='import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MyClassTest {
    
    @Test
    public void testMyFunction_TypicalCase() {
        assertEquals("hellohellohello", myFunction("hello", 3));
    }
    
    @Test
    public void testMyFunction_EmptyString() {
        assertEquals("", myFunction("", 5));
    }
    
    @Test
    public void testMyFunction_ZeroCount() {
        assertEquals("", myFunction("test", 0));
    }
    
    @Test
    public void testMyFunction_NegativeCount() {
        assertThrows(IllegalArgumentException.class, () -> {
            myFunction("abc", -1);
        });
    }
}'
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              Examples: {examples.length} characters | Tests: {tests.length}{" "}
              characters
            </div>
            <button
              onClick={() => {
                setExamples("");
                setTests("");
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
              Good Examples
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-neutral-700">
                  Use concrete values, not variables
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-neutral-700">
                  Show the expected output clearly
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-neutral-700">
                  Cover different scenarios
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-neutral-700">
                  Include edge cases and error conditions
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Test Guidelines
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-neutral-700">
                  One test method per example
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-neutral-700">
                  Use descriptive test method names
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-neutral-700">
                  Use appropriate assertion methods
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-neutral-700">
                  Test exception cases with assertThrows
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
