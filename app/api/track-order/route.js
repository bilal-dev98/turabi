import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { trackingId } = await request.json();

        if (!trackingId) {
            return NextResponse.json({ success: false, message: "Tracking ID is required" }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { trackingId: trackingId.toUpperCase() },
                    { id: trackingId }
                ]
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: true,
                            }
                        }
                    }
                },
                address: true
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found with the provided Tracking ID." }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error("Error fetching order by tracking ID:", error);
        return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
    }
}
