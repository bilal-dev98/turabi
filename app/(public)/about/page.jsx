import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, HeadphonesIcon, TrendingUp, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: "About Us - Turabi Store",
    description: "Learn more about Turabi Store, our mission, and our premium selection of tech products.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-slate-800 font-bold text-sm mb-4 animate-fade-in-up">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        Welcome to Turabi Store
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Elevating Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                            Digital Lifestyle
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
                        We don't just sell gadgets; we curate experiences. Discover premium tech that empowers your everyday life with unmatched speed and reliability.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <Link href="/shop" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">
                            Explore Shop <ArrowRight size={20} />
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>

            {/* Premium Stats Bar */}
            <div className="bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
                        <div className="text-center group">
                            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 group-hover:text-primary transition-colors">50K+</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Happy Customers</p>
                        </div>
                        <div className="text-center group">
                            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-500 transition-colors">10K+</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Premium Products</p>
                        </div>
                        <div className="text-center group">
                            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 group-hover:text-emerald-500 transition-colors">99%</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Delivery Success</p>
                        </div>
                        <div className="text-center group">
                            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 group-hover:text-purple-500 transition-colors">24/7</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Customer Support</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Story / Mission */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl translate-x-4 translate-y-4 -z-10"></div>
                        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Built on Trust & Innovation</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                Starting in Rawalpindi and Islamabad, Turabi Store has rapidly evolved into a trusted hub for tech enthusiasts. We source directly from top manufacturers to bring you devices that actually matter.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 shrink-0" size={20} />
                                    <span className="text-slate-700 font-medium text-lg">100% Authentic and tested products.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 shrink-0" size={20} />
                                    <span className="text-slate-700 font-medium text-lg">Lightning-fast shipping directly to you.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 shrink-0" size={20} />
                                    <span className="text-slate-700 font-medium text-lg">Hassle-free returns and money-back guarantees.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-2">Our Mission</div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                            Redefining How You Shop For Technology.
                        </h2>
                        <p className="text-slate-600 text-xl leading-relaxed">
                            We bridge the gap between premium tier electronics and affordable pricing. Every click, scroll, and purchase is designed to be as smooth as the screens you buy from us.
                        </p>
                    </div>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="bg-slate-900 py-24 text-white relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Turabi Store?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl">Your satisfaction is our architecture. We're built on a foundation of quality, trust, and exceptional service.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            { icon: ShoppingBag, title: "Curated Selection", desc: "Handpicked items ensuring strict standards for quality and immense value.", color: "text-blue-400" },
                            { icon: Truck, title: "Fast Delivery", desc: "Lightning-fast shipping with real-time tracking directly to your door.", color: "text-green-400" },
                            { icon: ShieldCheck, title: "Secure Shopping", desc: "Your data is protected with industry-leading encryption and protocols.", color: "text-purple-400" },
                            { icon: HeadphonesIcon, title: "Dedicated Support", desc: "Friendly customer service team always ready to assist you day or night.", color: "text-rose-400" },
                            { icon: TrendingUp, title: "Best Prices", desc: "Working directly with manufacturers to pass the massive savings on to you.", color: "text-amber-400" },
                            { icon: Users, title: "Community First", desc: "Giving back and building a robust community of passionate tech lovers.", color: "text-cyan-400" },
                        ].map((val, i) => (
                            <div key={i} className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-all hover:-translate-y-1">
                                <div className={`w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-700 ${val.color}`}>
                                    <val.icon size={26} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{val.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">
                                    {val.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to upgrade your gear?</h2>
                        <p className="text-white/90 text-xl font-medium mb-12">
                            Join thousands of satisfied customers and experience the Turabi Store difference today.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 gap-2 group"
                        >
                            Shop Now <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
