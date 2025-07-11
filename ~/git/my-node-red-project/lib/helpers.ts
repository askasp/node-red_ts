/**
 * Helper functions and types for Node-RED TypeScript function nodes
 */

// Basic data processing function
export function processData(data: any): any {
    return { ...data, processed: true, timestamp: Date.now() };
}

// Interface for data schema validation
export interface DataSchema {
    id: string;
    value: number;
    timestamp?: number;
    metadata?: Record<string, any>;
}

// Sample data validation schema
export const userSchema = {
    type: 'object',
    required: true,
    validation: (value: any) => {
        return typeof value === 'object' && value !== null && 'name' in value;
    },
    transform: (value: any) => {
        return {
            ...value,
            timestamp: new Date().toISOString()
        };
    }
};

// Helper function to validate data against DataSchema
export function validateData(data: any): data is DataSchema {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.value === 'number'
    );
}

// Helper function to transform data
export function transformData(data: any, schema: any): any {
    if (schema.transform) {
        return schema.transform(data);
    }
    return data;
}

// Utility function to format messages
export function formatMessage(message: string, ...args: any[]): string {
    return message.replace(/{(\d+)}/g, (match, index) => {
        return typeof args[index] !== 'undefined' ? args[index] : match;
    });
}

// Helper for async operations
export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Type-safe object property getter
export function getProperty<T>(obj: any, path: string): T | undefined {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}

// Logger utility class
export class Logger {
    private prefix: string;
    
    constructor(prefix: string = 'Helper') {
        this.prefix = prefix;
    }
    
    info(message: string, ...args: any[]): void {
        console.log(`[${this.prefix}] ${formatMessage(message, ...args)}`);
    }
    
    warn(message: string, ...args: any[]): void {
        console.warn(`[${this.prefix}] ${formatMessage(message, ...args)}`);
    }
    
    error(message: string, ...args: any[]): void {
        console.error(`[${this.prefix}] ${formatMessage(message, ...args)}`);
    }
}

// Default logger instance
export const logger = new Logger('NodeRED');

// Temperature conversion utilities
export namespace Temperature {
    export function celsiusToFahrenheit(celsius: number): number {
        return (celsius * 9/5) + 32;
    }
    
    export function fahrenheitToCelsius(fahrenheit: number): number {
        return (fahrenheit - 32) * 5/9;
    }
}

// Utility types
export type MessagePayload = string | number | boolean | object | null;

export interface ProcessedMessage {
    originalPayload: MessagePayload;
    processedPayload: MessagePayload;
    processingTime: number;
    metadata: Record<string, any>;
} 