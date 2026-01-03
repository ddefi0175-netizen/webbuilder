import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
        const { messages, context } = await req.json();

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
        return NextResponse.json(
            { error: 'Failed to process AI request' },
            { status: 500 }
        );
    }
}
