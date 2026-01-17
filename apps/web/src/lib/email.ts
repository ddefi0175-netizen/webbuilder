import nodemailer from 'nodemailer';

// Create reusable transporter
function createTransporter() {
    // In development, use ethereal.email for testing
    // In production, configure with real SMTP credentials
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
        console.warn('No SMTP configuration found. Emails will be logged to console in development.');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
    const transporter = createTransporter();

    if (!transporter) {
        // In development without SMTP, log to console
        console.log('\n📧 Email (Development Mode):');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('HTML:', html);
        console.log('Text:', text || 'N/A');
        console.log('\n');
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"WebBuilder" <noreply@webbuilder.dev>',
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
        });

        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Email templates
export function getVerificationEmailHtml(verificationUrl: string, name?: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #3b82f6;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Verify Your Email</h1>
                <p>Hi${name ? ` ${name}` : ''},</p>
                <p>Thank you for signing up for WebBuilder! Please verify your email address by clicking the button below:</p>
                <a href="${verificationUrl}" class="button">Verify Email</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <div class="footer">
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                    <p>&copy; ${new Date().getFullYear()} WebBuilder. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export function getPasswordResetEmailHtml(resetUrl: string, name?: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #3b82f6;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Reset Your Password</h1>
                <p>Hi${name ? ` ${name}` : ''},</p>
                <p>You requested to reset your password for your WebBuilder account. Click the button below to create a new password:</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p>This link will expire in 1 hour.</p>
                <div class="footer">
                    <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
                    <p>&copy; ${new Date().getFullYear()} WebBuilder. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export function getSubscriptionCancelledEmailHtml(name?: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Subscription Cancelled</h1>
                <p>Hi${name ? ` ${name}` : ''},</p>
                <p>Your WebBuilder subscription has been cancelled. You will continue to have access to premium features until the end of your current billing period.</p>
                <p>We're sorry to see you go! If you change your mind, you can reactivate your subscription at any time from your account settings.</p>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} WebBuilder. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export function getPaymentFailedEmailHtml(name?: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #3b82f6;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Payment Failed</h1>
                <p>Hi${name ? ` ${name}` : ''},</p>
                <p>We were unable to process your payment for your WebBuilder subscription. Please update your payment method to continue using premium features.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">Update Payment Method</a>
                <p>If you have any questions, please don't hesitate to contact our support team.</p>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} WebBuilder. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
