import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request, context) {
    try {
        const params = await context.params;
        const id = params.id;

        if (!id) {
            return NextResponse.json({ success: false, message: "Subscriber ID required" }, { status: 400 });
        }

        await prisma.newsletterSubscriber.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Subscriber removed successfully" });
    } catch (error) {
        console.error("Error deleting subscriber:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
