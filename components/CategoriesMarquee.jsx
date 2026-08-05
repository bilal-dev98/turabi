import { categories } from "@/assets/assets";

const CategoriesMarquee = () => {

    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none sm:my-20">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div
                className="flex gap-4"
                style={{
                    /* duplicate the list so the loop is seamless */
                    width: "max-content",
                    animation: "marqueeScroll 35s linear infinite",
                }}
            >
                {[...categories, ...categories, ...categories, ...categories].map((cat, index) => (
                    <button
                        key={index}
                        className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300 whitespace-nowrap"
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;