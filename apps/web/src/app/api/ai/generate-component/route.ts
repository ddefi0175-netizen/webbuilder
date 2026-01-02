import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const COMPONENT_PROMPT = `You are an expert web developer. Generate a web component based on the user's description.

Return a JSON object with the following structure:
{
  "type": "section" | "container" | "flex" | "grid" | "heading" | "paragraph" | "button" | "image" | "card" | "hero",
  "name": "ComponentName",
  "props": { ... component-specific props ... },
  "styles": { ... CSS properties in camelCase ... },
  "children": [] // Array of child component objects with same structure
}

Style properties should be in camelCase (e.g., backgroundColor, fontSize, marginTop).
Make the component responsive and accessible.
Use modern design principles.

Example for "a pricing card with title, price, and CTA button":
{
  "type": "card",
  "name": "Pricing Card",
  "props": {},
  "styles": {
    "padding": "32px",
    "borderRadius": "16px",
    "backgroundColor": "#ffffff",
    "boxShadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "textAlign": "center"
  },
  "children": [
    {
      "type": "heading",
      "name": "Plan Name",
      "props": { "text": "Pro Plan", "level": "h3" },
      "styles": { "fontSize": "24px", "fontWeight": "600", "marginBottom": "8px" },
      "children": []
    },
    {
      "type": "paragraph",
      "name": "Price",
      "props": { "text": "$29/month" },
      "styles": { "fontSize": "36px", "fontWeight": "700", "color": "#3b82f6", "marginBottom": "24px" },
      "children": []
    },
    {
      "type": "button",
      "name": "CTA Button",
      "props": { "text": "Get Started" },
      "styles": { "padding": "12px 32px", "backgroundColor": "#3b82f6", "color": "#ffffff", "borderRadius": "8px", "fontWeight": "500" },
      "children": []
    }
  ]
}

Only return valid JSON, no markdown or explanation.`;

export async function POST(req: NextRequest) {
    try {
        const { description } = await req.json();

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_CHAT || 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: COMPONENT_PROMPT },
                { role: 'user', content: `Generate a component for: ${description}` },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }

        const component = JSON.parse(content);

        return NextResponse.json(component);
    } catch (error) {
        console.error('Component Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate component' },
            { status: 500 }
        );
    }
}
