// Stripe Webhook Handler
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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
    const subscriptionId = session.subscription;
    const customerId = session.customer;

    // TODO: Update user's subscription in database
    console.log('Checkout completed:', { userId, subscriptionId, customerId });

    // Would typically:
    // 1. Get subscription details from Stripe
    // 2. Determine the plan tier from the price ID
    // 3. Update user's subscription in database
    // 4. Send welcome email
}

async function handleSubscriptionCreated(subscription: any) {
    console.log('Subscription created:', subscription.id);
    // TODO: Create subscription record in database
}

async function handleSubscriptionUpdated(subscription: any) {
    console.log('Subscription updated:', subscription.id);

    // Handle plan changes, status changes, etc.
    const status = subscription.status;
    const cancelAtPeriodEnd = subscription.cancel_at_period_end;

    // TODO: Update subscription in database
}

async function handleSubscriptionCanceled(subscription: any) {
    console.log('Subscription canceled:', subscription.id);

    // TODO: Update user to free plan
    // TODO: Send cancellation email
}

async function handlePaymentSucceeded(invoice: any) {
    console.log('Payment succeeded:', invoice.id);

    // TODO: Update payment history
    // TODO: Reset monthly usage if applicable
}

async function handlePaymentFailed(invoice: any) {
    console.log('Payment failed:', invoice.id);

    // TODO: Send payment failed email
    // TODO: Update subscription status to past_due
}
