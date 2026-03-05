'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setProduct } from '@/lib/features/product/productSlice'

export default function InitData() {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await fetch('/api/products')
                const data = await res.json()
                if (data.success) {
                    dispatch(setProduct(data.data))
                }
            } catch (error) {
                console.error("Failed to fetch initial products:", error)
            }
        }

        fetchInitialData()
    }, [dispatch])

    return null // This component doesn't render anything
}
