export default function sitemap() {
    const baseUrl = 'https://chandjewelry.store'
    const lastModified = new Date()

    return [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/cart`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/track-order`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ]
}
