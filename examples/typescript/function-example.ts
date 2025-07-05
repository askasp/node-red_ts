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
