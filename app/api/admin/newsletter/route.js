import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const subscribers = await prisma.newsletterSubscriber.findMany({
            orderBy: { subscribedAt: 'desc' }
        });

        return NextResponse.json({ success: true, data: subscribers });
    } catch (error) {
        console.error("Error fetching newsletter subscribers:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
