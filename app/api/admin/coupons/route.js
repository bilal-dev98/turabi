import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json({ success: true, data: coupons });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { code, description, discount, forNewUser, forMember, isPublic, expiresAt } = body;

        // Basic validation
        if (!code || !description || !discount || !expiresAt) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const existingCoupon = await prisma.coupon.findUnique({
            where: { code }
        });

        if (existingCoupon) {
            return NextResponse.json({ success: false, message: "Coupon code already exists" }, { status: 400 });
        }

        const newCoupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discount: parseFloat(discount),
                forNewUser: Boolean(forNewUser),
                forMember: Boolean(forMember),
                isPublic: Boolean(isPublic),
                expiresAt: new Date(expiresAt)
            }
        });

        return NextResponse.json({ success: true, message: "Coupon created successfully", data: newCoupon });
    } catch (error) {
        console.error("Error creating coupon:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
