import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
    const baseUrl = 'https://www.chandjewelry.store';
    const nowIso = new Date().toISOString();

    const staticUrls = [
        { loc: `${baseUrl}`, priority: '1.0', changefreq: 'daily' },
        { loc: `${baseUrl}/shop`, priority: '0.9', changefreq: 'daily' },
        { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${baseUrl}/cart`, priority: '0.5', changefreq: 'weekly' },
        { loc: `${baseUrl}/track-order`, priority: '0.5', changefreq: 'weekly' },
    ];

    let productEntries = [];
    let storeEntries = [];

    try {
        const [products, stores] = await Promise.all([
            prisma.product.findMany({ select: { id: true, name: true, images: true, updatedAt: true } }).catch(() => []),
            prisma.store.findMany({ where: { status: 'approved', isActive: true }, select: { username: true, updatedAt: true } }).catch(() => [])
        ]);

        productEntries = (products || []).map(p => ({
            loc: `${baseUrl}/product/${p.id}`,
            lastmod: (p.updatedAt || new Date()).toISOString(),
            priority: '0.8',
            changefreq: 'weekly',
            image: Array.isArray(p.images) && p.images[0] ? p.images[0] : null,
            title: p.name || 'Chand Jewelry'
        }));

        storeEntries = (stores || []).map(s => ({
            loc: `${baseUrl}/shop/${s.username}`,
            lastmod: (s.updatedAt || new Date()).toISOString(),
            priority: '0.7',
            changefreq: 'weekly',
            image: null,
            title: null
        }));
    } catch (err) {
        console.error("Sitemap XML generation error:", err);
    }

    const allUrls = [...staticUrls, ...productEntries, ...storeEntries];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                            http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
${allUrls.map(item => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod || nowIso}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>${item.image ? `
    <image:image>
      <image:loc>${item.image}</image:loc>
      <image:title>${item.title ? item.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Jewelry'}</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
