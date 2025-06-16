import { z } from "zod"

const emailSchema = z
    .string()
    .trim()
    .email("Must be a valid email address")
    .max(254, "Email is too long")

export const signupSchema = z.object({
    username: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name can be at most 50 characters"),
    email: emailSchema,
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Za-z]/, "Password must contain a letter")
        .regex(/\d/, "Password must contain a number"),
})

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string(),
})

export type SignupDTO = z.infer<typeof signupSchema>
export type LoginDTO = z.infer<typeof loginSchema>
