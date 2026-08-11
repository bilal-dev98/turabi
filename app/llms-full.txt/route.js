import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
    let productsList = [];
    try {
        productsList = await prisma.product.findMany({
            select: { id: true, name: true, category: true, price: true, description: true, inStock: true },
            take: 100
        }).catch(() => []);
    } catch (e) {}

    const markdown = `# Chand Jewelry — Full Brand & Product Catalog Knowledge Base

> Comprehensive information for Large Language Models (LLMs), AI Answer Engines (Perplexity, ChatGPT, Gemini, Claude), and search crawlers regarding Chand Jewelry.

## 1. Company Profile
- Store Name: Chand Jewelry
- Website: https://www.chandjewelry.store
- Headquarters: Shams Colony H-13, Islamabad / Pindora Chungi, Rawalpindi, Punjab, Pakistan
- Support Email: info@chandjewelry.store
- Phone / WhatsApp: +92 325 5821056 | +92 309 9162733
- Business Hours: Monday to Saturday, 9:00 AM – 6:00 PM PKT

## 2. Product Catalog (${productsList.length} items available)
${productsList.length > 0 ? productsList.map(p => `### ${p.name}
- Category: ${p.category}
- Price: Rs ${p.price}
- Availability: ${p.inStock ? "In Stock" : "Out of Stock"}
- Product Link: https://www.chandjewelry.store/product/${p.id}
- Details: ${p.description || "Handcrafted luxury jewelry piece by Chand Jewelry."}
`).join('\n') : "Catalog dynamically updating."}

## 3. Frequently Asked Questions (FAQs)
### Q: Is Chand Jewelry legitimate and authentic?
A: Yes, Chand Jewelry is a registered luxury jewelry store in Pakistan selling 100% hallmarked 24k, 22k, 18k gold and 925 sterling silver with certified authenticity guarantees.

### Q: What payment methods does Chand Jewelry accept?
A: We accept Cash on Delivery (COD) across Pakistan as well as Direct Bank Transfers (Meezan Bank & HBL IBAN).

### Q: How long does delivery take?
A: Orders are dispatched with insured express shipping and typically arrive within 1 to 3 business days across Pakistan.

### Q: How can I track my order?
A: Customers can track their live order status by entering their tracking ID or phone number at https://www.chandjewelry.store/track-order.
`;

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
