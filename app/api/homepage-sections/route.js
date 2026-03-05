import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sections = await prisma.homePageSection.findMany();

        // If empty, return default structure so the frontend always has something
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
