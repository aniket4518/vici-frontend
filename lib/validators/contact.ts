import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, { message: "First name must be at most 50 characters" }),
  lastName: z
    .string()
    .max(50, { message: "Last name must be at most 50 characters" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Invalid email format")
    .max(64, { message: "Email must be at most 64 characters" }),
  phone: z
    .string()
    .max(20, { message: "Phone number must be at most 20 characters" })
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .max(100, { message: "Subject must be at most 100 characters" })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, { message: "Message must be at most 2000 characters" }),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
