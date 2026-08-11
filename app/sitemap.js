import prisma from '@/lib/prisma'

export const revalidate = 3600 // Revalidate sitemap every hour

export default async function sitemap() {
    const baseUrl = 'https://www.chandjewelry.store'
    const lastModified = new Date()

    const staticRoutes = [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cart`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/track-order`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ]

    try {
        const [products, stores] = await Promise.all([
            prisma.product.findMany({ select: { id: true, updatedAt: true } }).catch(() => []),
            prisma.store.findMany({ where: { status: 'approved', isActive: true }, select: { username: true, updatedAt: true } }).catch(() => [])
        ])

        const productRoutes = (products || []).map(p => ({
            url: `${baseUrl}/product/${p.id}`,
            lastModified: p.updatedAt || lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
        }))

        const storeRoutes = (stores || []).map(s => ({
            url: `${baseUrl}/shop/${s.username}`,
            lastModified: s.updatedAt || lastModified,
            changeFrequency: 'weekly',
            priority: 0.7,
        }))

        return [...staticRoutes, ...productRoutes, ...storeRoutes]
    } catch (err) {
        console.error("Sitemap dynamic generation error:", err)
        return staticRoutes
    }
}
