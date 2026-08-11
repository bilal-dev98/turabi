'use client'
import { categories } from "@/assets/assets";
import Link from "next/link";

const CategoriesMarquee = () => {
    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none my-6 sm:my-10">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div
                className="flex gap-3.5 sm:gap-4"
                style={{
                    /* duplicate the list so the loop is seamless */
                    width: "max-content",
                    animation: "marqueeScroll 35s linear infinite",
                }}
            >
                {[...categories, ...categories, ...categories, ...categories].map((cat, index) => (
                    <Link
                        key={index}
                        href={`/shop?category=${encodeURIComponent(cat)}`}
                        className="px-5 py-2 bg-slate-100 rounded-full text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-900 hover:text-white active:scale-95 transition-all duration-300 whitespace-nowrap inline-block border border-slate-200/80 shadow-xs"
                    >
                        {cat}
                    </Link>
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;