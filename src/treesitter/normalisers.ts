import type { QueryMatch } from "web-tree-sitter";
import type {
  DRAnalysis,
  FieldInfo,
  MethodInfo,
  ConstructorInfo,
  ImportInfo,
  ParameterInfo,
} from "./types";

/**
 * Find the enclosing class for a given Tree-sitter node
 * by traversing up the syntax tree until we find a class_declaration
 */
function findEnclosingClass(
  node: QueryMatch["captures"][0]["node"]
): string | null {
  let n: QueryMatch["captures"][0]["node"] | null = node;
  while (n && n.type !== "class_declaration") {
    n = n.parent;
  }
  return n?.childForFieldName("name")?.text ?? null;
}

/**
 * Find the enclosing interface for a given Tree-sitter node
 * by traversing up the syntax tree until we find an interface_declaration
 */
function findEnclosingInterface(
  node: QueryMatch["captures"][0]["node"]
): string | null {
  let n: QueryMatch["captures"][0]["node"] | null = node;
  while (n && n.type !== "interface_declaration") {
    n = n.parent;
  }
  return n?.childForFieldName("name")?.text ?? null;
}

/**
 * Extract modifiers from Tree-sitter captures
 */
function extractModifiers(captures: QueryMatch["captures"]): string[] {
  const modifiers: string[] = [];

  captures.forEach((capture) => {
    if (capture.name === "modifiers" || capture.name === "modifier") {
      // Handle multiple modifiers in one capture
      const text = capture.node.text;
      if (text) {
        // Split by whitespace and filter out empty strings
        const mods = text.split(/\s+/).filter((mod) => mod.trim());
        modifiers.push(...mods);
      }
    }
  });

  return modifiers;
}

/**
 * Extract Javadoc comment from a node by looking for preceding block comments
 */
function extractJavadoc(node: QueryMatch["captures"][0]["node"]): string | undefined {
  let current = node.previousSibling;
  while (current && current.type.match(/^(line_comment|block_comment)$/)) {
    if (current.type === "block_comment" && current.text.startsWith("/**")) {
      return current.text;
    }
    current = current.previousSibling;
  }
  return undefined;
}

/**
 * Extract parameters from Tree-sitter formal_parameters node
 */
function extractParameters(
  parametersNode: QueryMatch["captures"][0]["node"]
): ParameterInfo[] {
  const parameters: ParameterInfo[] = [];

  if (!parametersNode || parametersNode.type !== "formal_parameters") {
    return parameters;
  }

  // Iterate through child nodes to find formal_parameter nodes
  for (let i = 0; i < parametersNode.childCount; i++) {
    const child = parametersNode.child(i);
    if (child && child.type === "formal_parameter") {
      // Extract type and name from formal_parameter
      const typeNode = child.childForFieldName("type");
      const nameNode = child.childForFieldName("name");

      if (typeNode && nameNode) {
        parameters.push({
          name: nameNode.text,
          type: typeNode.text,
        });
      }
    }
  }

  return parameters;
}

