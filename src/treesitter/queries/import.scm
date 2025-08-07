(import_declaration
  (modifiers)?
  [
    (scoped_identifier) @import_path
    (identifier)         @import_path
  ]
  (asterisk)? @asterisk
) @import_statement