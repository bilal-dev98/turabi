'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { getColorHex } from "@/lib/colors";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Cart() {

    const currency = useSelector(state => state.settings?.currency) || '$';

    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Coupon states
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            // key can be `productId` or `productId-color`
            const [id, color] = key.split('-');
            const product = products.find(product => product.id === id);
            if (product) {
                cartArray.push({
                    ...product,
                    cartItemId: key,
                    color: color || null,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (cartItemId) => {
        const [productId, color] = cartItemId.split('-');
        dispatch(deleteItemFromCart({ productId, color }))
    }

    const handleApplyCoupon = async () => {
        if (!couponCodeInput.trim()) return;
        setIsApplyingCoupon(true);

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCodeInput })
            });
            const data = await res.json();

            if (data.success) {
                setAppliedCoupon(data.data);
                toast.success(`Coupon applied! ${data.data.discount}% off.`);
                setCouponCodeInput('');
            } else {
                toast.error(data.message || "Invalid coupon");
                setAppliedCoupon(null);
            }
        } catch (error) {
            toast.error("Failed to connect to server");
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        toast.error("Coupon removed");
    };

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    // Calculate dynamic totals
    const discountAmount = appliedCoupon ? (totalPrice * (appliedCoupon.discount / 100)) : 0;
    const subtotalAfterDiscount = totalPrice - discountAmount;
    const estimatedTax = subtotalAfterDiscount * 0.05;
    const finalTotal = subtotalAfterDiscount + estimatedTax;

    return cartArray.length > 0 ? (
        <div className="bg-[#f6f7f8] text-slate-900 min-h-screen antialiased">
            <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Checkout Details */}
                    <div className="lg:col-span-7 flex flex-col gap-10">
                        {/* Header Section */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Checkout</h1>
                            <p className="text-slate-500 text-lg">Review your order and complete your purchase securely.</p>
                        </div>

                        <OrderSummary totalPrice={finalTotal} items={cartArray} appliedCoupon={appliedCoupon} />
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-[#4799eb]/20">
                            <h3 className="text-xl font-bold mb-6 text-slate-900">Order Summary</h3>

                            {/* Items */}
                            <div className="flex flex-col gap-6 mb-8">
                                {cartArray.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <div className="h-20 w-20 bg-[#4799eb]/100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200 p-1">
                                            <Image src={item.images[0]} className="h-full w-auto object-contain" alt={item.name} width={70} height={70} />
                                        </div>
                                        <div className="flex flex-col justify-center flex-1">
                                            <p className="font-bold text-slate-900 line-clamp-2 leading-tight">{item.name}</p>
                                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                                {item.category}
                                                {item.color && (
                                                    <>
                                                        <span className="text-slate-300">•</span>
                                                        <span className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-sm inline-block" style={{ backgroundColor: getColorHex(item.color) }}></span>
                                                        <span className="font-medium text-slate-600">{item.color}</span>
                                                    </>
                                                )}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm font-medium text-slate-400">Qty: {item.quantity}</span>
                                                <span className="font-bold text-slate-900">{currency} {(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Coupon Code</label>
                                {!appliedCoupon ? (
                                    <div className="flex gap-2 relative">
                                        <input
                                            value={couponCodeInput}
                                            onChange={(e) => setCouponCodeInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                            disabled={isApplyingCoupon}
                                            className="flex-1 rounded-xl border border-slate-200 bg-white focus:border-[#4799eb] focus:ring-1 focus:ring-[#4799eb] h-11 px-4 text-sm uppercase placeholder:normal-case outline-none transition-all disabled:opacity-50"
                                            placeholder="Enter code"
                                            type="text"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon || !couponCodeInput}
                                            className="bg-[#4799eb] text-white font-bold px-6 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#4799eb]/30 bg-[#4799eb]/5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#4799eb] flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">sell</span>{appliedCoupon.code}</span>
                                            <span className="text-xs text-slate-500">{appliedCoupon.discount}% Off Applied</span>
                                        </div>
                                        <button type="button" onClick={handleRemoveCoupon} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Remove coupon">
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>{currency} {totalPrice.toLocaleString()}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-[#4799eb] font-medium">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>-{currency} {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="text-blue-500 font-medium">Calculated at next step</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Estimated Tax (5%)</span>
                                    <span>{currency} {estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-100">
                                    <span className="text-xl font-bold text-slate-900">Total</span>
                                    <span className="text-2xl font-black text-slate-900">{currency} {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <button type="submit" form="checkout-form" className="w-full mt-8 bg-[#4799eb] hover:bg-[#4799eb]/90 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-[#4799eb]/20 flex items-center justify-center gap-2 group">
                                <span>Complete Purchase</span>
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-8 flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-widest font-bold">
                                    <span className="material-symbols-outlined text-sm">lock</span>
                                    Secure Checkout
                                </div>
                                <p className="text-xs text-center text-slate-400 leading-relaxed">
                                    Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] flex items-center justify-center text-slate-400 bg-[#f6f7f8]">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}