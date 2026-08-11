'use client'
import { CardStack } from '@/components/CardStack'
import { useEffect, useState } from 'react'

const defaultItems = [
    {
        id: '1',
        title: 'Handcrafted Gold Collection',
        description: 'Timeless elegance & royal craftsmanship',
        imageSrc: '/highlights/1.webp',
        href: '/shop',
    },
    {
        id: '2',
        title: 'Royal Diamond Rings',
        description: 'Precision cut solitaires & fine stones',
        imageSrc: '/highlights/2.webp',
        href: '/shop',
    },
    {
        id: '3',
        title: 'Silver Pendant Necklaces',
        description: 'Delicate chains & shimmering drops',
        imageSrc: '/highlights/3.webp',
        href: '/shop',
    },
    {
        id: '4',
        title: 'Signature Bangle Set',
        description: 'Traditional 24k gold polished artistry',
        imageSrc: '/highlights/4.webp',
        href: '/shop',
    },
    {
        id: '5',
        title: 'Luxury Wristwatches',
        description: 'Sleek gold dials with sapphire glass',
        imageSrc: '/highlights/5.webp',
        href: '/shop',
    },
]

const CardStackSection = () => {
    const [cardWidth, setCardWidth] = useState(520)
    const [highlightItems, setHighlightItems] = useState(defaultItems)

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const res = await fetch('/api/highlights')
                const data = await res.json()
                if (data.success && data.data?.length > 0) {
                    setHighlightItems(data.data)
                }
            } catch (err) {
                console.error("Failed to fetch highlights:", err)
            }
        }
        fetchHighlights()
    }, [])

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
                    items={highlightItems}
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
