import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DEFAULT_SOCIAL_LINKS = [
    { platform: 'facebook', url: 'https://facebook.com/chandjewelry.store', isActive: true },
    { platform: 'instagram', url: 'https://instagram.com/chandjewelry.store', isActive: true },
    { platform: 'whatsapp', url: 'https://wa.me/923255821056', isActive: true },
    { platform: 'twitter', url: 'https://x.com/chandjewelry', isActive: true },
    { platform: 'youtube', url: 'https://youtube.com/@chandjewelry', isActive: true },
    { platform: 'tiktok', url: 'https://tiktok.com/@chandjewelry', isActive: true },
    { platform: 'linkedin', url: 'https://linkedin.com/company/chandjewelry', isActive: true },
    { platform: 'pinterest', url: 'https://pinterest.com/chandjewelry', isActive: true },
];

export async function GET() {
    try {
        let links = await prisma.socialLink.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });

        if (!links || links.length === 0) {
            return NextResponse.json({ success: true, data: DEFAULT_SOCIAL_LINKS });
        }

        return NextResponse.json({ success: true, data: links });
    } catch (error) {
        console.error("Public SocialLinks GET error:", error);
        return NextResponse.json({ success: true, data: DEFAULT_SOCIAL_LINKS });
    }
}
