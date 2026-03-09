import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return Response.json({ success: false, message: "Name, email, and message are required." }, { status: 400 });
        }

        const newMsg = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                message
            }
        });

        return Response.json({ success: true, data: newMsg, message: "Message sent successfully!" });

    } catch (error) {
        console.error("Error creating contact message:", error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
