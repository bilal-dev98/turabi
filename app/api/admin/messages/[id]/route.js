import prisma from "@/lib/prisma";

export async function PATCH(req, props) {
    const params = await props.params;
    try {
        const body = await req.json();
        const { isRead } = body;

        const updated = await prisma.contactMessage.update({
            where: { id: params.id },
            data: { isRead }
        });

        return Response.json({ success: true, data: updated, message: "Message updated" });
    } catch (error) {
        console.error("Error updating contact message:", error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req, props) {
    const params = await props.params;
    try {
        await prisma.contactMessage.delete({
            where: { id: params.id }
        });

        return Response.json({ success: true, message: "Message deleted" });
    } catch (error) {
        console.error("Error deleting contact message:", error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
