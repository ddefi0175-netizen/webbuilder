// AI Auto-Builder API
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/db';
import { getSession, requireAuth } from '@/lib/auth';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { aiAutoBuildSchema } from '@/lib/validation';
import { ValidationError, handleApiError, getErrorStatus } from '@/lib/errors';

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await getSession();
    await requireAuth(session);

    const userId = session!.user.id;

    // Get user's subscription
    const subscription = await db.subscription.findUnique({
      where: { userId },
    });

    // Check if user has sufficient credits (auto-build is expensive)
    if (!subscription || subscription.creditsRemaining < 20) {
      return NextResponse.json(
        { error: 'Insufficient credits. Auto-build requires 20 credits. Please upgrade your plan.' },
        { status: 402 }
      );
    }

    // Check rate limit
    const identifier = getRateLimitIdentifier(request, userId);
    await checkRateLimit(identifier, 'ai');

    // Validate request body
    const body = await request.json();
    const validationResult = aiAutoBuildSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ValidationError('Validation failed', validationResult.error.flatten());
    }

    const { prompt } = validationResult.data;
    const { websiteType, stylePreset, description, features } = body;

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

    const openai = getOpenAIClient();
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

    // Deduct credits and track usage
    await Promise.all([
      db.subscription.update({
        where: { userId },
        data: { creditsRemaining: { decrement: 20 } },
      }),
      db.usage.create({
        data: {
          userId,
          type: 'ai_auto_build',
          amount: 20,
          metadata: {
            websiteType,
            stylePreset,
            tokensUsed: response.usage?.total_tokens || 0,
          },
        },
      }),
    ]);

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
    const status = getErrorStatus(error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status });
  }
}
