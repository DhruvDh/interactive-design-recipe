export interface DRAnalysis {
  classes: ClassInfo[];
  interfaces: InterfaceInfo[];
  imports: ImportInfo[];
  methods: MethodInfo[];
  // expandable; leave generic for now
}

export interface ClassInfo {
  name: string;
  path: string;
  fields: FieldInfo[];
  methods: MethodInfo[];
  constructors: ConstructorInfo[];
}

export interface InterfaceInfo {
  name: string;
  path: string;
  methods: MethodInfo[];
  constants: FieldInfo[];
}

export interface FieldInfo {
  name: string;
  type: string;
  modifiers: string[];
}

export interface MethodInfo {
  name: string;
  returnType: string;
  parameters: ParameterInfo[];
  modifiers: string[];
  body?: string;
}

export interface ConstructorInfo {
  parameters: ParameterInfo[];
  modifiers: string[];
  body?: string;
}

export interface ParameterInfo {
  name: string;
  type: string;
}

export interface ImportInfo {
  packageName: string;
  className?: string;
  isStatic: boolean;
  isWildcard: boolean;
}

export interface ParseRequest {
  files: FileListMeta[];
}

export interface ParseResponse {
  ok: true;
  analysis: DRAnalysis;
}

export interface ErrorResponse {
  ok: false;
  error: string;
}

export interface FileListMeta {
  path: string; // webkitRelativePath
  text: string;
  mtime: number;
}
