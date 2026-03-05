import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Public endpoint — returns the active banner
// Fetches all and filters in JS to handle any boolean representation from the DB driver
export async function GET() {
    try {
        const rows = await prisma.$queryRawUnsafe(
            `SELECT * FROM "AnnouncementBanner" ORDER BY "createdAt" DESC`
        );

        // Handle both camelCase (isActive) and lowercase (isactive) column names
        // Handle boolean true, number 1, or string 'true'/'t' representations
        const banner = (rows ?? []).find(r => {
            const v = r.isActive ?? r.isactive;
            return v === true || v === 1 || v === 'true' || v === 't';
        }) ?? null;

        if (!banner) {
            console.warn("[Banner API] Warning: No active banner found in database.");
            return NextResponse.json({ success: true, data: null, message: "No active banner exists" });
        }

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        return NextResponse.json({ success: false, data: null, error: error.message });
    }
}
