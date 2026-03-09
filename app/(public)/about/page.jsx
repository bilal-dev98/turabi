import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, HeadphonesIcon, TrendingUp, Users, ArrowRight, CheckCircle2, Zap, Award, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: "About Us - Turabi Store",
    description: "Learn more about Turabi Store, our mission, and our premium selection of tech products.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden selection:bg-primary/30">
            {/* 1. HERO SECTION - Massive Typography and Image Overlay */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about/hero.png"
                        alt="Turabi Store Premium Workspace"
                        fill
                        className="object-cover object-center scale-105 animate-slow-pan sepia-[.2] hue-rotate-[-10deg]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-50 dark:to-[#0a0a0a]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm mb-8 shadow-2xl">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </span>
                        Welcome to the Future of Retail
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                        TURABI<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-cyan-400">
                            STORE.
                        </span>
                    </h1>

                    <p className="text-xl md:text-3xl text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg mb-12">
                        We curate the absolute pinnacle of technology. No compromises. Just premium electronics delivered instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link href="/shop" className="w-full sm:w-auto px-10 py-5 bg-primary text-slate-900 rounded-full font-black text-lg hover:bg-[#0be052] transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2">
                            Explore Collection <ArrowRight className="animate-pulse" />
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400/50 animate-bounce">
                    <div className="w-1 h-16 rounded-full bg-gradient-to-b from-transparent via-slate-400/50 to-transparent"></div>
                </div>
            </section>

            {/* 2. STATS ORBIT - Floating glass cards */}
            <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                    {[
                        { num: "50K+", label: "Elite Customers", color: "from-blue-500 to-cyan-400" },
                        { num: "10K+", label: "Products Sold", color: "from-primary to-emerald-400" },
                        { num: "99.9%", label: "Satisfaction Rate", color: "from-purple-500 to-pink-500" },
                        { num: "24/7", label: "Concierge Support", color: "from-amber-500 to-orange-400" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/50 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center transform transition-all hover:-translate-y-2 hover:bg-white dark:hover:bg-slate-800">
                            <h3 className={`text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br ${stat.color} mb-3 filter drop-shadow-sm`}>
                                {stat.num}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. BENTO GRID - Story and Mission */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight">The Masterplan</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        We don't just sell boxes. We architect the ultimate unboxing experience from server to your front door.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[400px]">
                    {/* Big Image Tile */}
                    <div className="md:col-span-2 relative rounded-[3rem] overflow-hidden group shadow-2xl border border-slate-200 dark:border-white/10">
                        <Image
                            src="/images/about/store.png"
                            alt="Turabi Physical Store"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10 md:p-14">
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">A Foundation of Trust.</h3>
                            <p className="text-slate-300 text-lg md:text-xl font-medium max-w-lg">
                                Born in the heart of Islamabad and Rawalpindi, we meticulously source tier-one technology so you never have to second guess authenticity.
                            </p>
                        </div>
                    </div>

                    {/* Small Text Tile */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 flex flex-col justify-center relative overflow-hidden shadow-2xl border border-white/10 group">
                        <Globe className="w-20 h-20 text-primary/20 absolute -bottom-5 -right-5 group-hover:scale-150 transition-transform duration-700" />
                        <ShieldCheck className="w-12 h-12 text-primary mb-6" />
                        <h3 className="text-3xl font-bold text-white mb-4">Zero Compromise</h3>
                        <p className="text-slate-400 text-lg font-medium">Every cable, every device, every screen is tested to perfection. We guarantee 100% authenticity on our entire catalog.</p>
                    </div>

                    {/* Small Image Tile */}
                    <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl border border-slate-200 dark:border-white/10">
                        <Image
                            src="/images/about/team.png"
                            alt="Turabi Team"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000 origin-bottom"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-slate-900 to-transparent">
                            <h3 className="text-2xl font-bold text-white">The Visionaries</h3>
                        </div>
                    </div>

                    {/* Medium Text Tile */}
                    <div className="md:col-span-2 bg-white dark:bg-[#111] rounded-[3rem] p-10 md:p-14 flex items-center shadow-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 dark:bg-primary/5 blur-3xl rounded-full"></div>
                        <div className="relative z-10 max-w-xl">
                            <Zap className="w-14 h-14 text-blue-500 mb-6" />
                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Lightning Delivery.</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-xl font-medium leading-relaxed mb-8">
                                Why wait? Our logistics network is optimized for insane speed. Your next piece of technology shouldn't take weeks to arrive.
                            </p>
                            <ul className="space-y-4">
                                {['Secure Packaging', 'Real-time Tracking', 'Insured Transit'].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-lg font-bold text-slate-800 dark:text-slate-200">
                                        <CheckCircle2 className="text-primary" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. MARQUEE / VALUES */}
            <section className="py-24 bg-slate-900 border-y border-white/10 overflow-hidden relative">
                <div className="flex whitespace-nowrap animate-marquee gap-10 opacity-40">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-5xl md:text-8xl font-black text-transparent outline-text text-white/50 px-8">
                            PREMIUM • FAST • AUTHENTIC •
                        </span>
                    ))}
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 20s linear infinite;
                    }
                    .outline-text {
                        -webkit-text-stroke: 2px rgba(255,255,255,0.2);
                    }
                `}} />
            </section>

            {/* 5. Core Values Grid */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">Uncompromising Quality</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {[
                        { icon: Award, title: "Curated Selection", desc: "Handpicked items ensuring strict standards for quality and immense value.", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
                        { icon: Truck, title: "Fast Delivery", desc: "Lightning-fast shipping with real-time tracking directly to your door.", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
                        { icon: ShieldCheck, title: "Secure Shopping", desc: "Your data is protected with industry-leading encryption and protocols.", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
                        { icon: HeadphonesIcon, title: "Dedicated Support", desc: "Friendly customer service team always ready to assist you day or night.", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
                        { icon: TrendingUp, title: "Best Prices", desc: "Working directly with manufacturers to pass the massive savings on to you.", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
                        { icon: Users, title: "Community First", desc: "Giving back and building a robust community of passionate tech lovers.", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
                    ].map((val, i) => (
                        <div key={i} className={`bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-10 rounded-[2.5rem] hover:-translate-y-2 transition-transform shadow-xl hover:shadow-2xl`}>
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 border ${val.color}`}>
                                <val.icon size={30} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{val.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
                                {val.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. CTA Finale */}
            <section className="pb-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-slate-800">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/40 blur-[100px] rounded-full"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/40 blur-[100px] rounded-full"></div>

                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Stop reading.<br />Start shopping.</h2>
                        <p className="text-xl md:text-2xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto">
                            Join thousands of satisfied customers and experience the Turabi difference.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/shop"
                                className="px-12 py-6 text-xl font-black rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105"
                            >
                                Shop Premium
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
