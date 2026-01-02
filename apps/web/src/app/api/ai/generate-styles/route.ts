import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
        const { description, componentId } = await req.json();

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

        return NextResponse.json({ styles, componentId });
    } catch (error) {
        console.error('Style Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate styles' },
            { status: 500 }
        );
    }
}
