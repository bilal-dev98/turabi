import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DEFAULT_HIGHLIGHTS = [
    {
        id: '1',
        title: 'Handcrafted Gold Collection',
        description: 'Timeless elegance & royal craftsmanship',
        imageSrc: '/highlights/1.webp',
        href: '/shop',
        order: 0,
        isActive: true,
    },
    {
        id: '2',
        title: 'Royal Diamond Rings',
        description: 'Precision cut solitaires & fine stones',
        imageSrc: '/highlights/2.webp',
        href: '/shop',
        order: 1,
        isActive: true,
    },
    {
        id: '3',
        title: 'Silver Pendant Necklaces',
        description: 'Delicate chains & shimmering drops',
        imageSrc: '/highlights/3.webp',
        href: '/shop',
        order: 2,
        isActive: true,
    },
    {
        id: '4',
        title: 'Signature Bangle Set',
        description: 'Traditional 24k gold polished artistry',
        imageSrc: '/highlights/4.webp',
        href: '/shop',
        order: 3,
        isActive: true,
    },
    {
        id: '5',
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
        const items = await prisma.highlightItem.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });

        if (!items || items.length === 0) {
            return NextResponse.json({ success: true, data: DEFAULT_HIGHLIGHTS });
        }

        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        console.error("Error fetching highlights:", error);
        return NextResponse.json({ success: true, data: DEFAULT_HIGHLIGHTS });
    }
}
