import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';
import { db } from '@/lib/db';
import { authOptions, requireAuth } from '@/lib/auth';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { aiExplainSchema } from '@/lib/validation';
import { ValidationError, handleApiError, getErrorStatus } from '@/lib/errors';

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const EXPLAIN_PROMPT = `You are an expert web developer and teacher. Explain the provided code in a clear, concise manner.

Guidelines:
- Break down the code into logical sections
- Explain what each part does
- Highlight any best practices or potential improvements
- Keep explanations beginner-friendly but technically accurate
- Use bullet points for clarity
- Mention any accessibility considerations`;

export async function POST(req: NextRequest) {
    try {
        // Require authentication
        const session = await getServerSession(authOptions);
        await requireAuth(session);

        const userId = session!.user.id;

        // Check rate limit
        const identifier = getRateLimitIdentifier(req, userId);
        await checkRateLimit(identifier, 'ai');

        // Validate request body
        const body = await req.json();
        const validationResult = aiExplainSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const { code } = validationResult.data;

        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_FAST || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: EXPLAIN_PROMPT },
                { role: 'user', content: `Explain this code:\n\n${code}` },
            ],
            temperature: 0.5,
        });

        const explanation = response.choices[0]?.message?.content;
        if (!explanation) {
            throw new Error('No response from AI');
        }

        // Track usage (free feature, no credit deduction)
        await db.usage.create({
            data: {
                userId,
                type: 'ai_explain',
                amount: 1,
            },
        });

        return NextResponse.json({ explanation });
    } catch (error) {
        console.error('Code Explanation Error:', error);
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
