import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        let userId = body.userId;
        if (!userId) {
            const user = await prisma.user.findFirst();
            if (!user) {
                return NextResponse.json({ success: false, message: "No users found in database" }, { status: 404 });
            }
            userId = user.id;
        }

        const address = await prisma.address.create({
            data: {
                userId: userId,
                name: body.name,
                email: body.email,
                street: body.street,
                city: body.city,
                state: body.state,
                zip: String(body.zip),
                country: body.country,
                phone: String(body.phone),
                landmark: body.landmark,
                emergencyContact: body.emergencyContact,
            }
        });

        return NextResponse.json({ success: true, message: "Address added successfully", data: address });

    } catch (error) {
        console.error("Error creating address:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
