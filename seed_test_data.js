const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    try {
        console.log("Seeding test data...");

        const user = await prisma.user.create({
            data: {
                id: 'test_user_1',
                name: 'Test User',
                email: 'test@example.com',
                image: 'http://example.com/img.png'
            }
        });
        console.log("Created user:", user.id);

        const store = await prisma.store.create({
            data: {
                userId: user.id,
                name: 'Test Store',
                username: 'teststore',
                description: 'test store description',
                address: '123 Store St',
                logo: 'http://example.com/logo.png',
                email: 'store@example.com',
                contact: '1234567890',
                isActive: true,
                status: 'active'
            }
        });
        console.log("Created store:", store.id);

        const address = await prisma.address.create({
            data: {
                userId: user.id,
                name: 'Test Address',
                email: 'test@example.com',
                street: '123 User St',
                city: 'Test City',
                state: 'Test State',
                zip: '12345',
                country: 'Test Country',
                phone: '0987654321'
            }
        });
        console.log("Created address:", address.id);

        const product = await prisma.product.create({
            data: {
                name: 'Test Product',
                description: 'A product for testing',
                mrp: 150,
                price: 100,
                images: ['http://example.com/prod.png'],
                category: 'test',
                inStock: true,
                storeId: store.id
            }
        });
        console.log("Created product:", product.id);

        console.log("Seeding complete!");

    } catch (e) {
        console.error("Error seeding data:");
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
