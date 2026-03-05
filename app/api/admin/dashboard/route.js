import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Fetch core aggregations
        const totalProducts = await prisma.product.count();
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.order.count();

        // Calculate Revenue (Only taking Completed/Paid ones if possible, but let's take all for now, or just where status != ORDER_PLACED?)
        // Let's sum all orders total
        const allOrders = await prisma.order.findMany({
            select: { total: true, createdAt: true }
        });

        const revenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

        // Daily Sales (last 24 hours)
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const now = new Date();
        const dailySales = allOrders
            .filter(o => (now - new Date(o.createdAt)) <= ONE_DAY)
            .reduce((sum, order) => sum + (order.total || 0), 0);

        // Fetch Recent Orders (last 5)
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, image: true, email: true } },
                address: true,
                orderItems: {
                    include: {
                        product: { select: { name: true, images: true, category: true } }
                    }
                }
            }
        });

        // Generate Activity Feed (mix of newest users and newest orders)
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { id: 'desc' }, // User doesn't have createdAt, handle gracefully by ID or assume they are recent
            select: { name: true, id: true }
        });

        const activities = [];

        recentOrders.forEach(order => {
            activities.push({
                type: 'ORDER',
                title: 'Order Placed',
                desc: `Order #${order.id.slice(-6).toUpperCase()} for $${order.total}`,
                date: order.createdAt,
                icon: 'check_circle',
                color: 'text-primary',
                bg: 'bg-primary/20'
            });
        });

        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        return NextResponse.json({
            success: true,
            data: {
                revenue,
                products: totalProducts,
                users: totalUsers,
                orders: totalOrders,
                dailySales,
                avgOrderValue,
                recentOrders,
                activities: activities.slice(0, 10)
            }
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
