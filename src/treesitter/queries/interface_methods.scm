(program
  (block_comment)*
  (line_comment)*
  (interface_declaration
    (interface_body
      (method_declaration
        (modifiers)? @modifiers
        type: (_) @return_type
        name: (identifier) @name
        parameters: (_) @parameters
        (throws)? @throws
      )
    )
  )
)