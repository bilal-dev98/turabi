import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DEFAULT_HIGHLIGHTS = [
    {
        title: 'Luxury Performance',
        description: 'Experience the thrill of precision engineering',
        imageSrc: 'https://i.pinimg.com/736x/e7/cf/cb/e7cfcbd7a8af10b8839c8d9a3d8eb4ce.jpg',
        href: '/shop',
        order: 0,
        isActive: true,
    },
    {
        title: 'Elegant Design',
        description: 'Where beauty meets functionality',
        imageSrc: 'https://i.pinimg.com/736x/f4/b0/00/f4b000a6880f7e8d0c677812d789e001.jpg',
        href: '/shop',
        order: 1,
        isActive: true,
    },
    {
        title: 'Power & Speed',
        description: 'Unleash the true potential of the road',
        imageSrc: 'https://i.pinimg.com/1200x/ae/cf/d7/aecfd72b2439914647ec06d19cb182b5.jpg',
        href: '/shop',
        order: 2,
        isActive: true,
    },
    {
        title: 'Timeless Craftsmanship',
        description: 'Built with passion, driven by excellence',
        imageSrc: 'https://i.pinimg.com/736x/5d/f7/69/5df7696c4f24b7961c8c72748a355ff8.jpg',
        href: '/shop',
        order: 3,
        isActive: true,
    },
    {
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
