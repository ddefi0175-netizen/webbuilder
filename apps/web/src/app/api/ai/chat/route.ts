import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';
import { db } from '@/lib/db';
import { authOptions, requireAuth } from '@/lib/auth';
import { checkRateLimit, getRateLimitIdentifier, getRateLimitType } from '@/lib/rate-limit';
import { aiChatSchema } from '@/lib/validation';
import { ValidationError, handleApiError, getErrorStatus, UnauthorizedError } from '@/lib/errors';

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are an expert web developer AI assistant integrated into a visual web builder. 
Your role is to help users create websites by:
1. Generating components based on descriptions
2. Suggesting styles and layouts
3. Writing and explaining code
4. Providing best practices for web development

When generating code, always:
- Use semantic HTML5
- Include accessibility features (ARIA labels, proper heading hierarchy)
- Write clean, modern CSS
- Follow BEM naming conventions for classes
- Make components responsive by default

Be concise but helpful. Format code snippets in markdown code blocks with the appropriate language.`;

export async function POST(req: NextRequest) {
    try {
        // Require authentication
        const session = await getServerSession(authOptions);
        await requireAuth(session);

        const userId = session!.user.id;

        // Get user's subscription for rate limiting
        const subscription = await db.subscription.findUnique({
            where: { userId },
        });

        // Check rate limit based on tier
        const identifier = getRateLimitIdentifier(req, userId);
        const rateLimitType = getRateLimitType(subscription?.tier);
        await checkRateLimit(identifier, 'ai'); // Use AI-specific rate limit

        // Validate request body
        const body = await req.json();
        const validationResult = aiChatSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const { messages, context } = validationResult.data;

        const systemMessage = context?.selectedComponent
            ? `${SYSTEM_PROMPT}\n\nCurrent context: User has selected a ${context.selectedComponent.type} component named "${context.selectedComponent.name}".`
            : SYSTEM_PROMPT;

        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_CHAT || 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: systemMessage },
                ...messages.map((m: any) => ({
                    role: m.role,
                    content: m.content,
                })),
            ],
            stream: true,
        });

        // Track usage
        await db.usage.create({
            data: {
                userId,
                type: 'ai_chat',
                amount: 1,
                metadata: { messageCount: messages.length },
            },
        });

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        controller.enqueue(encoder.encode(content));
                    }
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
            },
        });
    } catch (error) {
        console.error('AI Chat Error:', error);
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
