import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch all users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                buyerOrders: {
                    select: {
                        id: true,
                        total: true,
                        status: true
                    }
                }
            },
            orderBy: {
                joinedAt: 'desc'
            }
        });

        const formattedUsers = users.map(user => {
            // Calculate total orders and spent
            const validOrders = user.buyerOrders?.filter(o => o.status === "DELIVERED" || o.status === "SHIPPED" || o.status === "ORDER_PLACED" || o.status === "PROCESSING") || [];
            const totalSpent = validOrders.reduce((sum, order) => sum + order.total, 0);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
                isBanned: user.isBanned,
                joinedAt: user.joinedAt,
                orders: validOrders.length,
                spent: totalSpent.toFixed(2)
            }
        });

        return NextResponse.json({ success: true, data: formattedUsers });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Create a new user manually
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, role, image } = body;

        if (!name || !email) {
            return NextResponse.json({ success: false, message: "Name and email are required" }, { status: 400 });
        }

        // Generate a random ID since typically Users come from auth providers
        const newId = "user_" + Math.random().toString(36).substr(2, 9);

        const newUser = await prisma.user.create({
            data: {
                id: newId,
                name,
                email,
                role: role || "customer",
                image: image || "",
            }
        });

        return NextResponse.json({ success: true, message: "User created successfully", data: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
