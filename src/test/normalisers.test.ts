import { describe, it, expect } from "vitest";
import type { QueryMatch } from "web-tree-sitter";
import {
  normaliseClassName,
  normaliseClassFields,
  normaliseClassMethods,
  normaliseClassConstructors,
  normaliseInterfaceName,
  normaliseInterfaceMethods,
  normaliseInterfaceConstants,
  normaliseImports,
  initEmptyAnalysis,
} from "../treesitter/normalisers";

// Mock types for testing
interface MockNode {
  text: string;
  type?: string;
  parent?: MockNode;
  childForFieldName?: (field: string) => MockNode | null;
  childCount?: number;
  child?: (index: number) => MockNode | null;
}

interface MockCapture {
  name: string;
  node: MockNode;
}

interface MockMatch {
  captures: MockCapture[];
}

// Helper function to create class parent structure
function createClassParent(className: string): MockNode {
  return {
    text: "",
    type: "class_declaration",
    childForFieldName: (field: string) => {
      if (field === "name") return { text: className };
      return null;
    },
  };
}

// Helper function to create interface parent structure
function createInterfaceParent(interfaceName: string): MockNode {
  return {
    text: "",
    type: "interface_declaration",
    childForFieldName: (field: string) => {
      if (field === "name") return { text: interfaceName };
      return null;
    },
  };
}

