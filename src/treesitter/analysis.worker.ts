import { Parser, Language, Query } from "web-tree-sitter";
import type { ParseRequest, ParseResponse, ErrorResponse } from "./types";
import { initEmptyAnalysis, normalisers } from "./normalisers";

const CORE = new URL("/tree-sitter.wasm", import.meta.url).href;
const JAVA = new URL("/tree-sitter-java.wasm", import.meta.url).href;

// Initialize Tree-sitter parser
const ready = (async () => {
  try {
    await Parser.init({ locateFile: () => CORE });
    const lang = await Language.load(JAVA);
    const parser = new Parser();
    parser.setLanguage(lang);
    return { parser, lang };
  } catch (error) {
    console.error("Failed to initialize Tree-sitter:", error);
    throw error;
  }
})();

// Import query sources using Vite's glob import
const queries = import.meta.glob<string>("./queries/*.scm", {
  as: "raw",
  eager: true,
});

// List of queries we want to process
const importantQueries = [
  "class_name.scm",
  "class_fields.scm",
  "class_methods.scm",
  "class_constructors.scm",
  "interface_name.scm",
  "interface_methods.scm",
  "interface_constants.scm",
  "import.scm",
] as const;

// Handle incoming messages from the main thread
self.onmessage = async (ev: MessageEvent<ParseRequest>) => {
  try {
    const { parser, lang } = await ready;
    const analysis = initEmptyAnalysis();

    console.log(`Processing ${ev.data.files.length} files...`);

    // Process each file
    for (const file of ev.data.files) {
      // Skip non-Java files
      if (!file.path.endsWith(".java")) {
        continue;
      }

      try {
        const tree = parser.parse(file.text);

        if (!tree) {
          console.warn(`Failed to parse file: ${file.path}`);
          continue;
        }

        // Run each query we care about
        for (const queryName of importantQueries) {
          const queryPath = `./queries/${queryName}`;
          const querySrc = queries[queryPath];

          if (!querySrc) {
            console.warn(`Query not found: ${queryPath}`);
            continue;
          }

          try {
            const query = new Query(lang, querySrc);
            const matches = query.matches(tree.rootNode);

            // Transform matches using the appropriate normaliser
            const normaliser = normalisers[queryName];
            if (normaliser) {
              normaliser(matches, file.path, analysis);
            } else {
              console.warn(`No normaliser found for query: ${queryName}`);
            }
          } catch (queryError) {
            console.error(
              `Error processing query ${queryName} for file ${file.path}:`,
              queryError
            );
          }
        }
      } catch (parseError) {
        console.error(`Error parsing file ${file.path}:`, parseError);
      }
    }

    console.log("Analysis complete:", analysis);

    // Send the analysis back to the main thread
    const response: ParseResponse = {
      ok: true,
      analysis,
    };

    self.postMessage(response);
  } catch (error) {
    console.error("Worker error:", error);

    const response: ErrorResponse = {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    self.postMessage(response);
  }
};

// Handle worker initialization
self.addEventListener("error", (error) => {
  console.error("Worker error:", error);
});

console.log("Analysis worker initialized");
