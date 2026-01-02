// Stripe Payment Integration
import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Stripe price IDs (would be created in Stripe Dashboard)
const PRICE_IDS = {
    starter_monthly: 'price_starter_monthly',
    starter_annually: 'price_starter_annually',
    pro_monthly: 'price_pro_monthly',
    pro_annually: 'price_pro_annually',
    business_monthly: 'price_business_monthly',
    business_annually: 'price_business_annually',
};

export async function POST(request: NextRequest) {
    try {
        const { priceId, userId, successUrl, cancelUrl } = await request.json();

        if (!STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Stripe not configured' },
                { status: 500 }
            );
        }

        // Create Stripe Checkout Session
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'payment_method_types[]': 'card',
                'line_items[0][price]': priceId,
                'line_items[0][quantity]': '1',
                'mode': 'subscription',
                'success_url': successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
                'cancel_url': cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
                'client_reference_id': userId,
                'subscription_data[trial_period_days]': '14',
                'allow_promotion_codes': 'true',
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
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
