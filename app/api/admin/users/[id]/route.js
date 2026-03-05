import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch detailed user info by ID
export async function GET(request, context) {
    try {
        const params = await context.params;
        const id = params.id;

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                Address: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                buyerOrders: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        orderItems: {
                            include: {
                                product: {
                                    select: { name: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Update user or toggle Ban status
export async function PATCH(request, context) {
    try {
        const params = await context.params;
        const id = params.id;
        const body = await request.json();
        const { name, email, role, isBanned } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (isBanned !== undefined) updateData.isBanned = isBanned;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Delete user permanently
export async function DELETE(request, context) {
    try {
        const params = await context.params;
        const id = params.id;

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
