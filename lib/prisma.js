import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

let prisma = globalForPrisma.prisma;

if (!prisma || !prisma.socialLink || !prisma.storeSetting) {
    prisma = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prisma;
    }
}

export default prisma;
