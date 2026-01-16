import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, requireAuth } from '@/lib/auth';
import { createProjectSchema } from '@/lib/validation';
import { ValidationError, handleApiError, getErrorStatus } from '@/lib/errors';

// GET - List user's projects
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        await requireAuth(session);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const userId = session!.user.id;

        const [projects, total] = await Promise.all([
            db.project.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    domain: true,
                    published: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            db.project.count({
                where: { userId },
            }),
        ]);

        return NextResponse.json({
            success: true,
            projects,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}

// POST - Create new project
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        await requireAuth(session);

        const body = await req.json();
        const validationResult = createProjectSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const userId = session!.user.id;

        const project = await db.project.create({
            data: {
                ...validationResult.data,
                userId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                domain: true,
                data: true,
                published: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Project created successfully',
                project,
            },
            { status: 201 }
        );
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
