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

    return (
        <div className="px-4 sm:px-6">
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