import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.email("Please enter a valid email address."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type SignupSchema = z.infer<typeof signupSchema>;
