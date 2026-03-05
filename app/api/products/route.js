import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all products
export async function GET(request) {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                store: true,
                rating: {
                    include: { user: true }
                }
            }
        });

        return NextResponse.json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST a new product
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, description, price, mrp, category, inStock, images, storeId } = body;

        // Basic validation
        if (!name || !price || !category) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Determine Store ID: use provided, or fallback to the first store in DB
        let finalStoreId = storeId;
        if (!finalStoreId) {
            const store = await prisma.store.findFirst();
            if (!store) {
                return NextResponse.json({ success: false, message: "No stores found to associate product" }, { status: 404 });
            }
            finalStoreId = store.id;
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description: description || "",
                price: parseFloat(price),
                mrp: parseFloat(mrp) || parseFloat(price),
                category,
                inStock: inStock === undefined ? true : Boolean(inStock),
                images: Array.isArray(images) ? images : [],
                storeId: finalStoreId,
            }
        });

        return NextResponse.json({ success: true, message: "Product created successfully", data: newProduct });

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
