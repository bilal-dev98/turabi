import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH - activate/deactivate/update a banner
export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (body.isActive === true) {
            // Step 1: Deactivate ALL banners (parameterized boolean — more reliable than SQL literal)
            await prisma.$executeRawUnsafe(
                `UPDATE "AnnouncementBanner" SET "isActive" = $1`,
                false
            );
            // Step 2: Activate the specific banner
            await prisma.$executeRawUnsafe(
                `UPDATE "AnnouncementBanner" SET "isActive" = $1 WHERE id = $2`,
                true, id
            );
        } else if (body.isActive === false) {
            await prisma.$executeRawUnsafe(
                `UPDATE "AnnouncementBanner" SET "isActive" = $1 WHERE id = $2`,
                false, id
            );
        } else {
            // Full edit
            const { message, buttonLabel, buttonAction, couponCode, linkUrl, gradient, textColor } = body;
            await prisma.$executeRawUnsafe(
                `UPDATE "AnnouncementBanner"
                 SET message = $1, "buttonLabel" = $2, "buttonAction" = $3,
                     "couponCode" = $4, "linkUrl" = $5, gradient = $6, "textColor" = $7
                 WHERE id = $8`,
                message, buttonLabel || null, buttonAction || null,
                couponCode || null, linkUrl || null, gradient, textColor || "#ffffff", id
            );
        }

        const rows = await prisma.$queryRawUnsafe(
            `SELECT * FROM "AnnouncementBanner" WHERE id = $1`, id
        );
        return NextResponse.json({ success: true, data: rows[0] ?? null });
    } catch (error) {
        console.error("PATCH banner error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE - remove a banner
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Check if the banner being deleted is currently active
        const bannerToDelete = await prisma.$queryRawUnsafe(
            `SELECT * FROM "AnnouncementBanner" WHERE id = $1`, id
        );

        const wasActive = bannerToDelete?.[0]?.isActive === true || bannerToDelete?.[0]?.isactive === true;

        await prisma.$executeRawUnsafe(`DELETE FROM "AnnouncementBanner" WHERE id = $1`, id);

        // If active banner was deleted, fallback to activating the newest remaining banner
        if (wasActive) {
            const newest = await prisma.$queryRawUnsafe(
                `SELECT id FROM "AnnouncementBanner" ORDER BY "createdAt" DESC LIMIT 1`
            );
            if (newest?.[0]?.id) {
                await prisma.$executeRawUnsafe(
                    `UPDATE "AnnouncementBanner" SET "isActive" = $1 WHERE id = $2`,
                    true, newest[0].id
                );
            }
        }

        return NextResponse.json({ success: true, message: "Banner deleted" });
    } catch (error) {
        console.error("DELETE banner error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
