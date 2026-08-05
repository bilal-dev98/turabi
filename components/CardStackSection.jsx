'use client'
import { CardStack } from '@/components/CardStack'
import { useEffect, useState } from 'react'

const items = [
    {
        id: 1,
        title: 'Luxury Performance',
        description: 'Experience the thrill of precision engineering',
        imageSrc: 'https://i.pinimg.com/736x/e7/cf/cb/e7cfcbd7a8af10b8839c8d9a3d8eb4ce.jpg',
        href: '/shop',
    },
    {
        id: 2,
        title: 'Elegant Design',
        description: 'Where beauty meets functionality',
        imageSrc: 'https://i.pinimg.com/736x/f4/b0/00/f4b000a6880f7e8d0c677812d789e001.jpg',
        href: '/shop',
    },
    {
        id: 3,
        title: 'Power & Speed',
        description: 'Unleash the true potential of the road',
        imageSrc: 'https://i.pinimg.com/1200x/ae/cf/d7/aecfd72b2439914647ec06d19cb182b5.jpg',
        href: '/shop',
    },
    {
        id: 4,
        title: 'Timeless Craftsmanship',
        description: 'Built with passion, driven by excellence',
        imageSrc: 'https://i.pinimg.com/736x/5d/f7/69/5df7696c4f24b7961c8c72748a355ff8.jpg',
        href: '/shop',
    },
    {
        id: 5,
        title: 'Future of Mobility',
        description: 'Innovation that moves you forward',
        imageSrc: 'https://i.pinimg.com/736x/9c/f2/8b/9cf28b4df4e06e0ca34fbe87f25734b6.jpg',
        href: '/shop',
    },
]

const CardStackSection = () => {
    const [cardWidth, setCardWidth] = useState(520)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCardWidth(Math.min(window.innerWidth - 64, 300))
            } else if (window.innerWidth < 768) {
                setCardWidth(400)
            } else {
                setCardWidth(520)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <section className="w-full py-6 sm:py-10 overflow-x-hidden">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6 px-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">
                    Featured Collection
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Shop the Highlights
                </h2>
                <p className="mt-1.5 sm:mt-2 text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                    Drag, swipe, or click through our curated picks. Each card is a world of its own.
                </p>
            </div>

            {/* Card Stack */}
            <div className="w-full flex justify-center">
                <CardStack
                    items={items}
                    cardWidth={cardWidth}
                    cardHeight={Math.round(cardWidth * 0.65)}
                    initialIndex={0}
                    autoAdvance
                    intervalMs={2500}
                    pauseOnHover
                    showDots
                />
            </div>
        </section>
    )
}

export default CardStackSection
