(interface_declaration
  (interface_body
    (constant_declaration
      (modifiers)? @modifiers
      type: (_) @type
      declarator: (variable_declarator
        name: (identifier) @name
        value: (_)? @value
      )
    )
  )
)