import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all reviews for a product
export async function GET(request, { params }) {
    try {
        const productId = params.id;

        const reviews = await prisma.rating.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });

        // Format reviews for frontend: if custom, use reviewerName/Image instead of user
        const formattedReviews = reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            review: r.review,
            createdAt: r.createdAt,
            isCustom: r.isCustom,
            user: {
                name: r.isCustom ? r.reviewerName : (r.user?.name || "Anonymous"),
                image: r.isCustom ? r.reviewerImage : (r.user?.image || null)
            }
        }));

        return NextResponse.json({ success: true, count: formattedReviews.length, data: formattedReviews });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST a new custom review
export async function POST(request, { params }) {
    try {
        const productId = params.id;
        const body = await request.json();

        const { rating, review, reviewerName, reviewerImage, createdAt } = body;

        if (!rating || !review || !reviewerName) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const newReview = await prisma.rating.create({
            data: {
                productId,
                rating: parseInt(rating),
                review,
                reviewerName,
                reviewerImage: reviewerImage || null,
                isCustom: true,
                ...(createdAt && { createdAt: new Date(createdAt) })
            }
        });

        return NextResponse.json({ success: true, message: "Custom review added successfully", data: newReview });

    } catch (error) {
        console.error("Error creating custom review:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
