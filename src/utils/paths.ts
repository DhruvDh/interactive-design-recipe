/**
 * Canonical file ID function as specified in the guide
 * Returns webkitRelativePath if available, otherwise file.name
 */
export const canonical = (f: File | string): string =>
  typeof f === "string" ? f : f.webkitRelativePath || f.name;

/**
 * Converts a File object to a canonical project-relative path
 * Canonical format: no leading ./ and no project root folder name
 * Example: src/App.java (not ./src/App.java or design-recipe/src/App.java)
 */
export function toProjectPath(file: File): string {
  return canonical(file);
}

/**
 * Normalizes a path string to canonical format
 */
export function normalizePath(path: string): string {
  // Remove leading ./ if present
  if (path.startsWith("./")) {
    path = path.substring(2);
  }

  // Remove leading / if present
  if (path.startsWith("/")) {
    path = path.substring(1);
  }

  return path;
}
