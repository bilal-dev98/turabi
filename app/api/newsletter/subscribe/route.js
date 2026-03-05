import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || !email.includes('@')) {
            return NextResponse.json({ success: false, message: "A valid email address is required" }, { status: 400 });
        }

        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existing) {
            return NextResponse.json({ success: false, message: "This email is already subscribed!" }, { status: 409 });
        }

        await prisma.newsletterSubscriber.create({
            data: { email: email.toLowerCase() }
        });

        return NextResponse.json({ success: true, message: "You've been subscribed successfully! 🎉" });
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
