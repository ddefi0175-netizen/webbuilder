// Credit purchase API
import { NextRequest, NextResponse } from 'next/server';
import { CREDIT_PACKS } from '@/config/pricing';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
    try {
        const { packId, userId, successUrl, cancelUrl } = await request.json();

        const pack = CREDIT_PACKS.find(p => p.id === packId);
        if (!pack) {
            return NextResponse.json(
                { error: 'Invalid credit pack' },
                { status: 400 }
            );
        }

        if (!STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Stripe not configured' },
                { status: 500 }
            );
        }

        // Create one-time payment session
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'payment_method_types[]': 'card',
                'line_items[0][price_data][currency]': 'usd',
                'line_items[0][price_data][product_data][name]': `${pack.name} - ${pack.credits} AI Credits`,
                'line_items[0][price_data][product_data][description]': pack.bonusCredits
                    ? `Includes ${pack.bonusCredits} bonus credits!`
                    : `${pack.credits} AI credits for component generation, chat, and more.`,
                'line_items[0][price_data][unit_amount]': (pack.price * 100).toString(),
                'line_items[0][quantity]': '1',
                'mode': 'payment',
                'success_url': successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits=purchased`,
                'cancel_url': cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/credits?canceled=true`,
                'client_reference_id': userId,
                'metadata[pack_id]': packId,
                'metadata[credits]': pack.credits.toString(),
                'metadata[bonus_credits]': (pack.bonusCredits || 0).toString(),
            }),
        });

        const session = await response.json();

        if (session.error) {
            return NextResponse.json(
                { error: session.error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Credit purchase error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment session' },
            { status: 500 }
        );
    }
}
