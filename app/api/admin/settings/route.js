import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const getPrisma = () => {
    if (prisma && prisma.storeSetting) return prisma;
    return new PrismaClient();
};

const DEFAULT_SETTINGS = {
    general: {
        storeName: "Chand Jewelry",
        tagline: "Handcrafted Luxury & Perfection",
        supportEmail: "info@chandjewelry.store",
        phone: "+92 300 1234567",
        timezone: "UTC+5",
        currency: "Rs",
    },
    payment: {
        codEnabled: true,
        bankTransferEnabled: true,
        bankName: "Meezan Bank",
        accountTitle: "Chand Jewelry Store",
        accountNumber: "01020304050607",
        iban: "PK36MEZN0001020304050607",
    },
    shipping: {
        freeShippingMin: "2000",
        defaultRate: "200",
        expressRate: "450",
        internationalEnabled: false,
    },
    profile: {
        name: "Alex Rivera",
        email: "admin@chandjewelry.store",
        role: "Super Admin",
    },
    security: {
        twoFactor: false,
        loginAlerts: true,
        sessionTimeout: "30",
        ipWhitelist: "",
    }
};

export async function GET() {
    try {
        const db = getPrisma();
        let records = [];

        try {
            if (db.storeSetting) {
                records = await db.storeSetting.findMany();
            } else {
                records = await db.$queryRawUnsafe('SELECT key, value FROM "StoreSetting"');
            }
        } catch (e) {
            records = await db.$queryRawUnsafe('SELECT key, value FROM "StoreSetting"').catch(() => []);
        }

        const result = { ...DEFAULT_SETTINGS };

        records.forEach(rec => {
            if (rec.key && result[rec.key]) {
                const val = typeof rec.value === 'string' ? JSON.parse(rec.value) : rec.value;
                result[rec.key] = {
                    ...result[rec.key],
                    ...(typeof val === 'object' && val !== null ? val : {})
                };
            }
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Admin settings GET error:", error);
        return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { section, data } = body;

        if (!section || !data) {
            return NextResponse.json({ success: false, message: "Section and data are required" }, { status: 400 });
        }

        const db = getPrisma();
        let updatedValue = data;

        try {
            if (db.storeSetting) {
                const updated = await db.storeSetting.upsert({
                    where: { key: section },
                    update: { value: data },
                    create: { key: section, value: data }
                });
                updatedValue = updated.value;
            } else {
                const jsonStr = JSON.stringify(data);
                await db.$executeRawUnsafe(
                    'INSERT INTO "StoreSetting" (key, value, "updatedAt") VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, "updatedAt" = NOW()',
                    section,
                    jsonStr
                );
            }
        } catch (dbErr) {
            console.warn("ORM upsert failed, using raw SQL fallback:", dbErr.message);
            const jsonStr = JSON.stringify(data);
            await db.$executeRawUnsafe(
                'INSERT INTO "StoreSetting" (key, value, "updatedAt") VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, "updatedAt" = NOW()',
                section,
                jsonStr
            );
        }

        return NextResponse.json({ success: true, data: updatedValue, section });
    } catch (error) {
        console.error("Admin settings PUT error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
