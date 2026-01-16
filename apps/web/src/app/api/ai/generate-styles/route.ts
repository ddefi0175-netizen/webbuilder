import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/db';
import { getSession, requireAuth } from '@/lib/auth';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { aiGenerateStylesSchema } from '@/lib/validation';
import { ValidationError, handleApiError, getErrorStatus } from '@/lib/errors';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const STYLES_PROMPT = `You are an expert CSS developer. Generate styles based on the user's description.

Return a JSON object with CSS properties in camelCase format.
Example: { "backgroundColor": "#3b82f6", "padding": "16px", "borderRadius": "8px" }

Guidelines:
- Use modern CSS values
- Consider accessibility (sufficient contrast, readable font sizes)
- Include hover states where appropriate (use ":hover" suffix)
- Make styles responsive-friendly
- Use consistent spacing (multiples of 4px or 8px)

Only return valid JSON, no markdown or explanation.`;

export async function POST(req: NextRequest) {
    try {
        // Require authentication
        const session = await getSession();
        await requireAuth(session);

        const userId = session!.user.id;

        // Get user's subscription
        const subscription = await db.subscription.findUnique({
            where: { userId },
        });

        // Check if user has sufficient credits
        if (!subscription || subscription.creditsRemaining < 2) {
            return NextResponse.json(
                { error: 'Insufficient credits. Please upgrade your plan.' },
                { status: 402 }
            );
        }

        // Check rate limit
        const identifier = getRateLimitIdentifier(req, userId);
        await checkRateLimit(identifier, 'ai');

        // Validate request body
        const body = await req.json();
        const validationResult = aiGenerateStylesSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const { description, componentId } = validationResult.data;

        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_FAST || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: STYLES_PROMPT },
                { role: 'user', content: `Generate styles for: ${description}` },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }

        const styles = JSON.parse(content);

        // Deduct credits and track usage
        await Promise.all([
            db.subscription.update({
                where: { userId },
                data: { creditsRemaining: { decrement: 2 } },
            }),
            db.usage.create({
                data: {
                    userId,
                    type: 'ai_generate_styles',
                    amount: 2,
                    metadata: { description: description.substring(0, 100) },
                },
            }),
        ]);

        return NextResponse.json({ styles, componentId });
    } catch (error) {
        console.error('Style Generation Error:', error);
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
