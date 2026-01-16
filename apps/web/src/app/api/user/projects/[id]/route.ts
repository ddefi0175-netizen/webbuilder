import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, requireAuth } from '@/lib/auth';
import { updateProjectSchema } from '@/lib/validation';
import { ValidationError, NotFoundError, ForbiddenError, handleApiError, getErrorStatus } from '@/lib/errors';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Get specific project
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        await requireAuth(session);

        const project = await db.project.findUnique({
            where: { id: params.id },
        });

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check if user owns the project
        if (project.userId !== session!.user.id) {
            throw new ForbiddenError('You do not have access to this project');
        }

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}

// PATCH - Update project
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        await requireAuth(session);

        const body = await req.json();
        const validationResult = updateProjectSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        // Check if project exists and user owns it
        const existingProject = await db.project.findUnique({
            where: { id: params.id },
        });

        if (!existingProject) {
            throw new NotFoundError('Project not found');
        }

        if (existingProject.userId !== session!.user.id) {
            throw new ForbiddenError('You do not have access to this project');
        }

        // Update project
        const updatedProject = await db.project.update({
            where: { id: params.id },
            data: validationResult.data,
        });

        return NextResponse.json({
            success: true,
            message: 'Project updated successfully',
            project: updatedProject,
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}

// DELETE - Delete project
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        await requireAuth(session);

        // Check if project exists and user owns it
        const existingProject = await db.project.findUnique({
            where: { id: params.id },
        });

        if (!existingProject) {
            throw new NotFoundError('Project not found');
        }

        if (existingProject.userId !== session!.user.id) {
            throw new ForbiddenError('You do not have access to this project');
        }

        // Delete project
        await db.project.delete({
            where: { id: params.id },
        });

        return NextResponse.json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
