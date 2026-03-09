import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, HeadphonesIcon, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "About Us - Turabi Store",
    description: "Learn more about Turabi Store, our mission, and our values.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background-light py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-slate-800 font-semibold text-sm mb-4">
                        Discover Our Story
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Revolutionizing Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#0be052]">
                            Shopping Experience
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        At Turabi Store, we believe that shopping shouldn't just be about buying things—it should be an experience. We curate the best products and deliver them to your doorstep with speed and unmatched reliability.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-4xl font-bold text-slate-900 mb-2 relative z-10">50K+</h3>
                        <p className="text-slate-500 font-medium relative z-10">Happy Customers</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-4xl font-bold text-slate-900 mb-2 relative z-10">10K+</h3>
                        <p className="text-slate-500 font-medium relative z-10">Premium Products</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-4xl font-bold text-slate-900 mb-2 relative z-10">99%</h3>
                        <p className="text-slate-500 font-medium relative z-10">Delivery Success</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-4xl font-bold text-slate-900 mb-2 relative z-10">24/7</h3>
                        <p className="text-slate-500 font-medium relative z-10">Customer Support</p>
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Turabi Store?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">We're built on a foundation of quality, trust, and exceptional service.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Value 1 */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 text-slate-900 rounded-2xl flex items-center justify-center mb-6">
                                <ShoppingBag size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Curated Selection</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We handpick every item in our store to ensure it meets our strict standards for quality and value.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 text-slate-900 rounded-2xl flex items-center justify-center mb-6">
                                <Truck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Delivery</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Experience lightning-fast shipping with real-time tracking from our warehouse directly to your door.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 text-slate-900 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Shopping</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Your data and payments are protected with industry-leading encryption and security protocols.
                            </p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 text-slate-900 rounded-2xl flex items-center justify-center mb-6">
                                <HeadphonesIcon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Dedicated Support</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our friendly customer service team is always ready to assist you, day or night.
                            </p>
                        </div>

                        {/* Value 5 */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 text-slate-900 rounded-2xl flex items-center justify-center mb-6">
                                <TrendingUp size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Best Prices</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We work directly with manufacturers to cut out the middleman and pass the savings on to you.
                            </p>
                        </div>

                        {/* Value 6 */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 text-slate-900 rounded-2xl flex items-center justify-center mb-6">
                                <Users size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Community First</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We believe in giving back and building a robust community of passionate shoppers and creators.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to start shopping?</h2>
                        <p className="text-slate-300 text-lg mb-10">
                            Join thousands of satisfied customers and experience the Turabi Store difference today.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl bg-primary text-slate-900 hover:bg-[#0be052] transition-colors shadow-sm"
                        >
                            Explore Our Products
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
