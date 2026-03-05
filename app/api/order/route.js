import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, totalPrice, addressId, addressData, saveAddress, paymentMethod, paymentAccount, coupon } = body;

        // Ensure we have essential data
        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
        }
        if (!addressId && !addressData) {
            return NextResponse.json({ success: false, message: "Address information is required" }, { status: 400 });
        }

        let userId = body.userId;

        if (!userId && addressData) {
            // We create a guest user or attach to existing
            const guestEmail = addressData.email && addressData.email !== 'customer@example.com'
                ? addressData.email
                : `${addressData.phone.replace(/[^0-9]/g, '')}@guest.gocart.com`;

            let user = await prisma.user.findFirst({
                where: { email: guestEmail }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        id: "user_" + Math.random().toString(36).substr(2, 9),
                        name: addressData.name,
                        email: guestEmail,
                        image: "",
                        role: "customer"
                    }
                });
            }
            userId = user.id;
        } else if (!userId) {
            // Fallback
            const user = await prisma.user.findFirst();
            if (!user) {
                return NextResponse.json({ success: false, message: "No users found in database" }, { status: 404 });
            }
            userId = user.id;
        }

        // 1. Resolve Address
        let finalAddressId = addressId;

        if (!finalAddressId && addressData) {
            // Create a new address for the user inline
            const newAddress = await prisma.address.create({
                data: {
                    userId: userId,
                    name: addressData.name,
                    email: addressData.email || 'customer@example.com',
                    street: addressData.street,
                    city: addressData.city,
                    state: addressData.state || 'N/A',
                    zip: String(addressData.zip || '00000'),
                    country: addressData.country || 'PK',
                    phone: String(addressData.phone),
                    landmark: addressData.landmark || null,
                    emergencyContact: addressData.emergencyContact || null,
                }
            });
            finalAddressId = newAddress.id;
        }

        // Group items by storeId
        const itemsByStore = {};
        for (const item of items) {
            if (!itemsByStore[item.storeId]) {
                itemsByStore[item.storeId] = [];
            }
            itemsByStore[item.storeId].push(item);
        }

        // Create an order for each store
        const createdOrders = [];

        // Helper to generate a Tracking ID
        const generateTrackingId = () => {
            return 'GC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        };

        for (const [storeId, storeItems] of Object.entries(itemsByStore)) {

            // Calculate total for this specific store (optional, or just pass full cart total if global)
            // It makes more sense to calculate per store total
            let storeTotal = 0;
            storeItems.forEach(item => {
                storeTotal += item.price * item.quantity;
            });

            // Adjust coupon if necessary (for now apply fully to each, or divide it, but this is a simplified approach)
            let finalStoreTotal = storeTotal;
            let isCouponUsed = false;

            if (coupon && coupon.discount) {
                finalStoreTotal = storeTotal - (coupon.discount / 100 * storeTotal);
                isCouponUsed = true;
            }

            const newOrder = await prisma.order.create({
                data: {
                    trackingId: generateTrackingId(),
                    userId: userId,
                    storeId: storeId,
                    addressId: finalAddressId,
                    total: finalStoreTotal,
                    paymentMethod: paymentMethod,
                    paymentAccount: paymentAccount,
                    isPaid: false, // For COD it's false initially
                    isCouponUsed: isCouponUsed,
                    coupon: coupon ? coupon : {},
                    orderItems: {
                        create: storeItems.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: {
                    orderItems: true
                }
            });

            createdOrders.push(newOrder);
        }

        return NextResponse.json({ success: true, message: "Order placed successfully", data: createdOrders });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
