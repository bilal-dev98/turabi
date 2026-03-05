import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT (Update) a product by ID
export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const body = await request.json();

        // Fields to update
        const { name, description, price, mrp, category, inStock, images } = body;

        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(mrp !== undefined && { mrp: parseFloat(mrp) }),
                ...(category && { category }),
                ...(inStock !== undefined && { inStock: Boolean(inStock) }),
                ...(images && Array.isArray(images) && { images }),
            }
        });

        return NextResponse.json({ success: true, message: "Product updated successfully", data: updatedProduct });

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE a product by ID
export async function DELETE(request, { params }) {
    try {
        const id = params.id;

        await prisma.product.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
