import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, HeadphonesIcon, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import SocialLinks from '@/components/SocialLinks';

export const metadata = {
    title: "About Us - Handcrafted Luxury Jewelry",
    description: "Learn more about Chand Jewelry, our royal artisan heritage, mission, and handcrafted gold & silver jewelry across Pakistan.",
    alternates: {
        canonical: 'https://www.chandjewelry.store/about',
    },
    openGraph: {
        title: "About Us - Chand Jewelry",
        description: "Discover Chand Jewelry's heritage of handcrafted gold, silver, gemstone rings, and fine luxury accessories.",
        url: 'https://www.chandjewelry.store/about',
    }
};

export default function AboutPage() {
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is Chand Jewelry?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Chand Jewelry is a premier online store specializing in handcrafted luxury gold & silver jewelry, diamond solitaires, luxury wristwatches, and fine accessories across Pakistan."
                }
            },
            {
                "@type": "Question",
                "name": "Are Chand Jewelry products authentic and hallmarked?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, 100% of our precious metals are hallmarked 24k/22k/18k gold and 925 sterling silver, accompanied by certified authenticity guarantees."
                }
            },
            {
                "@type": "Question",
                "name": "Does Chand Jewelry offer insured delivery across Pakistan?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide fully insured express doorstep shipping across all major cities in Pakistan within 1-3 business days."
                }
            }
        ]
    };

    return (
        <div className="mx-6 mb-20 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <div className="max-w-7xl mx-auto my-10">
                {/* Hero / Vision Section */}
                <div className="flex flex-col xl:flex-row gap-8">
                    <div className="relative flex-1 flex flex-col bg-green-100 rounded-3xl xl:min-h-100 overflow-hidden">
                        <div className="p-8 sm:p-16 z-10">
                            <div className="inline-flex items-center gap-3 bg-green-200 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                Our Story
                            </div>
                            <h1 className="text-4xl sm:text-6xl leading-[1.2] my-3 font-medium text-slate-800 max-w-xl">
                                Chand Jewelry
                            </h1>
                            <p className="text-slate-600 text-lg sm:text-xl font-medium mt-4 max-w-xl leading-relaxed">
                                Crafted with passion, Chand Jewelry is your trusted destination for exquisite handcrafted jewelry, gold & silver rings, necklaces, watches, and fine luxury accessories across Pakistan.
                            </p>
                            <Link href="/contact" className="inline-block bg-slate-800 text-white font-medium text-sm py-4 px-10 mt-10 rounded-md hover:bg-slate-900 transition">
                                GET IN TOUCH
                            </Link>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    <div className="flex flex-col gap-5 w-full xl:max-w-md text-slate-800">
                        <div className="flex-1 bg-orange-100 rounded-3xl p-8 sm:p-10 flex flex-col justify-center relative overflow-hidden">
                            <h2 className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent mb-4">Our Mission</h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                To redefine how you shop for luxury jewelry. We bridge the gap between royal artisan craftsmanship and accessible luxury pricing.
                            </p>
                        </div>
                        <div className="flex-1 bg-emerald-100 rounded-3xl p-8 sm:p-10 flex flex-col justify-center relative overflow-hidden">
                            <h2 className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent mb-4">Our Promise</h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                100% authentic, curated products with lightning-fast delivery and dedicated customer support you can actually trust.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
                    <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-100">
                        <h3 className="text-4xl font-medium text-slate-800 mb-2">50K+</h3>
                        <p className="text-slate-500 font-medium text-sm">Customers</p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-100">
                        <h3 className="text-4xl font-medium text-slate-800 mb-2">100%</h3>
                        <p className="text-slate-500 font-medium text-sm">Authentic</p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-100">
                        <h3 className="text-4xl font-medium text-slate-800 mb-2">24/7</h3>
                        <p className="text-slate-500 font-medium text-sm">Support</p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-100">
                        <h3 className="text-4xl font-medium text-slate-800 mb-2">1-2</h3>
                        <p className="text-slate-500 font-medium text-sm">Days Delivery</p>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-medium text-slate-800 mb-4">Why Choose Us</h2>
                        <p className="text-slate-500 font-medium">What makes Chand Jewelry the right choice for your luxury jewelry & accessory needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-800">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-600">
                                <ShoppingBag size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-3">Curated Selection</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Handpicked items ensuring strict standards for quality and immense value. We only sell what we believe in.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-600">
                                <Truck size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-3">Fast Delivery</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Lightning-fast shipping with robust packaging directly to your door, anywhere in Pakistan.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-600">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-3">Secure Shopping</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Your data is protected with industry-leading encryption. Shop with complete peace of mind.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-600">
                                <HeadphonesIcon size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-3">Dedicated Support</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Friendly and knowledgeable customer service team always ready to assist you before and after your purchase.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-600">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-3">Best Prices</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                We work directly with master artisans to pass massive savings down to our customers.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-600">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-3">Community First</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Built for jewelry lovers. We listen to our community to constantly refine our luxury designs and services.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social Connect Banner */}
                <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="space-y-2 text-center md:text-left z-10">
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Connect With Chand Jewelry</h3>
                        <p className="text-slate-400 text-sm max-w-md">
                            Follow our social channels to get exclusive sneak peeks of new gold, silver & gemstone collections.
                        </p>
                    </div>
                    <div className="z-10">
                        <SocialLinks buttonStyle="size-11 rounded-2xl bg-white/10 text-white hover:bg-emerald-500 hover:text-slate-950 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
