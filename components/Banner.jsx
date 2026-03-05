'use client'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Banner() {
    const [banner, setBanner] = useState(null)
    const [visible, setVisible] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/banners/active', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (data?.success && data?.data) {
                    setBanner(data.data)
                }
            })
            .catch(() => { })
    }, [])

    if (!banner || !visible) return null

    const handleButtonClick = () => {
        if (banner.buttonAction === 'coupon' && banner.couponCode) {
            navigator.clipboard.writeText(banner.couponCode)
            toast.success(`Coupon "${banner.couponCode}" copied!`)
        } else if (banner.buttonAction === 'link' && banner.linkUrl) {
            router.push(banner.linkUrl)
        } else {
            setVisible(false)
        }
    }

    return (
        <div
            className="w-full px-6 py-2 font-medium text-sm text-center"
            style={{ background: banner.gradient || 'linear-gradient(to right, #8b5cf6, #9938CA, #E0724A)' }}
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
                <p style={{ color: banner.textColor || '#fff' }} className="font-medium text-left">
                    {banner.message}
                </p>
                <div className="flex items-center gap-4 shrink-0">
                    {banner.buttonLabel && (
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className="font-normal text-gray-800 bg-white px-6 py-1.5 rounded-full text-sm max-sm:hidden hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            {banner.buttonLabel}
                        </button>
                    )}
                    <button type="button" onClick={() => setVisible(false)} className="text-white/80 hover:text-white transition-colors" aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="currentColor" />
                            <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="currentColor" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}