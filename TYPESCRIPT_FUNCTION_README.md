# TypeScript Function Node with Zod Schemas

This guide explains how to use TypeScript mode in Node-RED function nodes with Zod schema validation.

## Setup

### 1. Install Zod in your Node-RED user directory

```bash
cd ~/.node-red
npm install zod
```

### 2. Create your schema definitions

Create a file `dist/schemas.d.ts` in your Node-RED project:

```typescript
import { z } from "zod";

export declare const userSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    age: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    age: number;
}, {
    name: string;
    email: string;
    age: number;
}>;

export type User = z.infer<typeof userSchema>;
```

### 3. Host your schema file

Make sure your `dist/schemas.d.ts` file is accessible at `/typed/schemas.d.ts` in your Node-RED server.

**Note**: The Zod types will be automatically loaded from the installed `zod` package when you add it as an external module in your function node.

## Usage in Function Node

### 1. Enable TypeScript Mode

1. Open a function node
2. Check the "TypeScript Mode" checkbox in the Setup tab
3. Switch to the Function tab

### 2. Add Zod as External Module

1. In the Setup tab, under "Modules", add:
   - **Module**: `zod`
   - **Import as**: `zod`

### 3. Use Schemas in Your Code

```typescript
import { userSchema } from "schemas";

// Now you have full TypeScript support!
const result = userSchema.safeParse(msg.payload);

if (result.success) {
    // result.data is fully typed as User
    msg.payload = result.data;
    return msg;
} else {
    // result.error contains validation errors
    msg.error = result.error.format();
    return null;
}
```

## Features

- ✅ Full TypeScript IntelliSense for Zod schemas
- ✅ Type-safe schema validation
- ✅ Auto-completion for schema methods like `safeParse`, `parse`, etc.
- ✅ Proper error handling with typed error objects
- ✅ Integration with Node-RED's external modules system

## Troubleshooting

### Issue: `safeParse` shows as `any`

**Solution**: Make sure you have:
1. TypeScript mode enabled in the function node
2. Zod added as an external module
3. Your schema file is accessible at `/typed/schemas.d.ts`

### Issue: Module not found errors

**Solution**: 
1. Verify Zod is installed in your Node-RED user directory
2. Check that the module is properly added in the function node's Setup tab
3. Restart Node-RED after installing new modules

### Issue: TypeScript compilation errors

**Solution**:
1. Check that your schema file syntax is correct
2. Ensure all imports in your schema file are valid
3. Verify the schema file is being served correctly

## Example: Complete Function Node

```typescript
import { userSchema } from "schemas";

// Validate incoming payload
const validation = userSchema.safeParse(msg.payload);

if (validation.success) {
    // TypeScript knows this is a User object
    const user = validation.data;
    
    // Full IntelliSense support
    msg.payload = {
        name: user.name,
        email: user.email,
        age: user.age,
        isValid: true
    };
    
    return msg;
} else {
    // Handle validation errors
    msg.error = validation.error.format();
    msg.statusCode = 400;
    
    return null;
}
```

## Advanced Usage

### Custom Schema Validation

```typescript
import { z } from "zod";
import { userSchema } from "schemas";

// Create a custom schema that extends userSchema
const extendedUserSchema = userSchema.extend({
    role: z.enum(["admin", "user", "guest"]),
    preferences: z.object({
        theme: z.string().optional(),
        notifications: z.boolean().default(true)
    }).optional()
});

const result = extendedUserSchema.safeParse(msg.payload);
```

### Schema Composition

```typescript
import { z } from "zod";
import { userSchema } from "schemas";

// Create a response schema
const userResponseSchema = z.object({
    success: z.boolean(),
    data: userSchema.optional(),
    error: z.string().optional()
});

// Use in your function
const response = userResponseSchema.parse({
    success: true,
    data: msg.payload
});
```

## Notes

- The TypeScript support is provided by Monaco Editor
- Schema files are loaded dynamically when the function node editor opens
- Changes to schema files require refreshing the function node editor
- All Zod features are supported including validation, transformation, and error handling 