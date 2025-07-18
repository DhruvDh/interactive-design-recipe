import { describe, it, expect } from "vitest";
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
  parent?: MockNode;
  type?: string;
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

      normaliseClassName([mockMatch as any], "TestFile.java", analysis);

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

      normaliseClassName([mockMatch as any], "TestFile.java", analysis);
      normaliseClassName([mockMatch as any], "TestFile.java", analysis);

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

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testField",
              parent: {
                text: "",
                type: "field_declaration",
                parent: {
                  text: "",
                  type: "class_body",
                  parent: {
                    text: "",
                    type: "class_declaration",
                    childForFieldName: () => ({ text: "TestClass" }),
                  },
                },
              },
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

      normaliseClassFields([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].fields).toHaveLength(1);
      expect(analysis.classes[0].fields[0]).toEqual({
        name: "testField",
        type: "int",
        modifiers: [],
      });
    });

    it("should extract field modifiers", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testField",
              parent: {
                text: "",
                type: "field_declaration",
                parent: {
                  text: "",
                  type: "class_body",
                  parent: {
                    text: "",
                    type: "class_declaration",
                    childForFieldName: () => ({ text: "TestClass" }),
                  },
                },
              },
            },
          },
          {
            name: "type",
            node: {
              text: "int",
            },
          },
          {
            name: "modifiers",
            node: {
              text: "private static final",
            },
          },
        ],
      };

      normaliseClassFields([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].fields[0].modifiers).toEqual([
        "private",
        "static",
        "final",
      ]);
    });

    it("should handle empty modifiers", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testField",
              parent: {
                text: "",
                type: "field_declaration",
                parent: {
                  text: "",
                  type: "class_body",
                  parent: {
                    text: "",
                    type: "class_declaration",
                    childForFieldName: () => ({ text: "TestClass" }),
                  },
                },
              },
            },
          },
          {
            name: "type",
            node: {
              text: "int",
            },
          },
          {
            name: "modifiers",
            node: {
              text: "",
            },
          },
        ],
      };

      normaliseClassFields([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].fields[0].modifiers).toEqual([]);
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

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: {
                text: "",
                type: "method_declaration",
                parent: {
                  text: "",
                  type: "class_body",
                  parent: {
                    text: "",
                    type: "class_declaration",
                    childForFieldName: () => ({ text: "TestClass" }),
                  },
                },
              },
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

      normaliseClassMethods([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].methods).toHaveLength(1);
      expect(analysis.classes[0].methods[0]).toEqual({
        name: "testMethod",
        returnType: "String",
        parameters: [],
        modifiers: [],
      });
    });

    it("should extract method parameters", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const mockParameterNode: MockNode = {
        text: "",
        type: "formal_parameters",
        childCount: 2,
        child: (index: number) => {
          if (index === 0) {
            return {
              text: "",
              type: "formal_parameter",
              childForFieldName: (field: string) => {
                if (field === "type") return { text: "String" };
                if (field === "name") return { text: "param1" };
                return null;
              },
            };
          }
          return null;
        },
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: {
                text: "",
                type: "method_declaration",
                parent: {
                  text: "",
                  type: "class_body",
                  parent: {
                    text: "",
                    type: "class_declaration",
                    childForFieldName: () => ({ text: "TestClass" }),
                  },
                },
              },
            },
          },
          {
            name: "return_type",
            node: {
              text: "void",
            },
          },
          {
            name: "parameters",
            node: mockParameterNode,
          },
        ],
      };

      normaliseClassMethods([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].methods).toHaveLength(1);
      expect(analysis.classes[0].methods[0]).toEqual({
        name: "testMethod",
        returnType: "void",
        parameters: [
          {
            name: "param1",
            type: "String",
          },
        ],
        modifiers: [],
      });
    });

    it("should handle methods without parameters", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: {
                text: "",
                type: "method_declaration",
                parent: {
                  text: "",
                  type: "class_body",
                  parent: {
                    text: "",
                    type: "class_declaration",
                    childForFieldName: () => ({ text: "TestClass" }),
                  },
                },
              },
            },
          },
          {
            name: "return_type",
            node: {
              text: "void",
            },
          },
        ],
      };

      normaliseClassMethods([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].methods[0].parameters).toEqual([]);
    });

    it("should handle invalid parameter node type", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const mockInvalidParameterNode: MockNode = {
        text: "",
        type: "invalid_type",
        childCount: 0,
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "testMethod",
              parent: {
                text: "",
                type: "method_declaration",
                parent: {
                  text: "",
                  type: "class_body",
                  parent: {
                    text: "",
                    type: "class_declaration",
                    childForFieldName: () => ({ text: "TestClass" }),
                  },
                },
              },
            },
          },
          {
            name: "return_type",
            node: {
              text: "void",
            },
          },
          {
            name: "parameters",
            node: mockInvalidParameterNode,
          },
        ],
      };

      normaliseClassMethods([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].methods[0].parameters).toEqual([]);
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

      const mockParameterNode: MockNode = {
        text: "",
        type: "formal_parameters",
        childCount: 2,
        child: (index: number) => {
          if (index === 0) {
            return {
              text: "",
              type: "formal_parameter",
              childForFieldName: (field: string) => {
                if (field === "type") return { text: "int" };
                if (field === "name") return { text: "value" };
                return null;
              },
            };
          }
          return null;
        },
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "TestClass",
            },
          },
          {
            name: "parameters",
            node: mockParameterNode,
          },
        ],
      };

      normaliseClassConstructors([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].constructors).toHaveLength(1);
      expect(analysis.classes[0].constructors[0]).toEqual({
        parameters: [
          {
            name: "value",
            type: "int",
          },
        ],
        modifiers: [],
      });
    });

    it("should handle constructors without name capture", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "parameters",
            node: {
              text: "",
              type: "formal_parameters",
              childCount: 0,
              parent: {
                text: "",
                type: "constructor_declaration",
                parent: {
                  text: "",
                  type: "class_body",
                  parent: {
                    text: "",
                    type: "class_declaration",
                    childForFieldName: () => ({ text: "TestClass" }),
                  },
                },
              },
            },
          },
        ],
      };

      normaliseClassConstructors([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].constructors).toHaveLength(1);
    });

    it("should handle constructors without parameters", () => {
      const analysis = initEmptyAnalysis();
      // Add a class first
      analysis.classes.push({
        name: "TestClass",
        path: "TestFile.java",
        fields: [],
        methods: [],
        constructors: [],
      });

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

      normaliseClassConstructors([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.classes[0].constructors[0].parameters).toEqual([]);
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

      normaliseInterfaceName([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.interfaces).toHaveLength(1);
      expect(analysis.interfaces[0]).toEqual({
        name: "TestInterface",
        path: "TestFile.java",
        methods: [],
        constants: [],
      });
    });
  });

  describe("normaliseInterfaceMethods", () => {
    it("should extract interface method with parameters", () => {
      const analysis = initEmptyAnalysis();
      // Add an interface first
      analysis.interfaces.push({
        name: "TestInterface",
        path: "TestFile.java",
        methods: [],
        constants: [],
      });

      const mockParameterNode: MockNode = {
        text: "",
        type: "formal_parameters",
        childCount: 2,
        child: (index: number) => {
          if (index === 0) {
            return {
              text: "",
              type: "formal_parameter",
              childForFieldName: (field: string) => {
                if (field === "type") return { text: "String" };
                if (field === "name") return { text: "input" };
                return null;
              },
            };
          }
          return null;
        },
      };

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "process",
              parent: {
                text: "",
                type: "method_declaration",
                parent: {
                  text: "",
                  type: "interface_body",
                  parent: {
                    text: "",
                    type: "interface_declaration",
                    childForFieldName: () => ({ text: "TestInterface" }),
                  },
                },
              },
            },
          },
          {
            name: "return_type",
            node: {
              text: "void",
            },
          },
          {
            name: "parameters",
            node: mockParameterNode,
          },
        ],
      };

      normaliseInterfaceMethods([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.interfaces[0].methods).toHaveLength(1);
      expect(analysis.interfaces[0].methods[0]).toEqual({
        name: "process",
        returnType: "void",
        parameters: [
          {
            name: "input",
            type: "String",
          },
        ],
        modifiers: [],
      });
    });

    it("should handle interface methods without parameters", () => {
      const analysis = initEmptyAnalysis();
      // Add an interface first
      analysis.interfaces.push({
        name: "TestInterface",
        path: "TestFile.java",
        methods: [],
        constants: [],
      });

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "process",
              parent: {
                text: "",
                type: "method_declaration",
                parent: {
                  text: "",
                  type: "interface_body",
                  parent: {
                    text: "",
                    type: "interface_declaration",
                    childForFieldName: () => ({ text: "TestInterface" }),
                  },
                },
              },
            },
          },
          {
            name: "return_type",
            node: {
              text: "void",
            },
          },
        ],
      };

      normaliseInterfaceMethods([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.interfaces[0].methods[0].parameters).toEqual([]);
    });
  });

  describe("normaliseInterfaceConstants", () => {
    it("should extract interface constant", () => {
      const analysis = initEmptyAnalysis();
      // Add an interface first
      analysis.interfaces.push({
        name: "TestInterface",
        path: "TestFile.java",
        methods: [],
        constants: [],
      });

      const mockMatch: MockMatch = {
        captures: [
          {
            name: "name",
            node: {
              text: "MAX_SIZE",
              parent: {
                text: "",
                type: "constant_declaration",
                parent: {
                  text: "",
                  type: "interface_body",
                  parent: {
                    text: "",
                    type: "interface_declaration",
                    childForFieldName: () => ({ text: "TestInterface" }),
                  },
                },
              },
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
        [mockMatch as any],
        "TestFile.java",
        analysis
      );

      expect(analysis.interfaces[0].constants).toHaveLength(1);
      expect(analysis.interfaces[0].constants[0]).toEqual({
        name: "MAX_SIZE",
        type: "int",
        modifiers: [],
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

      normaliseImports([mockMatch as any], "TestFile.java", analysis);

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

      normaliseImports([mockMatch as any], "TestFile.java", analysis);

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

      normaliseImports([mockMatch as any], "TestFile.java", analysis);

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

      normaliseImports([mockMatch as any], "TestFile.java", analysis);
      normaliseImports([mockMatch as any], "TestFile.java", analysis);

      expect(analysis.imports).toHaveLength(1);
    });
  });
});
