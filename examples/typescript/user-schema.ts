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
