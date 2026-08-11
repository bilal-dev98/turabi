import { Inter, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import InitData from "@/components/InitData";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600", "700"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["300", "400", "500", "600", "700", "800", "900"] });


export const metadata = {
    metadataBase: new URL('https://chandjewelry.store'),
    title: {
        default: "Chand Jewelry - Handcrafted Luxury Jewelry & Fine Accessories",
        template: "%s | Chand Jewelry"
    },
    description: "Discover Chand Jewelry - your premier online store for handcrafted luxury jewelry, gold & silver rings, necklaces, watches and fine accessories in Pakistan.",
    keywords: ["Chand Jewelry", "jewelry store Pakistan", "luxury watches", "gold jewelry", "silver rings", "necklaces", "online jewelry shop", "handcrafted jewelry", "buy jewelry online Pakistan"],
    authors: [{ name: "Chand Jewelry" }],
    creator: "Chand Jewelry",
    publisher: "Chand Jewelry",
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
        canonical: 'https://chandjewelry.store',
    },
    openGraph: {
        title: "Chand Jewelry - Handcrafted Luxury Jewelry & Fine Accessories",
        description: "Discover Chand Jewelry - your premier online store for handcrafted luxury jewelry, gold & silver rings, necklaces, watches and fine accessories in Pakistan.",
        url: 'https://chandjewelry.store',
        siteName: 'Chand Jewelry',
        images: [
            {
                url: 'https://chandjewelry.store/twitter-og.png',
                width: 1200,
                height: 630,
                alt: 'Chand Jewelry OG Banner',
            },
        ],
        locale: 'en_PK',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Chand Jewelry - Handcrafted Luxury Jewelry & Fine Accessories",
        description: "Discover Chand Jewelry - your premier online store for handcrafted luxury jewelry, gold & silver rings, necklaces, watches and fine accessories in Pakistan.",
        images: ['https://chandjewelry.store/twitter-og.png'],
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
                "@type": "Organization",
                "@id": "https://chandjewelry.store/#organization",
                "name": "Chand Jewelry",
                "url": "https://chandjewelry.store",
                "logo": "https://chandjewelry.store/logo.png",
                "sameAs": [
                    "https://facebook.com/chandjewelry.store",
                    "https://instagram.com/chandjewelry.store"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+92 300 1234567",
                    "contactType": "customer service",
                    "email": "info@chandjewelry.store",
                    "areaServed": "PK",
                    "availableLanguage": ["en", "ur"]
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://chandjewelry.store/#website",
                "url": "https://chandjewelry.store",
                "name": "Chand Jewelry",
                "description": "Handcrafted Luxury Jewelry & Fine Accessories in Pakistan",
                "publisher": { "@id": "https://chandjewelry.store/#organization" },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://chandjewelry.store/shop?search={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };

    return (
        <html lang="en">
            <head>
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
            </body>
        </html>
    );
}
