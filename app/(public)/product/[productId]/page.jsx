'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {
    const { productId } = useParams();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product.list);

    const fetchProduct = async () => {
        const found = products.find((p) => p.id === productId);
        if (found) {
            setProduct(found);
            return;
        }
        try {
            const res = await fetch(`/api/products/${productId}`);
            const data = await res.json();
            if (data.success && data.data) {
                setProduct(data.data);
            }
        } catch (err) {
            console.error("Error fetching product details:", err);
        }
    }

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
        window.scrollTo(0, 0);
    }, [productId, products]);

    const productJsonLd = product ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": Array.isArray(product.images) && product.images.length > 0 ? product.images : ["https://www.chandjewelry.store/logo.png"],
        "description": product.description || `${product.name} - Handcrafted luxury jewelry from Chand Jewelry.`,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": "Chand Jewelry"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://www.chandjewelry.store/product/${product.id}`,
            "priceCurrency": "PKR",
            "price": product.price,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "Chand Jewelry"
            }
        }
    } : null;

    const breadcrumbJsonLd = product ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.chandjewelry.store"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://www.chandjewelry.store/shop"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": product.category || "Jewelry",
                "item": `https://www.chandjewelry.store/shop?category=${encodeURIComponent(product.category || '')}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": product.name,
                "item": `https://www.chandjewelry.store/product/${product.id}`
            }
        ]
    } : null;

    return (
        <div className="px-4 sm:px-6">
            {productJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
                />
            )}
            {breadcrumbJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />
            )}
            <div className="max-w-7xl mx-auto">
                <div className="text-gray-500 text-xs sm:text-sm mt-5 sm:mt-8 mb-4 sm:mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}