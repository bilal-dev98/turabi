# 💎 Chand Jewelry — Luxury E-Commerce & Multi-Vendor Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Analytics%20%26%20Insights-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Chand Jewelry** is an enterprise-grade, high-performance e-commerce platform and multi-vendor marketplace designed for luxury jewelry, handcrafted gold & silver accessories, diamond solitaires, and fine wristwatches in Pakistan.

🌐 **Live Production Store:** [https://www.chandjewelry.store](https://www.chandjewelry.store)

---

## 👨‍💻 Developer & Company Credits

Built with precision and craftsmanship by:

- **Lead Engineer & Developer:** [Umar Hashmi](https://umarhashmi.dev) — `umarhashmi.dev`
- **Agency & Design Company:** [Udesigner](https://udesigner.org) — `udesigner.org`

---

## ✨ Features & Architecture

### 👑 Public Storefront
- **Modern Executive Aesthetics:** Dark mode glassmorphism, responsive typography (Inter & Outfit fonts), and micro-animations.
- **3D Card Stack Experience:** Custom Framer Motion 3D "Shop the Highlights" interactive deck.
- **Dynamic Social Ecosystem:** Dynamic social link management (Instagram, WhatsApp, Facebook, X, TikTok, YouTube, LinkedIn, Pinterest) linked across footer, about, and contact pages.
- **Full Checkout Flow:** Support for Cash on Delivery (COD) and Direct Bank Transfers (Account Title, IBAN).

### 🛠️ Executive Admin Panel (`/admin`)
- **Dashboard & Analytics:** Real-time revenue insights, store KPIs, order status counters, and activity logs.
- **Store Operations:** Full product catalog management, category organization, discount coupons, home page builder, and Shop the Highlights editor with Cloudflare R2 image dropzones.
- **Dynamic Settings Center:** Store information management, custom shipping thresholds, Cash on Delivery & Direct Bank account controls, and profile photo/logo uploads.
- **Sidebar Collapse Mode:** Responsive desktop collapsible sidebar (`w-64` to `w-16` icon-only mode) with persistent state.

### 🏬 Multi-Vendor Portal (`/store`)
- **Vendor Onboarding & Store Approval:** Seamless vendor registration workflow.
- **Product Management & Order Tracking:** Dedicated vendor portal for listing products and managing fulfillment.

### 🔍 Advanced SEO, GEO & AEO Strategy
- **Search Engine Optimization (SEO):** Native `metadataBase` configured for `https://www.chandjewelry.store`, OpenGraph, Twitter cards, and PWA Web App manifest (`manifest.json`).
- **Generative Engine Optimization (GEO):** `JewelryStore` & `WebSite` Schema.org JSON-LD structured data for AI search engines (ChatGPT, Perplexity, Gemini).
- **Answer Engine Optimization (AEO):** Embedded `FAQPage`, `Product` & `Offer` rich snippets, and `BreadcrumbList` schemas.
- **Dynamic Indexing:** Dynamic `sitemap.xml` that auto-indexes all live products and vendor stores hourly, alongside an AI-friendly `robots.txt`.

---

## 📂 Project Directory Structure

```
turabi/
├── app/
│   ├── (public)/                 # Customer-facing storefront routes
│   │   ├── page.jsx              # Homepage with Hero, CardStack, Products & Specs
│   │   ├── shop/                 # Shop catalog & filtering
│   │   ├── product/[productId]/  # Product detail page with JSON-LD Schema
│   │   ├── about/                # About page with FAQ AEO Schema
│   │   ├── contact/              # Contact page with Geo-location Schema
│   │   └── cart/                 # Shopping cart & checkout
│   ├── admin/                    # Executive Admin Panel routes
│   │   ├── page.jsx              # Dashboard overview
│   │   ├── products/             # Product catalog management
│   │   ├── orders/               # Order tracking & status updates
│   │   ├── shop-highlights/      # Highlights card stack editor
│   │   ├── social/               # Social media links settings
│   │   └── settings/             # Store preferences & bank transfer config
│   ├── store/                    # Multi-vendor merchant portal routes
│   ├── api/                      # Next.js Serverless API endpoints
│   │   ├── admin/                # Secure admin endpoints (settings, social, highlights)
│   │   ├── products/             # Public product API
│   │   ├── upload/               # Cloudflare R2 & local image uploader
│   │   └── social-links/         # Active social links API
│   ├── layout.jsx                # Root layout (Redux, JSON-LD, Analytics, SpeedInsights)
│   ├── manifest.js               # PWA Web App Manifest generator
│   ├── robots.js                 # Dynamic AI crawler robots.txt generator
│   └── sitemap.js                # Dynamic sitemap generator (products & stores)
├── components/
│   ├── admin/                    # Executive Admin UI components (Layout, Sidebar, Navbar)
│   ├── store/                    # Vendor portal components
│   ├── CardStack.jsx             # Framer Motion 3D card stack engine
│   ├── CardStackSection.jsx      # Card stack section container
│   ├── SocialLinks.jsx           # Reusable SVG social links component
│   ├── ProductDetails.jsx        # Product detail showcase
│   ├── Footer.jsx                # Storefront footer with live links
│   └── Navbar.jsx                # Top storefront navigation bar
├── lib/
│   ├── prisma.js                 # Global Prisma Client with model re-instantiation
│   ├── r2.js                     # Cloudflare R2 object storage SDK helper
│   └── features/                 # Redux Toolkit store slices
├── prisma/
│   └── schema.prisma             # PostgreSQL database schema (User, Product, Order, SocialLink, StoreSetting)
└── public/
    ├── icons/                    # Curated feature icons & brand assets
    ├── highlights/               # Shop the Highlights high-res images
    └── logo.png                  # Official Chand Jewelry brand logo
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.x or higher
- **Database:** PostgreSQL (Supabase or direct connection string)
- **Object Storage:** Cloudflare R2 (optional, falls back to `/public/uploads`)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/bilal-dev98/turabi.git
cd turabi
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:5432/postgres"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Cloudflare R2 (Optional)
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_access_key"
R2_SECRET_ACCESS_KEY="your_secret_key"
R2_BUCKET_NAME="your_bucket"
R2_PUBLIC_URL="https://your-pub-bucket.dev"
```

### 3. Database Migration & Seed
```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

To create an optimized production build:
```bash
npm run build
npm run start
```

---

## 📜 License & Credits

- Designed and Developed by **[Umar Hashmi](https://umarhashmi.dev)**
- Digital Agency: **[Udesigner Company](https://udesigner.org)**
- Owned & Operated by **Chand Jewelry** ([https://www.chandjewelry.store](https://www.chandjewelry.store))
