export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed', public errors?: any) {
        super(message, 400, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
        this.name = 'RateLimitError';
    }
}

export function handleApiError(error: unknown) {
    console.error('API Error:', error);

    if (error instanceof AppError) {
        return {
            error: error.message,
            code: error.code,
            ...(error instanceof ValidationError && error.errors ? { errors: error.errors } : {}),
        };
    }

    // Default error response
    return {
        error: 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
    };
}

export function getErrorStatus(error: unknown): number {
    if (error instanceof AppError) {
        return error.statusCode;
    }
    return 500;
}
