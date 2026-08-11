import { Inter, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StoreProvider from "@/app/StoreProvider";
import InitData from "@/components/InitData";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600", "700"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
    metadataBase: new URL('https://www.chandjewelry.store'),
    title: {
        default: "Chand Jewelry - Handcrafted Luxury Jewelry & Fine Accessories",
        template: "%s | Chand Jewelry"
    },
    description: "Discover Chand Jewelry - your premier online destination for handcrafted luxury gold & silver jewelry, diamond rings, necklaces, luxury watches, and bespoke accessories in Pakistan.",
    keywords: [
        "Chand Jewelry",
        "Chand Jewelry Store",
        "chandjewelry.store",
        "handcrafted luxury jewelry",
        "gold jewelry Pakistan",
        "silver rings Pakistan",
        "luxury watches",
        "diamond solitaires",
        "online jewelry shop Pakistan",
        "bespoke jewelry designs",
        "custom gold bangles"
    ],
    authors: [{ name: "Chand Jewelry", url: "https://www.chandjewelry.store" }],
    creator: "Chand Jewelry",
    publisher: "Chand Jewelry",
    manifest: "/manifest.json",
    verification: {
        google: 'Kualrj9O8zhVqEAMNvwMirRUErOkwdSFZE-iRx_3pyo',
    },
    icons: {
        icon: [
            { url: '/favicon.ico?v=4' },
            { url: '/icon.png?v=4', type: 'image/png' },
            { url: '/favicon.png?v=4', type: 'image/png' },
        ],
        shortcut: '/favicon.ico?v=4',
        apple: '/apple-icon.png?v=4',
    },
    alternates: {
        canonical: 'https://www.chandjewelry.store',
    },
    openGraph: {
        title: "Chand Jewelry - Handcrafted Luxury Jewelry & Fine Accessories",
        description: "Discover Chand Jewelry - your premier online destination for handcrafted luxury gold & silver jewelry, diamond rings, necklaces, luxury watches, and bespoke accessories in Pakistan.",
        url: 'https://www.chandjewelry.store',
        siteName: 'Chand Jewelry',
        images: [
            {
                url: 'https://www.chandjewelry.store/twitter-og.png',
                width: 1200,
                height: 630,
                alt: 'Chand Jewelry - Handcrafted Luxury Jewelry',
            },
        ],
        locale: 'en_PK',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Chand Jewelry - Handcrafted Luxury Jewelry & Fine Accessories",
        description: "Discover Chand Jewelry - your premier online destination for handcrafted luxury gold & silver jewelry, diamond rings, necklaces, luxury watches, and bespoke accessories in Pakistan.",
        images: ['https://www.chandjewelry.store/twitter-og.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "JewelryStore",
                "@id": "https://www.chandjewelry.store/#organization",
                "name": "Chand Jewelry",
                "alternateName": ["Chand Jewellery", "Chand Jewelry Store"],
                "url": "https://www.chandjewelry.store",
                "logo": "https://www.chandjewelry.store/logo.png",
                "image": "https://www.chandjewelry.store/twitter-og.png",
                "description": "Handcrafted Luxury Jewelry, Royal Gold & Silver Accessories in Pakistan.",
                "priceRange": "$$",
                "sameAs": [
                    "https://facebook.com/chandjewelry.store",
                    "https://instagram.com/chandjewelry.store",
                    "https://wa.me/923255821056"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+92 300 1234567",
                    "contactType": "customer service",
                    "email": "info@chandjewelry.store",
                    "areaServed": "PK",
                    "availableLanguage": ["en", "ur"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "PK",
                    "addressRegion": "Punjab"
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://www.chandjewelry.store/#website",
                "url": "https://www.chandjewelry.store",
                "name": "Chand Jewelry",
                "description": "Handcrafted Luxury Jewelry & Fine Accessories in Pakistan",
                "publisher": { "@id": "https://www.chandjewelry.store/#organization" },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.chandjewelry.store/shop?search={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };

    return (
        <html lang="en">
            <head>
                <meta name="google-site-verification" content="Kualrj9O8zhVqEAMNvwMirRUErOkwdSFZE-iRx_3pyo" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-900`}>
                <StoreProvider>
                    <InitData />
                    <Toaster />
                    {children}
                </StoreProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
