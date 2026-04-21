import { z } from "zod";

export const waitlistEmailSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(64, { message: "Email must be at most 64 characters" }),
});

export type WaitlistEmailInput = z.infer<typeof waitlistEmailSchema>;
