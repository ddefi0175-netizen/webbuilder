import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token is required'),
});

// User schemas
export const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
});

// Project schemas
export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
    domain: z.string().max(100, 'Domain is too long').optional(),
    data: z.record(z.any()).default({}),
});

export const updateProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name is too long').optional(),
    description: z.string().max(500, 'Description is too long').optional(),
    domain: z.string().max(100, 'Domain is too long').optional(),
    data: z.record(z.any()).optional(),
    published: z.boolean().optional(),
});

// AI schemas
export const aiChatSchema = z.object({
    messages: z.array(
        z.object({
            role: z.enum(['user', 'assistant', 'system']),
            content: z.string().min(1).max(10000),
        })
    ),
    context: z.record(z.any()).optional(),
});

export const aiGenerateComponentSchema = z.object({
    description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
    context: z.record(z.any()).optional(),
});

export const aiGenerateStylesSchema = z.object({
    componentId: z.string().min(1, 'Component ID is required'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
    context: z.record(z.any()).optional(),
});

export const aiExplainSchema = z.object({
    code: z.string().min(1, 'Code is required').max(50000, 'Code is too long'),
    language: z.string().min(1, 'Language is required').optional(),
});

export const aiAutoBuildSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt is too long'),
    context: z.record(z.any()).optional(),
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}

// Helper function to safely validate data
export function safeValidateData<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}
