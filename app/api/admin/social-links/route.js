import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DEFAULT_PLATFORMS = [
    { platform: 'facebook', name: 'Facebook', url: 'https://facebook.com/chandjewelry.store', isActive: true },
    { platform: 'instagram', name: 'Instagram', url: 'https://instagram.com/chandjewelry.store', isActive: true },
    { platform: 'whatsapp', name: 'WhatsApp', url: 'https://wa.me/923255821056', isActive: true },
    { platform: 'twitter', name: 'Twitter / X', url: 'https://x.com/chandjewelry', isActive: true },
    { platform: 'youtube', name: 'YouTube', url: 'https://youtube.com/@chandjewelry', isActive: true },
    { platform: 'tiktok', name: 'TikTok', url: 'https://tiktok.com/@chandjewelry', isActive: true },
    { platform: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/chandjewelry', isActive: true },
    { platform: 'pinterest', name: 'Pinterest', url: 'https://pinterest.com/chandjewelry', isActive: true },
];

export async function GET() {
    try {
        let links = await prisma.socialLink.findMany({
            orderBy: { createdAt: 'asc' }
        });

        // Seed default platforms if database is empty
        if (!links || links.length === 0) {
            for (const item of DEFAULT_PLATFORMS) {
                await prisma.socialLink.upsert({
                    where: { platform: item.platform },
                    update: {},
                    create: {
                        platform: item.platform,
                        url: item.url,
                        isActive: item.isActive,
                    }
                });
            }
            links = await prisma.socialLink.findMany({
                orderBy: { createdAt: 'asc' }
            });
        }

        return NextResponse.json({ success: true, data: links });
    } catch (error) {
        console.error("Admin social links GET error:", error);
        return NextResponse.json({ success: true, data: DEFAULT_PLATFORMS });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { links } = body; // Array of { platform, url, isActive }

        if (!Array.isArray(links)) {
            return NextResponse.json({ success: false, message: "Invalid payload format" }, { status: 400 });
        }

        const updatedLinks = [];

        for (const item of links) {
            if (!item.platform) continue;
            const updated = await prisma.socialLink.upsert({
                where: { platform: item.platform.toLowerCase() },
                update: {
                    url: item.url ? item.url.trim() : "",
                    isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
                },
                create: {
                    platform: item.platform.toLowerCase(),
                    url: item.url ? item.url.trim() : "",
                    isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
                }
            });
            updatedLinks.push(updated);
        }

        return NextResponse.json({ success: true, data: updatedLinks });
    } catch (error) {
        console.error("Admin social links PUT error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
