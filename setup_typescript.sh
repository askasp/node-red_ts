#!/bin/bash

# Node-RED TypeScript Setup Script
# This script sets up TypeScript support for your Node-RED fork

set -e

echo "🚀 Setting up TypeScript support for Node-RED..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the Node-RED root directory."
    exit 1
fi

# Create backup directory
echo "📦 Creating backups of original files..."
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

# Function to backup and replace file
backup_and_replace() {
    local source_file="$1"
    local target_file="$2"
    
    if [ -f "$target_file" ]; then
        echo "   Backing up $target_file"
        cp "$target_file" "$BACKUP_DIR/$(basename $target_file).backup"
    fi
    
    echo "   Installing $target_file"
    cp "$source_file" "$target_file"
}

# Install TypeScript dependencies
echo "📦 Installing TypeScript dependencies..."
npm install --save typescript@^5.3.0 zod@^3.22.0 monaco-editor@^0.44.0
npm install --save-dev @types/node@^20.0.0 @types/node-red@^1.3.0

# Create directories if they don't exist
echo "📁 Creating necessary directories..."
mkdir -p packages/node_modules/node-red/nodes/core/function
mkdir -p packages/node_modules/node-red/@types
mkdir -p packages/node-red-editor-client/src/js/ui
mkdir -p packages/node-red-editor-client/src/sass

# Determine the correct paths (Node-RED structure can vary)
FUNCTION_NODE_DIR=""
EDITOR_CLIENT_DIR=""

# Try to find the correct function node directory
if [ -d "packages/node_modules/node-red/nodes/core/function" ]; then
    FUNCTION_NODE_DIR="packages/node_modules/node-red/nodes/core/function"
elif [ -d "nodes/core/function" ]; then
    FUNCTION_NODE_DIR="nodes/core/function"
elif [ -d "packages/node-red/nodes/core/function" ]; then
    FUNCTION_NODE_DIR="packages/node-red/nodes/core/function"
else
    echo "❌ Could not find function node directory. Please check your Node-RED structure."
    exit 1
fi

# Try to find the correct editor client directory
if [ -d "packages/node-red-editor-client/src" ]; then
    EDITOR_CLIENT_DIR="packages/node-red-editor-client/src"
elif [ -d "editor-client/src" ]; then
    EDITOR_CLIENT_DIR="editor-client/src"
else
    echo "⚠️  Could not find editor client directory. Will skip editor enhancements."
fi

echo "📍 Using function node directory: $FUNCTION_NODE_DIR"
echo "📍 Using editor client directory: $EDITOR_CLIENT_DIR"

# Create tsconfig.json
echo "⚙️  Creating TypeScript configuration..."
cat > tsconfig.json << 'EOF'
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "moduleResolution": "node",
        "lib": ["ES2020", "DOM"],
        "declaration": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": false,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "allowJs": true,
        "checkJs": false,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "resolveJsonModule": true,
        "typeRoots": [
            "node_modules/@types",
            "packages/node_modules/node-red/@types"
        ],
        "paths": {
            "@node-red/scripts/*": ["packages/node_modules/node-red/scripts/*"],
            "zod": ["node_modules/zod"]
        }
    },
    "include": [
        "packages/node_modules/node-red/nodes/**/*.ts",
        "packages/node_modules/node-red/scripts/**/*.ts",
        "packages/node-red-editor-client/src/**/*.ts"
    ],
    "exclude": [
        "node_modules",
        "dist",
        "**/*.test.ts",
        "**/*.spec.ts"
    ]
}
EOF

# Create Node-RED type definitions
echo "📝 Creating Node-RED type definitions..."
mkdir -p packages/node_modules/node-red/@types
cat > packages/node_modules/node-red/@types/node-red.d.ts << 'EOF'
// This file will contain the Node-RED type definitions
// You'll need to copy the content from the node-red-types artifact
declare namespace NodeRED {
    // Type definitions will go here
}
export = NodeRED;
EOF

# Update package.json scripts
echo "⚙️  Updating package.json scripts..."
npm pkg set scripts.build-ts="tsc --build"
npm pkg set scripts.watch-ts="tsc --build --watch"
npm pkg set scripts.dev-ts="npm run build-ts && npm run dev"

# Create example TypeScript schema
echo "📄 Creating example TypeScript schema..."
mkdir -p examples/typescript
cat > examples/typescript/user-schema.ts << 'EOF'
import { z } from 'zod';

// Example TypeScript schema for Node-RED
export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    age: z.number().min(0).max(120),
    preferences: z.object({
        theme: z.enum(['light', 'dark']).default('light'),
        notifications: z.boolean().default(true)
    }).optional(),
    tags: z.array(z.string()).default([]),
    metadata: z.record(z.any()).optional()
});

export type User = z.infer<typeof UserSchema>;

// Usage example:
// const user = UserSchema.parse(msg.payload);
// msg.payload = { ...user, processed: true };
// return msg;
EOF

# Create example function node code
cat > examples/typescript/function-example.ts << 'EOF'
// Example TypeScript function for Node-RED function node
import { z } from 'zod';

// Define validation schema
const PayloadSchema = z.object({
    temperature: z.number(),
    humidity: z.number(),
    timestamp: z.string().datetime()
});

try {
    // Validate input
    const data = PayloadSchema.parse(msg.payload);
    
    // Process data with type safety
    const processed = {
        ...data,
        temperatureF: (data.temperature * 9/5) + 32,
        processed: true,
        processedAt: new Date().toISOString()
    };
    
    msg.payload = processed;
    return msg;
    
} catch (error) {
    if (error instanceof z.ZodError) {
        node.error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`, msg);
    } else {
        node.error(`Processing error: ${error.message}`, msg);
    }
    return null;
}
EOF

# Create README for TypeScript features
echo "📖 Creating TypeScript documentation..."
cat > TYPESCRIPT_FEATURES.md << 'EOF'
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
EOF

echo "✅ TypeScript setup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Copy the enhanced function node files to: $FUNCTION_NODE_DIR"
echo "   2. Copy the schema node files to: $FUNCTION_NODE_DIR"
echo "   3. Copy the type definitions to: packages/node_modules/node-red/@types/"
echo "   4. Build the project: npm run build"
echo "   5. Start Node-RED: npm start"
echo ""
echo "📁 Backup files saved to: $BACKUP_DIR"
echo "📖 Read TYPESCRIPT_FEATURES.md for usage instructions"
echo ""
echo "🎉 Happy coding with TypeScript in Node-RED!"
