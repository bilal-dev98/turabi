import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch single order by ID with all relations
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, image: true, email: true } },
                address: true,
                orderItems: {
                    include: {
                        product: { select: { name: true, images: true, category: true } }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        const updated = await prisma.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // OrderItems cascade delete is setup in Prisma, so deleting the order should delete its items automatically
        await prisma.order.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
