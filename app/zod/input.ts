import {z} from 'zod';

 
export const InputSchema = z.object({
    email: z.string()
        .max(64, { message: "Email must be at most 64 characters" })
        .refine(val => val.includes("@"), { message: "Email must include @" })
        .refine(val => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val), { message: "Invalid email format" })
});