import prisma from "@/lib/prisma";

export async function GET(req) {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return Response.json({ success: true, data: messages });
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
