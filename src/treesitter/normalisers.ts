import type { QueryMatch } from "web-tree-sitter";
import type {
  DRAnalysis,
  FieldInfo,
  MethodInfo,
  ConstructorInfo,
  ImportInfo,
} from "./types";

export function initEmptyAnalysis(): DRAnalysis {
  return {
    classes: [],
    interfaces: [],
    imports: [],
    methods: [],
  };
}

export function normaliseClassName(
  matches: QueryMatch[],
  filePath: string,
  analysis: DRAnalysis
): void {
  matches.forEach((match) => {
    const nameCapture = match.captures.find((c) => c.name === "name");
    if (nameCapture) {
      const className = nameCapture.node.text;

      // Find existing class or create new one
      let classInfo = analysis.classes.find(
        (c) => c.name === className && c.path === filePath
      );
      if (!classInfo) {
        classInfo = {
          name: className,
          path: filePath,
          fields: [],
          methods: [],
          constructors: [],
        };
        analysis.classes.push(classInfo);
      }
    }
  });
}

export function normaliseClassFields(
  matches: QueryMatch[],
  filePath: string,
  analysis: DRAnalysis
): void {
  matches.forEach((match) => {
    const nameCapture = match.captures.find((c) => c.name === "name");
    const typeCapture = match.captures.find((c) => c.name === "type");

    if (nameCapture && typeCapture) {
      const fieldName = nameCapture.node.text;
      const fieldType = typeCapture.node.text;

      // Find the class this field belongs to
      // For now, assume it's the first class in the file
      const classInfo = analysis.classes.find((c) => c.path === filePath);
      if (classInfo) {
        const fieldInfo: FieldInfo = {
          name: fieldName,
          type: fieldType,
          modifiers: [], // TODO: extract modifiers from Tree-sitter
        };

        // Avoid duplicates
        if (!classInfo.fields.some((f) => f.name === fieldName)) {
          classInfo.fields.push(fieldInfo);
        }
      }
    }
  });
}

export function normaliseClassMethods(
  matches: QueryMatch[],
  filePath: string,
  analysis: DRAnalysis
): void {
  matches.forEach((match) => {
    const nameCapture = match.captures.find((c) => c.name === "name");
    const returnTypeCapture = match.captures.find(
      (c) => c.name === "return_type"
    );

    if (nameCapture) {
      const methodName = nameCapture.node.text;
      const returnType = returnTypeCapture?.node.text || "void";

      // Find the class this method belongs to
      const classInfo = analysis.classes.find((c) => c.path === filePath);
      if (classInfo) {
        const methodInfo: MethodInfo = {
          name: methodName,
          returnType: returnType,
          parameters: [], // TODO: extract parameters
          modifiers: [], // TODO: extract modifiers
        };

        // Avoid duplicates
        if (!classInfo.methods.some((m) => m.name === methodName)) {
          classInfo.methods.push(methodInfo);
        }
      }
    }
  });
}

export function normaliseClassConstructors(
  matches: QueryMatch[],
  filePath: string,
  analysis: DRAnalysis
): void {
  matches.forEach(() => {
    // Find the class this constructor belongs to
    const classInfo = analysis.classes.find((c) => c.path === filePath);
    if (classInfo) {
      const constructorInfo: ConstructorInfo = {
        parameters: [], // TODO: extract parameters
        modifiers: [], // TODO: extract modifiers
      };

      classInfo.constructors.push(constructorInfo);
    }
  });
}

export function normaliseInterfaceName(
  matches: QueryMatch[],
  filePath: string,
  analysis: DRAnalysis
): void {
  matches.forEach((match) => {
    const nameCapture = match.captures.find((c) => c.name === "name");
    if (nameCapture) {
      const interfaceName = nameCapture.node.text;

      // Find existing interface or create new one
      let interfaceInfo = analysis.interfaces.find(
        (i) => i.name === interfaceName && i.path === filePath
      );
      if (!interfaceInfo) {
        interfaceInfo = {
          name: interfaceName,
          path: filePath,
          methods: [],
          constants: [],
        };
        analysis.interfaces.push(interfaceInfo);
      }
    }
  });
}

export function normaliseInterfaceMethods(
  matches: QueryMatch[],
  filePath: string,
  analysis: DRAnalysis
): void {
  matches.forEach((match) => {
    const nameCapture = match.captures.find((c) => c.name === "name");
    const returnTypeCapture = match.captures.find(
      (c) => c.name === "return_type"
    );

    if (nameCapture) {
      const methodName = nameCapture.node.text;
      const returnType = returnTypeCapture?.node.text || "void";

      // Find the interface this method belongs to
      const interfaceInfo = analysis.interfaces.find(
        (i) => i.path === filePath
      );
      if (interfaceInfo) {
        const methodInfo: MethodInfo = {
          name: methodName,
          returnType: returnType,
          parameters: [], // TODO: extract parameters
          modifiers: [], // TODO: extract modifiers
        };

        // Avoid duplicates
        if (!interfaceInfo.methods.some((m) => m.name === methodName)) {
          interfaceInfo.methods.push(methodInfo);
        }
      }
    }
  });
}

export function normaliseImports(
  matches: QueryMatch[],
  _filePath: string,
  analysis: DRAnalysis
): void {
  matches.forEach((match) => {
    const importCapture = match.captures.find((c) => c.name === "import");
    if (importCapture) {
      const importText = importCapture.node.text;

      // Parse import statement
      const isStatic = importText.includes("static");
      const isWildcard = importText.includes("*");

      // Extract package and class name
      const parts = importText
        .replace(/import\s+(static\s+)?/, "")
        .replace(/;$/, "")
        .split(".");
      const packageName = parts.slice(0, -1).join(".");
      const className = isWildcard ? undefined : parts[parts.length - 1];

      const importInfo: ImportInfo = {
        packageName,
        className,
        isStatic,
        isWildcard,
      };

      // Avoid duplicates
      if (
        !analysis.imports.some(
          (i) =>
            i.packageName === packageName &&
            i.className === className &&
            i.isStatic === isStatic &&
            i.isWildcard === isWildcard
        )
      ) {
        analysis.imports.push(importInfo);
      }
    }
  });
}

// Map of query names to their normaliser functions
export const normalisers = {
  "class_name.scm": normaliseClassName,
  "class_fields.scm": normaliseClassFields,
  "class_methods.scm": normaliseClassMethods,
  "class_constructors.scm": normaliseClassConstructors,
  "interface_name.scm": normaliseInterfaceName,
  "interface_methods.scm": normaliseInterfaceMethods,
  "import.scm": normaliseImports,
} as const;
