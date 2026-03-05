async function mimicFrontend() {
    try {
        // 1. Create Address
        const addressRes = await fetch('http://localhost:3000/api/address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com',
                street: '123 Test St',
                city: 'Test City',
                state: 'Test State',
                zip: '12345',
                country: 'Test Country',
                phone: '1234567890'
            })
        });
        const addressData = await addressRes.json();
        console.log("Address creation:", addressData);

        if (!addressData.success) {
            console.error("Failed to create address!");
            return;
        }

        const addressId = addressData.data.id;

        // 2. Fetch products to get a valid items payload
        // Actually we can just create a dummy item with the storeId from DB
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const product = await prisma.product.findFirst();
        await prisma.$disconnect();

        if (!product) {
            console.error("No product found to put in cart.");
            return;
        }

        const payload = {
            items: [
                {
                    ...product,
                    quantity: 1
                }
            ],
            totalPrice: product.price,
            addressId: addressId,
            paymentMethod: 'COD'
            // coupon is undefined in this test
        };

        console.log("Sending order payload:", payload);

        // 3. Place Order
        const orderRes = await fetch('http://localhost:3000/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const orderData = await orderRes.json();
        console.log("Order placement result:", orderData);

    } catch (e) {
        console.log("Fetch failed:", e.message);
    }
}
mimicFrontend();
