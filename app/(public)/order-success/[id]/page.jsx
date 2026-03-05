'use client'
import PageTitle from "@/components/PageTitle"
import { useParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 lg:p-10 text-center border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="size-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
                <p className="text-slate-500 mb-8">Thank you for your purchase. We have received your order and are getting it ready to be shipped.</p>

                <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-100">
                    <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">Order Tracking ID</p>
                    <p className="font-mono text-xl font-bold text-slate-800 break-all bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm text-center">
                        {id ? id.toUpperCase() : "UNKNOWN"}
                    </p>
                    <p className="text-xs text-slate-400 mt-4 text-center">Save this ID to track your order status in the future.</p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push('/track-order')}
                        className="w-full bg-[#0056d2] hover:bg-[#004bb8] text-white font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all"
                    >
                        Track Order
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )
}
