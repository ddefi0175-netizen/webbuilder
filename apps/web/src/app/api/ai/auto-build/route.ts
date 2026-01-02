// AI Auto-Builder API
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { websiteType, stylePreset, description, features } = await request.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        const systemPrompt = `You are an expert web developer and designer AI that generates complete website structures. 
You create modern, responsive, accessible websites using a component-based architecture.

Output Format: Return a JSON object with the following structure:
{
  "project": {
    "name": "Project Name",
    "description": "Brief description"
  },
  "pages": [
    {
      "id": "unique-id",
      "name": "Page Name",
      "path": "/path",
      "components": [
        {
          "type": "component-type",
          "props": { ... },
          "styles": { ... },
          "children": []
        }
      ]
    }
  ],
  "globalStyles": {
    "colors": { "primary": "#...", "secondary": "#...", ... },
    "fonts": { "heading": "...", "body": "..." }
  },
  "content": {
    "siteName": "...",
    "tagline": "...",
    "sections": { ... }
  }
}

Available component types: container, section, header, footer, nav, hero, heading, text, button, image, card, grid, flex, form, input, testimonials, pricing, features, cta, faq`;

        const userPrompt = `Create a complete ${websiteType} website with the following requirements:

Style: ${stylePreset}
Description: ${description}
${features?.length ? `Required features: ${features.join(', ')}` : ''}

Generate a full website structure with:
1. A responsive navigation header
2. A compelling hero section
3. Relevant content sections based on the website type
4. Call-to-action sections
5. A professional footer
6. Appropriate content and placeholder text
7. Consistent styling throughout

Return valid JSON only, no markdown.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            max_tokens: 4000,
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('No response from AI');
        }

        const generatedWebsite = JSON.parse(content);

        return NextResponse.json({
            success: true,
            website: generatedWebsite,
            usage: {
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                totalTokens: response.usage?.total_tokens || 0,
            },
        });
    } catch (error) {
        console.error('AI Auto-Builder error:', error);
        return NextResponse.json(
            { error: 'Failed to generate website' },
            { status: 500 }
        );
    }
}
