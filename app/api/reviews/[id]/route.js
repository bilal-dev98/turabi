import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE a specific review
export async function DELETE(request, { params }) {
    try {
        const reviewId = params.id;

        await prisma.rating.delete({
            where: { id: reviewId }
        });

        return NextResponse.json({ success: true, message: "Review deleted successfully" });

    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
