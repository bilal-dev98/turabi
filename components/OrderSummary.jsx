import { XIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { clearCart } from '@/lib/features/cart/cartSlice';

const OrderSummary = ({ totalPrice, items, appliedCoupon }) => {

    const currency = useSelector(state => state.settings?.currency) || 'Rs';

    const router = useRouter();
    const dispatch = useDispatch();

    const [paymentMethod, setPaymentMethod] = useState('COD');

    // Inline form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        landmark: '',
        city: '',
        emergencyContact: ''
    });

    const [saveAddress, setSaveAddress] = useState(false);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.street || !formData.city) {
            throw new Error("Please fill out all required delivery fields.");
        }

        const payload = {
            items,
            totalPrice,
            addressData: {
                ...formData,
                email: 'customer@example.com', // Optional placeholder
                state: 'N/A',
                zip: '00000',
                country: 'PK'
            },
            saveAddress,
            paymentMethod,
            coupon: appliedCoupon ? appliedCoupon : undefined
        };

        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            router.push(`/order-success/${data.data[0].trackingId}`);
            // Delay clearing cart to prevent "Your cart is empty" flash before routing completes
            setTimeout(() => {
                dispatch(clearCart());
            }, 1000);
            return data.message;
        } else {
            throw new Error(data.message || "Failed to place order");
        }
    }

    return (
        <div className="w-full">
            <form id="checkout-form" onSubmit={e => toast.promise(handlePlaceOrder(e), { loading: 'Placing order...', success: 'Order placed successfully', error: (err) => err.message })} className="flex flex-col gap-10">

                {/* Shipping Information */}
                <section className="flex gap-6 bg-white/50 p-6 rounded-2xl border border-slate-200/60 flex-col">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <span className="material-symbols-outlined text-[#4799eb]">local_shipping</span>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">Shipping Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2 md:col-span-2">
                            <span className="text-sm font-semibold text-slate-700">Full Name</span>
                            <input name="name" onChange={handleFormChange} value={formData.name} className="w-full rounded-xl border-slate-200 bg-white focus:border-[#4799eb] focus:ring-1 focus:ring-[#4799eb] h-12 px-4 text-base transition-all outline-none" placeholder="Jane Doe" type="text" required />
                        </label>
                        <label className="flex flex-col gap-2 md:col-span-2">
                            <span className="text-sm font-semibold text-slate-700">Contact Number</span>
                            <input name="phone" onChange={handleFormChange} value={formData.phone} className="w-full rounded-xl border-slate-200 bg-white focus:border-[#4799eb] focus:ring-1 focus:ring-[#4799eb] h-12 px-4 text-base transition-all outline-none" placeholder="+92 300 1234567" type="tel" required />
                        </label>
                    </div>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-700">Address</span>
                        <input name="street" onChange={handleFormChange} value={formData.street} className="w-full rounded-xl border-slate-200 bg-white focus:border-[#4799eb] focus:ring-1 focus:ring-[#4799eb] h-12 px-4 text-base outline-none" placeholder="House #, Street, Area" type="text" required />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                            Famous Place / Landmark <span className="text-xs font-normal text-slate-400">(Required for delivery)</span>
                        </span>
                        <input name="landmark" onChange={handleFormChange} value={formData.landmark} className="w-full rounded-xl border-slate-200 bg-white focus:border-[#4799eb] focus:ring-1 focus:ring-[#4799eb] h-12 px-4 text-base transition-all outline-none" placeholder="Near City Hospital / Main Park" type="text" />
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <label className="flex flex-col gap-2 col-span-1">
                            <span className="text-sm font-semibold text-slate-700">City</span>
                            <input name="city" onChange={handleFormChange} value={formData.city} className="w-full rounded-xl border-slate-200 bg-white focus:border-[#4799eb] focus:ring-1 focus:ring-[#4799eb] h-12 px-4 text-base outline-none" placeholder="Karachi / Lahore / Isl" type="text" required />
                        </label>
                        <label className="flex flex-col gap-2 col-span-1 md:col-span-2">
                            <span className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                                Emergency Contact <span className="text-xs font-normal text-slate-400">(Optional)</span>
                            </span>
                            <input name="emergencyContact" onChange={handleFormChange} value={formData.emergencyContact} className="w-full rounded-xl border-slate-200 bg-white focus:border-[#4799eb] focus:ring-1 focus:ring-[#4799eb] h-12 px-4 text-base transition-all outline-none" placeholder="+92 300 0000000" type="tel" />
                        </label>
                    </div>
                </section>

                {/* Payment Details */}
                <section className="flex gap-6 bg-white/50 p-6 rounded-2xl border border-slate-200/60 flex-col">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <span className="material-symbols-outlined text-[#4799eb]">payments</span>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">Payment Method</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {/* Cash on Delivery Option */}
                        <label className="relative flex items-center p-4 cursor-pointer rounded-xl border-2 border-[#4799eb] bg-[#4799eb]/5 transition-all">
                            <input name="payment_method" type="radio" value="cod" className="sr-only" defaultChecked />
                            <div className="flex items-center gap-4 w-full">
                                <span className="material-symbols-outlined text-[#4799eb]">payments</span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">Cash on Delivery (COD)</span>
                                    <span className="text-xs text-slate-500">Pay when your order arrives</span>
                                </div>
                                <div className="ml-auto">
                                    <span className="material-symbols-outlined text-[#4799eb]">check_circle</span>
                                </div>
                            </div>
                        </label>

                        {/* Easypaisa Option (Disabled logic for now, UI only) */}
                        <label className="relative flex items-center p-4 cursor-pointer rounded-xl border border-slate-200 hover:border-[#4799eb]/50 transition-all opacity-50">
                            <input name="payment_method" type="radio" value="easypaisa" className="sr-only" disabled />
                            <div className="flex items-center gap-4 w-full">
                                <span className="material-symbols-outlined text-slate-400">account_balance_wallet</span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">Easypaisa</span>
                                    <span className="text-xs text-slate-500">Secure mobile wallet payment</span>
                                </div>
                            </div>
                        </label>

                        {/* JazzCash Option (Disabled logic for now, UI only) */}
                        <label className="relative flex items-center p-4 cursor-pointer rounded-xl border border-slate-200 hover:border-primary/50 transition-all opacity-50">
                            <input name="payment_method" type="radio" value="jazzcash" className="sr-only" disabled />
                            <div className="flex items-center gap-4 w-full">
                                <span className="material-symbols-outlined text-slate-400">phone_android</span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">JazzCash</span>
                                    <span className="text-xs text-slate-500">Pay using your JazzCash account</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-2">
                        <span className="material-symbols-outlined text-slate-400 text-sm">verified_user</span>
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Secure SSL Encrypted Transaction</span>
                    </div>
                </section>
            </form>
        </div>
    )
}

export default OrderSummary