import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { RateLimitError } from './errors';

// Maximum number of quote removal iterations to prevent infinite loops
const MAX_QUOTE_REMOVAL_ITERATIONS = 10;

/**
 * Clean environment variable values by removing surrounding quotes
 * 
 * This function handles cases where environment variables are accidentally set with
 * quotes included in the value itself (e.g., `"https://url"` instead of `https://url`).
 * 
 * Features:
 * - Removes matching pairs of single or double quotes from both ends
 * - Handles nested/multiple layers of quotes (e.g., `""value""`)
 * - Protects against mismatched quotes (e.g., `"value'` is not modified)
 * - Includes iteration limit to prevent infinite loops on malformed input
 * 
 * @param value - The environment variable value to clean
 * @returns The cleaned value with surrounding quotes removed, or undefined if input is undefined/empty
 * 
 * @example
 * cleanEnvValue('"https://example.com"') // returns: https://example.com
 * cleanEnvValue('""https://example.com""') // returns: https://example.com
 * cleanEnvValue('"value\'') // returns: "value' (mismatched, not modified)
 */
function cleanEnvValue(value: string | undefined): string | undefined {
    if (!value) return value;
    // Remove surrounding quotes (both single and double) that might be in the env var
    // Keep removing matching quote pairs from both ends until there are no more
    let cleaned = value.trim();
    let iterations = 0;
    
    // Only remove quotes if they match on both ends
    while (cleaned.length >= 2 && iterations < MAX_QUOTE_REMOVAL_ITERATIONS) {
        const startsWithDouble = cleaned.startsWith('"');
        const endsWithDouble = cleaned.endsWith('"');
        const startsWithSingle = cleaned.startsWith("'");
        const endsWithSingle = cleaned.endsWith("'");
        
        if ((startsWithDouble && endsWithDouble) || (startsWithSingle && endsWithSingle)) {
            cleaned = cleaned.slice(1, -1);
            iterations++;
        } else {
            break;
        }
    }
    return cleaned;
}

// Initialize Redis client (will be undefined if env vars are not set)
const redisUrl = cleanEnvValue(process.env.UPSTASH_REDIS_REST_URL);
const redisToken = cleanEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis =
    redisUrl && redisToken
        ? new Redis({
              url: redisUrl,
              token: redisToken,
          })
        : null;

// Create rate limiters with different configurations
export const rateLimiters = {
    // Anonymous users: 10 requests per 15 minutes
    anonymous: redis
        ? new Ratelimit({
              redis,
              limiter: Ratelimit.slidingWindow(10, '15 m'),
              analytics: true,
              prefix: '@ratelimit/anonymous',
          })
        : null,

    // Free tier: 50 requests per hour
    free: redis
        ? new Ratelimit({
              redis,
              limiter: Ratelimit.slidingWindow(50, '1 h'),
              analytics: true,
              prefix: '@ratelimit/free',
          })
        : null,

    // Pro tier: 500 requests per hour
    pro: redis
        ? new Ratelimit({
              redis,
              limiter: Ratelimit.slidingWindow(500, '1 h'),
              analytics: true,
              prefix: '@ratelimit/pro',
          })
        : null,

    // Business tier: 5000 requests per hour
    business: redis
        ? new Ratelimit({
              redis,
              limiter: Ratelimit.slidingWindow(5000, '1 h'),
              analytics: true,
              prefix: '@ratelimit/business',
          })
        : null,

    // AI endpoints: More restrictive for expensive operations
    ai: redis
        ? new Ratelimit({
              redis,
              limiter: Ratelimit.slidingWindow(20, '1 h'),
              analytics: true,
              prefix: '@ratelimit/ai',
          })
        : null,

    // Authentication endpoints: Prevent brute force
    auth: redis
        ? new Ratelimit({
              redis,
              limiter: Ratelimit.slidingWindow(5, '15 m'),
              analytics: true,
              prefix: '@ratelimit/auth',
          })
        : null,
};

export type RateLimitType = keyof typeof rateLimiters;

/**
 * Check rate limit for a given identifier and type
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param type - Type of rate limit to apply
 * @returns True if allowed, throws error if rate limited
 */
export async function checkRateLimit(
    identifier: string,
    type: RateLimitType = 'anonymous'
): Promise<boolean> {
    const limiter = rateLimiters[type];

    // If Redis is not configured, skip rate limiting in development
    if (!limiter) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Rate limiting is disabled: Redis not configured');
            return true;
        }
        throw new Error('Rate limiting is not configured');
    }

    const { success, limit, reset, remaining } = await limiter.limit(identifier);

    if (!success) {
        const now = Date.now();
        const retryAfter = Math.ceil((reset - now) / 1000);

        throw new RateLimitError(
            `Rate limit exceeded. Try again in ${retryAfter} seconds. Limit: ${limit}, Remaining: ${remaining}`
        );
    }

    return true;
}

/**
 * Get rate limit identifier from request
 * @param req - Request object
 * @param userId - Optional user ID
 * @returns Identifier for rate limiting
 */
export function getRateLimitIdentifier(
    req: Request,
    userId?: string
): string {
    // Use user ID if available for authenticated requests
    if (userId) {
        return `user:${userId}`;
    }

    // Fall back to IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';

    return `ip:${ip}`;
}

/**
 * Get appropriate rate limit type based on user tier
 * @param tier - User's subscription tier
 * @returns Rate limit type
 */
export function getRateLimitType(tier?: string): RateLimitType {
    switch (tier?.toLowerCase()) {
        case 'pro':
            return 'pro';
        case 'business':
            return 'business';
        case 'free':
            return 'free';
        default:
            return 'anonymous';
    }
}
