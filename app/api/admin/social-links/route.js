import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const getPrisma = () => {
    if (prisma && prisma.socialLink) return prisma;
    return new PrismaClient();
};

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
        const db = getPrisma();
        let links = [];

        try {
            if (db.socialLink) {
                links = await db.socialLink.findMany({ orderBy: { createdAt: 'asc' } });
            } else {
                links = await db.$queryRawUnsafe('SELECT platform, url, "isActive" FROM "SocialLink" ORDER BY "createdAt" ASC');
            }
        } catch (e) {
            links = await db.$queryRawUnsafe('SELECT platform, url, "isActive" FROM "SocialLink" ORDER BY "createdAt" ASC').catch(() => []);
        }

        // Seed default platforms if database is empty
        if (!links || links.length === 0) {
            for (const item of DEFAULT_PLATFORMS) {
                try {
                    if (db.socialLink) {
                        await db.socialLink.upsert({
                            where: { platform: item.platform },
                            update: {},
                            create: { platform: item.platform, url: item.url, isActive: item.isActive }
                        });
                    } else {
                        await db.$executeRawUnsafe(
                            'INSERT INTO "SocialLink" (id, platform, url, "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, NOW(), NOW()) ON CONFLICT (platform) DO NOTHING',
                            item.platform, item.url, item.isActive
                        );
                    }
                } catch (e) {}
            }
            links = await db.$queryRawUnsafe('SELECT platform, url, "isActive" FROM "SocialLink" ORDER BY "createdAt" ASC').catch(() => DEFAULT_PLATFORMS);
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
        const { links } = body;

        if (!Array.isArray(links)) {
            return NextResponse.json({ success: false, message: "Invalid payload format" }, { status: 400 });
        }

        const db = getPrisma();
        const updatedLinks = [];

        for (const item of links) {
            if (!item.platform) continue;
            const pKey = item.platform.toLowerCase();
            const urlVal = item.url ? item.url.trim() : "";
            const activeVal = typeof item.isActive === 'boolean' ? item.isActive : true;

            try {
                if (db.socialLink) {
                    const updated = await db.socialLink.upsert({
                        where: { platform: pKey },
                        update: { url: urlVal, isActive: activeVal },
                        create: { platform: pKey, url: urlVal, isActive: activeVal }
                    });
                    updatedLinks.push(updated);
                } else {
                    await db.$executeRawUnsafe(
                        'INSERT INTO "SocialLink" (id, platform, url, "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, NOW(), NOW()) ON CONFLICT (platform) DO UPDATE SET url = $2, "isActive" = $3, "updatedAt" = NOW()',
                        pKey, urlVal, activeVal
                    );
                    updatedLinks.push({ platform: pKey, url: urlVal, isActive: activeVal });
                }
            } catch (err) {
                await db.$executeRawUnsafe(
                    'INSERT INTO "SocialLink" (id, platform, url, "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, NOW(), NOW()) ON CONFLICT (platform) DO UPDATE SET url = $2, "isActive" = $3, "updatedAt" = NOW()',
                    pKey, urlVal, activeVal
                ).catch(() => {});
                updatedLinks.push({ platform: pKey, url: urlVal, isActive: activeVal });
            }
        }

        return NextResponse.json({ success: true, data: updatedLinks });
    } catch (error) {
        console.error("Admin social links PUT error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
