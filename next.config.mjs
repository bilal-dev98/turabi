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
        unoptimized: true
    }
};

export default nextConfig;
