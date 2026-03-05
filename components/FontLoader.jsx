'use client'

import { useEffect } from 'react'

export default function FontLoader() {
    useEffect(() => {
        const reveal = () => document.body.classList.add('fonts-loaded')

        document.fonts.load("1em 'Material Symbols Outlined'")
            .then(reveal)
            .catch(reveal) // failsafe: reveal even if font load fails

        // Hard failsafe: always reveal after 2 seconds max
        const t = setTimeout(reveal, 2000)
        return () => clearTimeout(t)
    }, [])

    return null
}
