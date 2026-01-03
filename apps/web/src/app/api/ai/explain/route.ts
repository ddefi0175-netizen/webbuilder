import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
        const { code } = await req.json();

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

        return NextResponse.json({ explanation });
    } catch (error) {
        console.error('Code Explanation Error:', error);
        return NextResponse.json(
            { error: 'Failed to explain code' },
            { status: 500 }
        );
    }
}
