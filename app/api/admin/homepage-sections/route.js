import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const { identifier, title, productIds } = await request.json();

        if (!identifier || !title) {
            return NextResponse.json({ success: false, message: "Identifier and title are required" }, { status: 400 });
        }

        const section = await prisma.homePageSection.upsert({
            where: { identifier },
            update: {
                title,
                productIds: productIds || [],
            },
            create: {
                identifier,
                title,
                productIds: productIds || [],
            }
        });

        return NextResponse.json({ success: true, message: "Section updated successfully", data: section });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const sections = await prisma.homePageSection.findMany();

        // If empty, return default structure so the admin panel has something to edit
        if (!sections || sections.length === 0) {
            return NextResponse.json({
                success: true,
                data: [
                    { identifier: 'latest_products', title: 'Latest Products', productIds: [] },
                    { identifier: 'best_selling', title: 'Best Selling', productIds: [] },
                    { identifier: 'our_specs', title: 'Our Specifications', productIds: [] }
                ]
            });
        }

        return NextResponse.json({ success: true, data: sections });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
