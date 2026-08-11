import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DEFAULT_HIGHLIGHTS = [
    {
        title: 'Handcrafted Gold Collection',
        description: 'Timeless elegance & royal craftsmanship',
        imageSrc: '/highlights/1.webp',
        href: '/shop',
        order: 0,
        isActive: true,
    },
    {
        title: 'Royal Diamond Rings',
        description: 'Precision cut solitaires & fine stones',
        imageSrc: '/highlights/2.webp',
        href: '/shop',
        order: 1,
        isActive: true,
    },
    {
        title: 'Silver Pendant Necklaces',
        description: 'Delicate chains & shimmering drops',
        imageSrc: '/highlights/3.webp',
        href: '/shop',
        order: 2,
        isActive: true,
    },
    {
        title: 'Signature Bangle Set',
        description: 'Traditional 24k gold polished artistry',
        imageSrc: '/highlights/4.webp',
        href: '/shop',
        order: 3,
        isActive: true,
    },
    {
        title: 'Luxury Wristwatches',
        description: 'Sleek gold dials with sapphire glass',
        imageSrc: '/highlights/5.webp',
        href: '/shop',
        order: 4,
        isActive: true,
    },
];

export async function GET() {
    try {
        let items = await prisma.highlightItem.findMany({
            orderBy: { order: 'asc' }
        });

        // Seed default items if table is empty
        if (!items || items.length === 0) {
            await prisma.highlightItem.createMany({
                data: DEFAULT_HIGHLIGHTS
            });
            items = await prisma.highlightItem.findMany({
                orderBy: { order: 'asc' }
            });
        }

        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        console.error("Admin highlights GET error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { title, description, imageSrc, href, order, isActive } = body;

        if (!title || !imageSrc) {
            return NextResponse.json(
                { success: false, message: "Title and Image are required" },
                { status: 400 }
            );
        }

        const count = await prisma.highlightItem.count();

        const newItem = await prisma.highlightItem.create({
            data: {
                title: title.trim(),
                description: description ? description.trim() : null,
                imageSrc,
                href: href ? href.trim() : '/shop',
                order: typeof order === 'number' ? order : count,
                isActive: typeof isActive === 'boolean' ? isActive : true,
            }
        });

        return NextResponse.json({ success: true, data: newItem });
    } catch (error) {
        console.error("Admin highlights POST error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
