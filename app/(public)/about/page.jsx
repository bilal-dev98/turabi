import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, HeadphonesIcon, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { assets } from '@/assets/assets';

export const metadata = {
    title: "About Us - Turabi Store",
    description: "Learn more about Turabi Store, our mission, and our premium selection of tech products.",
};

export default function AboutPage() {
    return (
        <div className="mx-6 mb-20">
            <div className="max-w-7xl mx-auto my-10">
                {/* Hero / Vision Section */}
                <div className="flex flex-col xl:flex-row gap-8">
                    <div className="relative flex-1 flex flex-col bg-green-100 rounded-3xl xl:min-h-100 overflow-hidden">
                        <div className="p-8 sm:p-16 z-10">
                            <div className="inline-flex items-center gap-3 bg-green-200 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                Our Story
                            </div>
                            <h1 className="text-4xl sm:text-6xl leading-[1.2] my-3 font-medium text-slate-800 max-w-xl">
                                Turabi Store
                            </h1>
                            <p className="text-slate-600 text-lg sm:text-xl font-medium mt-4 max-w-xl leading-relaxed">
                                Starting in Rawalpindi and Islamabad, we have evolved into a trusted hub for premium gadgets and electronics. We bring the best tech right to your doorstep.
                            </p>
                            <Link href="/contact" className="inline-block bg-slate-800 text-white font-medium text-sm py-4 px-10 mt-10 rounded-md hover:bg-slate-900 transition">
                                GET IN TOUCH
                            </Link>
                        </div>
                        {/* If there's a suitable image in assets, we could use it here. Using a subtle decorative shape instead. */}
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    <div className="flex flex-col gap-5 w-full xl:max-w-md text-slate-800">
                        <div className="flex-1 bg-orange-100 rounded-3xl p-8 sm:p-10 flex flex-col justify-center relative overflow-hidden">
                            <h2 className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent mb-4">Our Mission</h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                To redefine how you shop for technology. We bridge the gap between premium electronics and accessible pricing.
                            </p>
                        </div>
                        <div className="flex-1 bg-blue-100 rounded-3xl p-8 sm:p-10 flex flex-col justify-center relative overflow-hidden">
                            <h2 className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent mb-4">Our Promise</h2>
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
                        <p className="text-slate-500 font-medium">What makes Turabi Store the right choice for your tech needs.</p>
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
                                We work directly with brands and distributors to pass massive savings down to our customers.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-600">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-3">Community First</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Built for tech lovers, by tech lovers. We listen to our community to constantly improve our offerings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
