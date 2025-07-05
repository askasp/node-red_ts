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

// Additional schemas for demonstration
export declare const productSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodString;
    inStock: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}, {
    id: string;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}>;

export type Product = z.infer<typeof productSchema>;

export declare const orderSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    products: z.ZodArray<z.ZodString>;
    total: z.ZodNumber;
    status: z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    products: string[];
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
}, {
    id: string;
    userId: string;
    products: string[];
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
}>;

export type Order = z.infer<typeof orderSchema>; 