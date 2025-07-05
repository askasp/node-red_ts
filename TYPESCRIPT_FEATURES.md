# Node-RED TypeScript Support

This Node-RED fork includes enhanced TypeScript support for function nodes and schema validation.

## Features

### 1. TypeScript Function Nodes
- Full TypeScript syntax support
- Real-time type checking
- IntelliSense and autocomplete
- Import support for Zod and custom modules

### 2. Schema Validation Nodes
- Define reusable Zod schemas
- Type-safe validation
- Global schema sharing
- Runtime validation with detailed error reporting

### 3. Enhanced Editor
- Monaco editor integration
- TypeScript language service
- Error highlighting
- Import suggestions

## Usage

### TypeScript Function Node
1. Create a function node
2. Select "TypeScript" from the language dropdown
3. Write TypeScript code with full type support

### Schema Node
1. Add a schema node to your flow
2. Define your Zod schema in TypeScript
3. Enable "Export globally" to share with other nodes
4. Connect to validate message payloads

## Examples

See the `examples/typescript/` directory for:
- User schema definition
- Function node examples
- Validation patterns

## Development

```bash
# Build TypeScript files
npm run build-ts

# Watch for changes
npm run watch-ts

# Development with TypeScript
npm run dev-ts
```

## Type Definitions

Node-RED type definitions are available at:
`packages/node_modules/node-red/@types/node-red.d.ts`

## Troubleshooting

1. **TypeScript not available**: Install typescript package
2. **Zod not available**: Install zod package
3. **Monaco not loading**: Check browser console for errors

For more information, see the Node-RED documentation.
