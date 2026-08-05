import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT / UPDATE a specific review
export async function PUT(request, { params }) {
    try {
        const { id: reviewId } = await params;
        const body = await request.json();
        const { rating, review, reviewerName, reviewerImage, createdAt } = body;

        const updatedReview = await prisma.rating.update({
            where: { id: reviewId },
            data: {
                ...(rating !== undefined && { rating: parseInt(rating) }),
                ...(review !== undefined && { review }),
                ...(reviewerName !== undefined && { reviewerName }),
                ...(reviewerImage !== undefined && { reviewerImage }),
                ...(createdAt && { createdAt: new Date(createdAt) })
            }
        });

        return NextResponse.json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview
        });

    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE a specific review
export async function DELETE(request, { params }) {
    try {
        const { id: reviewId } = await params;

        await prisma.rating.delete({
            where: { id: reviewId }
        });

        return NextResponse.json({ success: true, message: "Review deleted successfully" });

    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
