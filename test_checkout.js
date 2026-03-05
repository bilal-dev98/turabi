const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCheckout() {
    try {
        console.log("Fetching test data...");
        const user = await prisma.user.findFirst();
        const store = await prisma.store.findFirst();
        const address = await prisma.address.findFirst();
        const product = await prisma.product.findFirst({
            where: { storeId: store?.id }
        });

        if (!user || !store || !address || !product) {
            console.error("Missing test data. Exiting.");
            console.error({ user: !!user, store: !!store, address: !!address, product: !!product });
            return;
        }

        const payload = {
            items: [
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 2,
                    storeId: store.id
                }
            ],
            totalPrice: product.price * 2,
            addressId: address.id,
            paymentMethod: "COD"
        };

        console.log("Sending POST request to /api/order...");
        const response = await fetch('http://localhost:3000/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", JSON.stringify(data, null, 2));

        if (data.success) {
            console.log("\nSuccess! Verifying in database...");
            const orders = await prisma.order.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: { orderItems: true }
            });

            console.log("Latest Order:", JSON.stringify(orders[0], null, 2));
        }

    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testCheckout();
