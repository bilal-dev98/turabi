import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 404 });
        }

        if (new Date(coupon.expiresAt) < new Date()) {
            return NextResponse.json({ success: false, message: "This coupon has expired" }, { status: 400 });
        }

        // Return valid coupon
        return NextResponse.json({
            success: true,
            message: "Coupon applied successfully",
            data: {
                code: coupon.code,
                discount: coupon.discount,
                description: coupon.description
            }
        });

    } catch (error) {
        console.error("Error validating coupon:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
