if (typeof globalThis !== 'undefined') {
    Object.defineProperty(globalThis, 'localStorage', {
        value: {
            getItem: function () { return null; },
            setItem: function () { },
            removeItem: function () { },
            clear: function () { }
        },
        writable: true,
        configurable: true
    });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-6361186d22bd421988003a2e935b8a2b.r2.dev",
            },
            {
                protocol: "https",
                hostname: "ytivyldglecdnhkvrevd.supabase.co",
            },
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
            },
        ],
        unoptimized: true,
    }
};

export default nextConfig;