describe("normalisers", () => {
  describe("initEmptyAnalysis", () => {
    it("should create empty analysis object", () => {
      const analysis = initEmptyAnalysis();
      expect(analysis).toEqual({
        classes: [],
        interfaces: [],
        imports: [],
      });
    });
  });

  describe("normaliseClassName", () => {
    it("should extract class name from match", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "TestClass",
            },
          },
        ],
      };

      normaliseClassName([mockMatch as QueryMatch], "TestFile.java", analysis);

      expect(analysis.classes).toHaveLength(1);
      expect(analysis.classes[0]).toEqual({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });
    });

    it("should avoid duplicate classes", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "TestClass",
            },
          },
        ],
      };

      normaliseClassName([mockMatch as QueryMatch], "TestFile.java", analysis);
      normaliseClassName([mockMatch as QueryMatch], "TestFile.java", analysis);

      expect(analysis.classes).toHaveLength(1);
    });
  });

  describe("normaliseClassFields", () => {
    it("should extract field name and type", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const classParent = createClassParent("TestClass");
      const classBodyParent = {
        text: "",
        type: "class_body",
        parent: classParent,
      };
      const fieldDeclarationParent = {
        text: "",
        type: "field_declaration",
        parent: classBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testField",
              parent: fieldDeclarationParent,
            },
          },
          {
            name: "type",
            node: {
              text: "String",
            },
          },
        ],
      };

      normaliseClassFields(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes[0].fields).toHaveLength(1);
      expect(analysis.classes[0].fields[0]).toEqual({
        name: "testField",
        type: "String",
        modifiers: [],
        javadoc: undefined,
      });
    });

    it("should extract field with modifiers", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const classParent = createClassParent("TestClass");
      const classBodyParent = {
        text: "",
        type: "class_body",
        parent: classParent,
      };
      const fieldDeclarationParent = {
        text: "",
        type: "field_declaration",
        parent: classBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "CONSTANT",
              parent: fieldDeclarationParent,
            },
          },
          {
            name: "type",
            node: {
              text: "String",
            },
          },
          {
            name: "modifiers",
            node: {
              text: "public static final",
            },
          },
        ],
      };

      normaliseClassFields(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes[0].fields).toHaveLength(1);
      expect(analysis.classes[0].fields[0]).toEqual({
        name: "CONSTANT",
        type: "String",
        modifiers: ["public", "static", "final"],
        javadoc: undefined,
      });
    });

    it("should skip field if class not found", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testField",
            },
          },
          {
            name: "type",
            node: {
              text: "String",
            },
          },
        ],
      };

      normaliseClassFields(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes).toHaveLength(0);
    });
  });

  describe("normaliseClassMethods", () => {
    it("should extract method name and return type", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const classParent = createClassParent("TestClass");
      const classBodyParent = {
        text: "",
        type: "class_body",
        parent: classParent,
      };
      const methodDeclarationParent = {
        text: "",
        type: "method_declaration",
        parent: classBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: methodDeclarationParent,
            },
          },
          {
            name: "return_type",
            node: {
              text: "String",
            },
          },
        ],
      };

      normaliseClassMethods(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes[0].methods).toHaveLength(1);
      expect(analysis.classes[0].methods[0]).toEqual({
        name: "testMethod",
        returnType: "String",
        parameters: [],
        modifiers: [],
        javadoc: undefined,
      });
    });

    it("should extract method with parameters", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const classParent = createClassParent("TestClass");
      const classBodyParent = {
        text: "",
        type: "class_body",
        parent: classParent,
      };
      const methodDeclarationParent = {
        text: "",
        type: "method_declaration",
        parent: classBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: methodDeclarationParent,
            },
          },
          {
            name: "return_type",
            node: {
              text: "String",
            },
          },
          {
            name: "parameters",
            node: {
              text: "int x, String y",
              type: "formal_parameters",
              childCount: 2,
              child: (index: number) => {
                if (index === 0) {
                  return {
                    text: "int x",
                    type: "formal_parameter",
                    childForFieldName: (field: string) => {
                      if (field === "type") return { text: "int" };
                      if (field === "name") return { text: "x" };
                      return null;
                    },
                  };
                }
                if (index === 1) {
                  return {
                    text: "String y",
                    type: "formal_parameter",
                    childForFieldName: (field: string) => {
                      if (field === "type") return { text: "String" };
                      if (field === "name") return { text: "y" };
                      return null;
                    },
                  };
                }
                return null;
              },
            },
          },
        ],
      };

      normaliseClassMethods(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes[0].methods).toHaveLength(1);
      expect(analysis.classes[0].methods[0]).toEqual({
        name: "testMethod",
        returnType: "String",
        parameters: [
          { name: "x", type: "int" },
          { name: "y", type: "String" },
        ],
        modifiers: [],
        javadoc: undefined,
      });
    });

    it("should extract method with modifiers", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const classParent = createClassParent("TestClass");
      const classBodyParent = {
        text: "",
        type: "class_body",
        parent: classParent,
      };
      const methodDeclarationParent = {
        text: "",
        type: "method_declaration",
        parent: classBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: methodDeclarationParent,
            },
          },
          {
            name: "return_type",
            node: {
              text: "String",
            },
          },
          {
            name: "modifiers",
            node: {
              text: "public static",
            },
          },
        ],
      };

      normaliseClassMethods(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes[0].methods).toHaveLength(1);
      expect(analysis.classes[0].methods[0]).toEqual({
        name: "testMethod",
        returnType: "String",
        parameters: [],
        modifiers: ["public", "static"],
        javadoc: undefined,
      });
    });

    it("should skip method if class not found", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
            },
          },
          {
            name: "return_type",
            node: {
              text: "String",
            },
          },
        ],
      };

      normaliseClassMethods(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes).toHaveLength(0);
    });
  });

  describe("normaliseClassConstructors", () => {
    it("should extract constructor parameters", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const classParent = createClassParent("TestClass");
      const classBodyParent = {
        text: "",
        type: "class_body",
        parent: classParent,
      };
      const constructorDeclarationParent = {
        text: "",
        type: "constructor_declaration",
        parent: classBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "TestClass",
              parent: constructorDeclarationParent,
            },
          },
          {
            name: "parameters",
            node: {
              text: "String name",
              type: "formal_parameters",
              childCount: 1,
              child: (index: number) => {
                if (index === 0) {
                  return {
                    text: "String name",
                    type: "formal_parameter",
                    childForFieldName: (field: string) => {
                      if (field === "type") return { text: "String" };
                      if (field === "name") return { text: "name" };
                      return null;
                    },
                  };
                }
                return null;
              },
            },
          },
        ],
      };

      normaliseClassConstructors(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes[0].constructors).toHaveLength(1);
      expect(analysis.classes[0].constructors[0]).toEqual({
        parameters: [{ name: "name", type: "String" }],
        modifiers: [],
        javadoc: undefined,
      });
    });

    it("should extract constructor with modifiers", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const classParent = createClassParent("TestClass");
      const classBodyParent = {
        text: "",
        type: "class_body",
        parent: classParent,
      };
      const constructorDeclarationParent = {
        text: "",
        type: "constructor_declaration",
        parent: classBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "TestClass",
              parent: constructorDeclarationParent,
            },
          },
          {
            name: "modifiers",
            node: {
              text: "public",
            },
          },
        ],
      };

      normaliseClassConstructors(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes[0].constructors).toHaveLength(1);
      expect(analysis.classes[0].constructors[0]).toEqual({
        parameters: [],
        modifiers: ["public"],
        javadoc: undefined,
      });
    });

    it("should skip constructor if class not found", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "TestClass",
            },
          },
        ],
      };

      normaliseClassConstructors(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.classes).toHaveLength(0);
    });
  });

  describe("normaliseInterfaceName", () => {
    it("should extract interface name from match", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "TestInterface",
            },
          },
        ],
      };

      normaliseInterfaceName(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.interfaces).toHaveLength(1);
      expect(analysis.interfaces[0]).toEqual({
        name: "TestInterface",
        path: "TestFile.java",
        methods: [],
        constants: [],
      });
    });

    it("should avoid duplicate interfaces", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "TestInterface",
            },
          },
        ],
      };

      normaliseInterfaceName(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );
      normaliseInterfaceName(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.interfaces).toHaveLength(1);
    });
  });

  describe("normaliseInterfaceMethods", () => {
    it("should extract method name and return type", () => {
      const analysis = initEmptyAnalysis();
      // Add an interface first
      analysis.interfaces.push({
        name: "TestInterface",
        path: "TestFile.java",
        methods: [],
        constants: [],
      });

      const interfaceParent = createInterfaceParent("TestInterface");
      const interfaceBodyParent = {
        text: "",
        type: "interface_body",
        parent: interfaceParent,
      };
      const methodDeclarationParent = {
        text: "",
        type: "method_declaration",
        parent: interfaceBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: methodDeclarationParent,
            },
          },
          {
            name: "return_type",
            node: {
              text: "String",
            },
          },
        ],
      };

      normaliseInterfaceMethods(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.interfaces[0].methods).toHaveLength(1);
      expect(analysis.interfaces[0].methods[0]).toEqual({
        name: "testMethod",
        returnType: "String",
        parameters: [],
        modifiers: [],
        javadoc: undefined,
      });
    });

    it("should extract method with parameters", () => {
      const analysis = initEmptyAnalysis();
      // Add an interface first
      analysis.interfaces.push({
        name: "TestInterface",
        path: "TestFile.java",
        methods: [],
        constants: [],
      });

      const interfaceParent = createInterfaceParent("TestInterface");
      const interfaceBodyParent = {
        text: "",
        type: "interface_body",
        parent: interfaceParent,
      };
      const methodDeclarationParent = {
        text: "",
        type: "method_declaration",
        parent: interfaceBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: methodDeclarationParent,
            },
          },
          {
            name: "return_type",
            node: {
              text: "String",
            },
          },
          {
            name: "parameters",
            node: {
              text: "int x",
              type: "formal_parameters",
              childCount: 1,
              child: (index: number) => {
                if (index === 0) {
                  return {
                    text: "int x",
                    type: "formal_parameter",
                    childForFieldName: (field: string) => {
                      if (field === "type") return { text: "int" };
                      if (field === "name") return { text: "x" };
                      return null;
                    },
                  };
                }
                return null;
              },
            },
          },
        ],
      };

      normaliseInterfaceMethods(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.interfaces[0].methods).toHaveLength(1);
      expect(analysis.interfaces[0].methods[0]).toEqual({
        name: "testMethod",
        returnType: "String",
        parameters: [{ name: "x", type: "int" }],
        modifiers: [],
        javadoc: undefined,
      });
    });

    it("should skip method if interface not found", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
            },
          },
          {
            name: "return_type",
            node: {
              text: "String",
            },
          },
        ],
      };

      normaliseInterfaceMethods(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.interfaces).toHaveLength(0);
    });
  });

  describe("normaliseInterfaceConstants", () => {
    it("should extract constant name and type", () => {
      const analysis = initEmptyAnalysis();
      // Add an interface first
      analysis.interfaces.push({
        name: "TestInterface",
        path: "TestFile.java",
        methods: [],
        constants: [],
      });

      const interfaceParent = createInterfaceParent("TestInterface");
      const interfaceBodyParent = {
        text: "",
        type: "interface_body",
        parent: interfaceParent,
      };
      const constantDeclarationParent = {
        text: "",
        type: "constant_declaration",
        parent: interfaceBodyParent,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "MAX_SIZE",
              parent: constantDeclarationParent,
            },
          },
          {
            name: "type",
            node: {
              text: "int",
            },
          },
        ],
      };

      normaliseInterfaceConstants(
        [mockMatch as QueryMatch],
        "TestFile.java",
        analysis
      );

      expect(analysis.interfaces[0].constants).toHaveLength(1);
      expect(analysis.interfaces[0].constants[0]).toEqual({
        name: "MAX_SIZE",
        type: "int",
        modifiers: [],
        javadoc: undefined,
      });
    });
  });

  describe("normaliseImports", () => {
    it("should extract import path and flags", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "import_path",
            node: {
              text: "java.util.List",
            },
          },
        ],
      };

      normaliseImports([mockMatch as QueryMatch], "TestFile.java", analysis);

      expect(analysis.imports).toHaveLength(1);
      expect(analysis.imports[0]).toEqual({
        packageName: "java.util",
        className: "List",
        isStatic: false,
        isWildcard: false,
      });
    });

    it("should handle wildcard imports", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "import_path",
            node: {
              text: "java.util",
            },
          },
          {
            name: "asterisk",
            node: {
              text: "*",
            },
          },
        ],
      };

      normaliseImports([mockMatch as QueryMatch], "TestFile.java", analysis);

      expect(analysis.imports).toHaveLength(1);
      expect(analysis.imports[0]).toEqual({
        packageName: "java.util",
        className: undefined,
        isStatic: false,
        isWildcard: true,
      });
    });

    it("should handle static imports", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "import_path",
            node: {
              text: "java.util.Collections",
            },
          },
          {
            name: "modifiers",
            node: {
              text: "static",
            },
          },
        ],
      };

      normaliseImports([mockMatch as QueryMatch], "TestFile.java", analysis);

      expect(analysis.imports).toHaveLength(1);
      expect(analysis.imports[0]).toEqual({
        packageName: "java.util",
        className: "Collections",
        isStatic: true,
        isWildcard: false,
      });
    });

    it("should avoid duplicate imports", () => {
      const analysis = initEmptyAnalysis();
      const mockMatch: MockMatch = {
        captures: [
          {
            name: "import_path",
            node: {
              text: "java.util.List",
            },
          },
        ],
      };

      normaliseImports([mockMatch as QueryMatch], "TestFile.java", analysis);
      normaliseImports([mockMatch as QueryMatch], "TestFile.java", analysis);

      expect(analysis.imports).toHaveLength(1);
    });
  });
});
