import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create test users
    const password = await bcrypt.hash('Test1234!', 12);

    // Create admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@webbuilder.dev' },
        update: {},
        create: {
            email: 'admin@webbuilder.dev',
            name: 'Admin User',
            password,
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    });

    console.log('✅ Created admin user:', adminUser.email);

    // Create free tier user
    const freeUser = await prisma.user.upsert({
        where: { email: 'user@webbuilder.dev' },
        update: {},
        create: {
            email: 'user@webbuilder.dev',
            name: 'Test User',
            password,
            role: 'USER',
            emailVerified: new Date(),
        },
    });

    console.log('✅ Created test user:', freeUser.email);

    // Create subscriptions
    await prisma.subscription.upsert({
        where: { userId: adminUser.id },
        update: {},
        create: {
            userId: adminUser.id,
            tier: 'BUSINESS',
            status: 'ACTIVE',
            creditsRemaining: 10000,
            creditsTotal: 10000,
        },
    });

    await prisma.subscription.upsert({
        where: { userId: freeUser.id },
        update: {},
        create: {
            userId: freeUser.id,
            tier: 'FREE',
            status: 'ACTIVE',
            creditsRemaining: 100,
            creditsTotal: 100,
        },
    });

    console.log('✅ Created subscriptions');

    // Create sample projects
    const project1 = await prisma.project.create({
        data: {
            userId: freeUser.id,
            name: 'My First Website',
            description: 'A sample landing page',
            data: {
                pages: [
                    {
                        id: 'home',
                        name: 'Home',
                        path: '/',
                        components: [],
                    },
                ],
            },
            published: false,
        },
    });

    console.log('✅ Created sample project:', project1.name);

    // Create some usage records
    await prisma.usage.createMany({
        data: [
            {
                userId: freeUser.id,
                type: 'ai_chat',
                amount: 1,
            },
            {
                userId: freeUser.id,
                type: 'ai_generate_component',
                amount: 5,
            },
        ],
    });

    console.log('✅ Created usage records');

    console.log('🎉 Database seed completed successfully!');
    console.log('\n📋 Test credentials:');
    console.log('Admin: admin@webbuilder.dev / Test1234!');
    console.log('User: user@webbuilder.dev / Test1234!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
