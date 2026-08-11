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
        const records = await db.storeSetting.findMany();

        const result = { ...DEFAULT_SETTINGS };

        records.forEach(rec => {
            if (rec.key && result[rec.key]) {
                result[rec.key] = {
                    ...result[rec.key],
                    ...(typeof rec.value === 'object' ? rec.value : {})
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
        const body = await request.json(); // { section: 'general'|'payment'|'shipping'|'profile'|'security', data: { ... } }
        const { section, data } = body;

        if (!section || !data) {
            return NextResponse.json({ success: false, message: "Section and data are required" }, { status: 400 });
        }

        const db = getPrisma();

        const updated = await db.storeSetting.upsert({
            where: { key: section },
            update: { value: data },
            create: { key: section, value: data }
        });

        return NextResponse.json({ success: true, data: updated.value, section });
    } catch (error) {
        console.error("Admin settings PUT error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
