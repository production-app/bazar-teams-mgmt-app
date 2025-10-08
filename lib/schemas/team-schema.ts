import { z } from "zod"

export const teamFormSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .min(3, "Team name must be at least 3 characters")
    .max(100, "Team name must not exceed 100 characters"),
  code: z
    .string()
    .min(1, "Team code is required")
    .min(2, "Team code must be at least 2 characters")
    .max(20, "Team code must not exceed 20 characters")
    .regex(/^[A-Z0-9-]+$/, "Team code must contain only uppercase letters, numbers, and hyphens"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  email: z.string().min(1, "Team email is required").email("Please enter a valid email address"),
  entity: z.string().min(1, "Entity is required"),
  managerName: z
    .string()
    .min(1, "Manager name is required")
    .min(2, "Manager name must be at least 2 characters")
    .max(100, "Manager name must not exceed 100 characters"),
})

export type TeamFormData = z.infer<typeof teamFormSchema>
