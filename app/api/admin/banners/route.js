import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - list all banners (direct DB via Prisma, bypasses PostgREST)
export async function GET() {
    try {
        const banners = await prisma.$queryRawUnsafe(
            `SELECT * FROM "AnnouncementBanner" ORDER BY "createdAt" DESC`
        );
        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        console.error("GET banners error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST - create a new banner
export async function POST(request) {
    try {
        const body = await request.json();
        const { message, buttonLabel, buttonAction, couponCode, linkUrl, gradient, textColor, autoActivate } = body;

        if (!message?.trim()) {
            return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
        }

        // Generate a cuid-style ID
        const id = `ban${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
        const grad = gradient || "linear-gradient(to right, #8b5cf6, #9938CA, #E0724A)";
        const color = textColor || "#ffffff";

        if (autoActivate) {
            await prisma.$executeRawUnsafe(`UPDATE "AnnouncementBanner" SET "isActive" = $1`, false);
        }

        await prisma.$executeRawUnsafe(
            `INSERT INTO "AnnouncementBanner" (id, message, "buttonLabel", "buttonAction", "couponCode", "linkUrl", gradient, "textColor", "isActive", "createdAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
            id, message, buttonLabel || null, buttonAction || null,
            couponCode || null, linkUrl || null, grad, color, !!autoActivate
        );

        const rows = await prisma.$queryRawUnsafe(
            `SELECT * FROM "AnnouncementBanner" WHERE id = $1`, id
        );

        return NextResponse.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("POST banner error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
