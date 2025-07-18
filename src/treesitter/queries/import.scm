(import_declaration
  (modifiers)? @modifiers
  (
    [
      (scoped_identifier) @import_path
      (identifier) @import_path
    ]
    (asterisk)? @asterisk
  )
) @import_statement