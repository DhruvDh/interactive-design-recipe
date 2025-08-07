; tree-sitter-java import pattern
(import_declaration
  "import"
  ["static"]?            ; matches 0-or-1 literal static
  [
    (scoped_identifier) @import_path
    (identifier)         @import_path
  ]
  (asterisk)?            @asterisk   ; optional *
) @import_statement