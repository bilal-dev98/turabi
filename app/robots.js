export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/admin/', '/store/'],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/admin/', '/api/admin/'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Bytespider',
                allow: '/',
            }
        ],
        sitemap: 'https://www.chandjewelry.store/sitemap.xml',
    }
}
