import { z } from 'zod';

export const userSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    // phone: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    isAdmin: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    emailOTP: z.number().optional(),
    emailOTPExpiry: z.date().optional()
});
