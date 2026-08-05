import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updateData = {};
        if (body.title !== undefined) updateData.title = body.title.trim();
        if (body.description !== undefined) updateData.description = body.description ? body.description.trim() : null;
        if (body.imageSrc !== undefined) updateData.imageSrc = body.imageSrc;
        if (body.href !== undefined) updateData.href = body.href ? body.href.trim() : '/shop';
        if (body.order !== undefined) updateData.order = parseInt(body.order, 10);
        if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

        const updatedItem = await prisma.highlightItem.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, data: updatedItem });
    } catch (error) {
        console.error("Admin highlight PATCH error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        await prisma.highlightItem.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        console.error("Admin highlight DELETE error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
