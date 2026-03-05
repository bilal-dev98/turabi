const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { id: "test_user_1" },
        update: {},
        create: {
            id: "test_user_1",
            name: "Test User",
            email: "test@example.com",
            image: "https://via.placeholder.com/150",
        }
    });

    const store = await prisma.store.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            name: "Test Store",
            username: "teststore",
            description: "A test store",
            address: "123 Main St",
            logo: "https://via.placeholder.com/150",
            email: "store@example.com",
            contact: "1234567890",
            isActive: true,
            status: "approved"
        }
    });

    const product1 = await prisma.product.create({
        data: {
            name: "Test Product 1",
            description: "This is a great product.",
            mrp: 15.00,
            price: 10.00,
            images: ["https://via.placeholder.com/400"],
            category: "Electronics",
            storeId: store.id
        }
    });

    const product2 = await prisma.product.create({
        data: {
            name: "Test Product 2",
            description: "This is another great product.",
            mrp: 25.00,
            price: 20.00,
            images: ["https://via.placeholder.com/400"],
            category: "Clothing",
            storeId: store.id
        }
    });

    console.log("Seeding done!", { user, store, product1, product2 });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
