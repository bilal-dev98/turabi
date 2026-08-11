export default function manifest() {
    return {
        name: 'Chand Jewelry - Handcrafted Luxury Jewelry',
        short_name: 'Chand Jewelry',
        description: 'Premier online store for handcrafted luxury jewelry, gold & silver rings, necklaces, watches and fine accessories in Pakistan.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#09090b',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
