(program
  (block_comment)*
  (line_comment)*
  (class_declaration
    (class_body
      (field_declaration
        (modifiers)? @modifiers
        type: (_) @type
        (variable_declarator
          name: (identifier) @name
          value: (_)? @value
        )
      )
    )
  )
)