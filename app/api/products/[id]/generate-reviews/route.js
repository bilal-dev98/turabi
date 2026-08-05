import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PAKISTANI_NAMES, REVIEW_DATASET } from "@/lib/reviewLibrary";

// Utility to shuffle an array (Fisher-Yates)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export async function POST(request, { params }) {
    try {
        const { id: productId } = await params;
        const body = await request.json();
        const { count = 5 } = body;

        const numReviews = Math.min(Math.max(parseInt(count) || 1, 1), 100);

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Fetch existing custom reviewer names for this product to avoid duplicates
        const existingReviews = await prisma.rating.findMany({
            where: { productId },
            select: { reviewerName: true, review: true }
        });

        const usedNames = new Set(existingReviews.map(r => r.reviewerName).filter(Boolean));
        const usedTexts = new Set(existingReviews.map(r => r.review).filter(Boolean));

        // Filter available names and reviews
        let availableNames = PAKISTANI_NAMES.filter(name => !usedNames.has(name));
        let availableReviews = REVIEW_DATASET.filter(r => !usedTexts.has(r.text));

        // If depleted, reshuffle full arrays
        if (availableNames.length < numReviews) {
            availableNames = PAKISTANI_NAMES;
        }
        if (availableReviews.length < numReviews) {
            availableReviews = REVIEW_DATASET;
        }

        const shuffledNames = shuffleArray(availableNames);
        const shuffledReviews = shuffleArray(availableReviews);

        // Prepare new review records with randomized dates over the last 30 days
        const newReviewData = [];
        const now = new Date();

        for (let i = 0; i < numReviews; i++) {
            const daysAgo = Math.floor(Math.random() * 30);
            const hoursAgo = Math.floor(Math.random() * 24);
            const reviewDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000));

            newReviewData.push({
                productId,
                rating: shuffledReviews[i % shuffledReviews.length].rating,
                review: shuffledReviews[i % shuffledReviews.length].text,
                reviewerName: shuffledNames[i % shuffledNames.length],
                reviewerImage: null,
                isCustom: true,
                createdAt: reviewDate
            });
        }

        // Create reviews in database
        await prisma.rating.createMany({
            data: newReviewData
        });

        // Fetch newly created reviews to return
        const updatedReviews = await prisma.rating.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' }
        });

        const formatted = updatedReviews.map(r => ({
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

        return NextResponse.json({
            success: true,
            message: `Successfully generated ${numReviews} smart reviews!`,
            count: formatted.length,
            data: formatted
        });

    } catch (error) {
        console.error("Error generating smart reviews:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