export function initEmptyAnalysis(): DRAnalysis {
  return {
    classes: [],
    interfaces: [],
    imports: [],
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
          javadoc: extractJavadoc(nameCapture.node),
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

      // Find the class this field belongs to by traversing up the syntax tree
      const className = findEnclosingClass(nameCapture.node);
      const classInfo = analysis.classes.find(
        (c) => c.path === filePath && c.name === className
      );
      if (classInfo) {
        const fieldInfo: FieldInfo = {
          name: fieldName,
          type: fieldType,
          modifiers: extractModifiers(match.captures),
          javadoc: extractJavadoc(nameCapture.node),
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
    const parametersCapture = match.captures.find(
      (c) => c.name === "parameters"
    );

    if (nameCapture) {
      const methodName = nameCapture.node.text;
      const returnType = returnTypeCapture?.node.text || "void";
      const parameters = parametersCapture
        ? extractParameters(parametersCapture.node)
        : [];

      // Find the class this method belongs to by traversing up the syntax tree
      const className = findEnclosingClass(nameCapture.node);
      const classInfo = analysis.classes.find(
        (c) => c.path === filePath && c.name === className
      );
      if (classInfo) {
        const methodInfo: MethodInfo = {
          name: methodName,
          returnType: returnType,
          parameters: parameters,
          modifiers: extractModifiers(match.captures),
          javadoc: extractJavadoc(nameCapture.node),
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
  matches.forEach((match) => {
    const parametersCapture = match.captures.find(
      (c) => c.name === "parameters"
    );
    const nameCapture = match.captures.find((c) => c.name === "name");

    // Find the class this constructor belongs to
    const className = nameCapture
      ? nameCapture.node.text
      : findEnclosingClass(match.captures[0].node);

    const classInfo = analysis.classes.find(
      (c) => c.path === filePath && c.name === className
    );

    if (classInfo) {
      const parameters = parametersCapture
        ? extractParameters(parametersCapture.node)
        : [];

      const constructorInfo: ConstructorInfo = {
        parameters: parameters,
        modifiers: extractModifiers(match.captures),
        javadoc: nameCapture ? extractJavadoc(nameCapture.node) : undefined,
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
          javadoc: extractJavadoc(nameCapture.node),
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
    const parametersCapture = match.captures.find(
      (c) => c.name === "parameters"
    );

    if (nameCapture) {
      const methodName = nameCapture.node.text;
      const returnType = returnTypeCapture?.node.text || "void";
      const parameters = parametersCapture
        ? extractParameters(parametersCapture.node)
        : [];

      // Find the interface this method belongs to
      const interfaceName = findEnclosingInterface(nameCapture.node);
      const interfaceInfo = analysis.interfaces.find(
        (i) => i.path === filePath && i.name === interfaceName
      );

      if (interfaceInfo) {
        const methodInfo: MethodInfo = {
          name: methodName,
          returnType: returnType,
          parameters: parameters,
          modifiers: extractModifiers(match.captures),
          javadoc: extractJavadoc(nameCapture.node),
        };

        // Avoid duplicates
        if (!interfaceInfo.methods.some((m) => m.name === methodName)) {
          interfaceInfo.methods.push(methodInfo);
        }
      }
    }
  });
}

export function normaliseInterfaceConstants(
  matches: QueryMatch[],
  filePath: string,
  analysis: DRAnalysis
): void {
  matches.forEach((match) => {
    const nameCapture = match.captures.find((c) => c.name === "name");
    const typeCapture = match.captures.find((c) => c.name === "type");

    if (nameCapture && typeCapture) {
      const constantName = nameCapture.node.text;
      const constantType = typeCapture.node.text;

      // Find the interface this constant belongs to
      const interfaceName = findEnclosingInterface(nameCapture.node);
      const interfaceInfo = analysis.interfaces.find(
        (i) => i.path === filePath && i.name === interfaceName
      );

      if (interfaceInfo) {
        const constantInfo: FieldInfo = {
          name: constantName,
          type: constantType,
          modifiers: extractModifiers(match.captures),
          javadoc: extractJavadoc(nameCapture.node),
        };

        // Avoid duplicates
        if (!interfaceInfo.constants.some((c) => c.name === constantName)) {
          interfaceInfo.constants.push(constantInfo);
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
    const importPathCapture = match.captures.find(
      (c) => c.name === "import_path"
    );
    const asteriskCapture = match.captures.find((c) => c.name === "asterisk");
    const modifiersCapture = match.captures.find((c) => c.name === "modifiers");

    if (importPathCapture) {
      const importPath = importPathCapture.node.text;
      const isWildcard = !!asteriskCapture;
      const isStatic = modifiersCapture?.node.text.includes("static") || false;

      // Extract package and class name
      const parts = importPath.split(".");
      const packageName = isWildcard
        ? importPath
        : parts.slice(0, -1).join(".");
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
  "interface_constants.scm": normaliseInterfaceConstants,
  "import.scm": normaliseImports,
} as const;
