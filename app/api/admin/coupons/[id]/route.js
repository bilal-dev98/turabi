import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    try {
        const id = params.id; // `id` here behaves as `code` depending on endpoint routing setup

        if (!id) {
            return NextResponse.json({ success: false, message: "Coupon code required" }, { status: 400 });
        }

        await prisma.coupon.delete({
            where: { code: id }
        });

        return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
