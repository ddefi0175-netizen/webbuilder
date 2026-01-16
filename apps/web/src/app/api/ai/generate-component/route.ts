import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/db';
import { getSession, requireAuth } from '@/lib/auth';
import { checkRateLimit, getRateLimitIdentifier, getRateLimitType } from '@/lib/rate-limit';
import { aiGenerateComponentSchema } from '@/lib/validation';
import { ValidationError, handleApiError, getErrorStatus } from '@/lib/errors';

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

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
    // Require authentication
    const session = await getSession();
    await requireAuth(session);

    const userId = session!.user.id;

    // Get user's subscription for rate limiting
    const subscription = await db.subscription.findUnique({
      where: { userId },
    });

    // Check if user has sufficient credits
    if (!subscription || subscription.creditsRemaining < 5) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' },
        { status: 402 }
      );
    }

    // Check rate limit based on tier
    const identifier = getRateLimitIdentifier(req, userId);
    await checkRateLimit(identifier, 'ai');

    // Validate request body
    const body = await req.json();
    const validationResult = aiGenerateComponentSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ValidationError('Validation failed', validationResult.error.flatten());
    }

    const { description } = validationResult.data;

    const openai = getOpenAIClient();
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

    // Deduct credits and track usage
    await Promise.all([
      db.subscription.update({
        where: { userId },
        data: { creditsRemaining: { decrement: 5 } },
      }),
      db.usage.create({
        data: {
          userId,
          type: 'ai_generate_component',
          amount: 5,
          metadata: { description: description.substring(0, 100) },
        },
      }),
    ]);

    return NextResponse.json(component);
  } catch (error) {
    console.error('Component Generation Error:', error);
    const status = getErrorStatus(error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status });
  }
}
