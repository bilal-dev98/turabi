import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DEFAULT_HIGHLIGHTS = [
    {
        id: '1',
        title: 'Luxury Performance',
        description: 'Experience the thrill of precision engineering',
        imageSrc: 'https://i.pinimg.com/736x/e7/cf/cb/e7cfcbd7a8af10b8839c8d9a3d8eb4ce.jpg',
        href: '/shop',
        order: 0,
        isActive: true,
    },
    {
        id: '2',
        title: 'Elegant Design',
        description: 'Where beauty meets functionality',
        imageSrc: 'https://i.pinimg.com/736x/f4/b0/00/f4b000a6880f7e8d0c677812d789e001.jpg',
        href: '/shop',
        order: 1,
        isActive: true,
    },
    {
        id: '3',
        title: 'Power & Speed',
        description: 'Unleash the true potential of the road',
        imageSrc: 'https://i.pinimg.com/1200x/ae/cf/d7/aecfd72b2439914647ec06d19cb182b5.jpg',
        href: '/shop',
        order: 2,
        isActive: true,
    },
    {
        id: '4',
        title: 'Timeless Craftsmanship',
        description: 'Built with passion, driven by excellence',
        imageSrc: 'https://i.pinimg.com/736x/5d/f7/69/5df7696c4f24b7961c8c72748a355ff8.jpg',
        href: '/shop',
        order: 3,
        isActive: true,
    },
    {
        id: '5',
        title: 'Future of Mobility',
        description: 'Innovation that moves you forward',
        imageSrc: 'https://i.pinimg.com/736x/9c/f2/8b/9cf28b4df4e06e0ca34fbe87f25734b6.jpg',
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
