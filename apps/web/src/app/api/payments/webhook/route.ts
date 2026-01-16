// Stripe Webhook Handler
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Verify Stripe webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
    const elements = signature.split(',');
    const timestampElement = elements.find(e => e.startsWith('t='));
    const signatureElement = elements.find(e => e.startsWith('v1='));

    if (!timestampElement || !signatureElement) {
        return false;
    }

    const timestamp = timestampElement.split('=')[1];
    const expectedSignature = signatureElement.split('=')[1];

    const signedPayload = `${timestamp}.${payload}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(signedPayload);
    const computedSignature = hmac.digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(computedSignature)
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature || !STRIPE_WEBHOOK_SECRET) {
            return NextResponse.json(
                { error: 'Missing signature or webhook secret' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        if (!verifySignature(body, signature, STRIPE_WEBHOOK_SECRET)) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionCanceled(event.data.object);
                break;

            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(session: any) {
    const userId = session.client_reference_id;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (!userId) {
        console.error('No user ID in checkout session');
        return;
    }

    try {
        // Get price ID to determine tier
        const priceId = session.line_items?.data[0]?.price?.id;
        
        // Determine tier based on price ID (configure these in your env)
        let tier: 'FREE' | 'PRO' | 'BUSINESS' = 'PRO';
        let credits = 1000;

        if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
            tier = 'PRO';
            credits = 1000;
        } else if (priceId === process.env.STRIPE_PRICE_ID_BUSINESS) {
            tier = 'BUSINESS';
            credits = 10000;
        }

        // Update or create subscription
        await db.subscription.upsert({
            where: { userId },
            update: {
                stripeCustomerId: customerId,
                stripePriceId: priceId,
                tier,
                status: 'ACTIVE',
                creditsRemaining: credits,
                creditsTotal: credits,
            },
            create: {
                userId,
                stripeCustomerId: customerId,
                stripePriceId: priceId,
                tier,
                status: 'ACTIVE',
                creditsRemaining: credits,
                creditsTotal: credits,
            },
        });

        console.log(`Checkout completed for user ${userId}: ${tier} plan`);
    } catch (error) {
        console.error('Error handling checkout completion:', error);
    }
}

async function handleSubscriptionCreated(subscription: any) {
    const customerId = subscription.customer;
    const priceId = subscription.items.data[0]?.price?.id;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    try {
        // Find user by Stripe customer ID
        const existingSubscription = await db.subscription.findUnique({
            where: { stripeCustomerId: customerId },
        });

        if (existingSubscription) {
            await db.subscription.update({
                where: { stripeCustomerId: customerId },
                data: {
                    stripePriceId: priceId,
                    stripeCurrentPeriodEnd: currentPeriodEnd,
                    status: 'ACTIVE',
                },
            });
        }

        console.log('Subscription created:', subscription.id);
    } catch (error) {
        console.error('Error handling subscription creation:', error);
    }
}

async function handleSubscriptionUpdated(subscription: any) {
    const customerId = subscription.customer;
    const status = subscription.status;
    const cancelAtPeriodEnd = subscription.cancel_at_period_end;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    try {
        await db.subscription.update({
            where: { stripeCustomerId: customerId },
            data: {
                status: status.toUpperCase(),
                stripeCurrentPeriodEnd: currentPeriodEnd,
            },
        });

        console.log('Subscription updated:', subscription.id, { status, cancelAtPeriodEnd });
    } catch (error) {
        console.error('Error handling subscription update:', error);
    }
}

async function handleSubscriptionCanceled(subscription: any) {
    const customerId = subscription.customer;

    try {
        // Reset to free tier
        await db.subscription.update({
            where: { stripeCustomerId: customerId },
            data: {
                tier: 'FREE',
                status: 'CANCELED',
                creditsRemaining: 100,
                creditsTotal: 100,
            },
        });

        console.log('Subscription canceled:', subscription.id);
        // TODO: Send cancellation email
    } catch (error) {
        console.error('Error handling subscription cancellation:', error);
    }
}

async function handlePaymentSucceeded(invoice: any) {
    const customerId = invoice.customer;
    const amountPaid = invoice.amount_paid / 100; // Convert from cents

    try {
        // Reset credits for the billing period
        const subscription = await db.subscription.findUnique({
            where: { stripeCustomerId: customerId },
        });

        if (subscription) {
            await db.subscription.update({
                where: { stripeCustomerId: customerId },
                data: {
                    creditsRemaining: subscription.creditsTotal,
                },
            });
        }

        console.log('Payment succeeded:', invoice.id, { amountPaid });
    } catch (error) {
        console.error('Error handling payment success:', error);
    }
}

async function handlePaymentFailed(invoice: any) {
    const customerId = invoice.customer;

    try {
        await db.subscription.update({
            where: { stripeCustomerId: customerId },
            data: {
                status: 'PAST_DUE',
            },
        });

        console.log('Payment failed:', invoice.id);
        // TODO: Send payment failed email
    } catch (error) {
        console.error('Error handling payment failure:', error);
    }
}
