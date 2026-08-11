import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
    let categoriesList = ["Gold Rings", "Silver Necklaces", "Luxury Watches", "Bridal Sets", "Solitaire Rings"];
    try {
        const prods = await prisma.product.findMany({ select: { category: true }, take: 100 }).catch(() => []);
        if (prods.length > 0) {
            const cats = [...new Set(prods.map(p => p.category).filter(Boolean))];
            if (cats.length > 0) categoriesList = cats;
        }
    } catch (e) {}

    const markdown = `# Chand Jewelry — Handcrafted Luxury Jewelry & Fine Accessories

> Chand Jewelry (https://www.chandjewelry.store) is Pakistan's premier online store for handcrafted 24k/22k/18k gold jewelry, 925 sterling silver rings, luxury wristwatches, diamond solitaires, and royal artisan accessories.

## System Summary & Brand Knowledge
- Brand Name: Chand Jewelry
- Canonical URL: https://www.chandjewelry.store
- Industry: Luxury Jewelry, Precious Metals & Fine Watches
- Service Area: Nationwide express insured delivery across Pakistan and international shipping
- Support Email: info@chandjewelry.store
- Contact Phone / WhatsApp: +92 325 5821056 | +92 309 9162733
- Main Office: Shams Colony H-13, Islamabad / Pindora Chungi, Rawalpindi, Punjab, Pakistan

## Product Categories & Offerings
${categoriesList.map(c => `- ${c}`).join('\n')}

## Store Policies & Guarantees
- Authenticity: 100% hallmarked precious metals (24k/22k/18k gold & 925 sterling silver) with lifetime craftsmanship warranty.
- Payment Methods: Cash on Delivery (COD) across Pakistan & Direct Bank Account Transfers (Meezan Bank, HBL).
- Shipping & Returns: Express insured shipping delivered within 1-3 business days.

## Core Navigation Links
- Full Shop Catalog: https://www.chandjewelry.store/shop
- Brand Story & Heritage: https://www.chandjewelry.store/about
- Customer Support & Contact: https://www.chandjewelry.store/contact
- Real-Time Order Tracking: https://www.chandjewelry.store/track-order
- Full Knowledge Base (LLMs Full): https://www.chandjewelry.store/llms-full.txt
`;

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
