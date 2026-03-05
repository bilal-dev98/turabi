'use client'
import { useState } from 'react';
import { X, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const TrackOrderModal = ({ isOpen, onClose }) => {
    const [orderId, setOrderId] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = (e) => {
        e.preventDefault();
        setError('');
        setStatus(null);

        // Dummy logic for testing
        if (orderId === '1234567') {
            setStatus({
                id: '1234567',
                customer: 'Umar Hayat',
                status: 'In Transit',
                date: '2024-02-24',
                items: 3,
                total: '$145.00',
                steps: [
                    { label: 'Order Placed', completed: true, icon: <Clock size={16} /> },
                    { label: 'Processing', completed: true, icon: <Package size={16} /> },
                    { label: 'Shipped', completed: true, icon: <Truck size={16} /> },
                    { label: 'Delivered', completed: false, icon: <CheckCircle size={16} /> },
                ]
            });
        } else {
            setError('Order ID not found. Please try "1234567" for demo.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-300">
            <div className={`bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-bold">Track Your Order</h3>
                    <p className="text-indigo-100 text-sm mt-1">Check your Cash on Delivery (COD) status</p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Enter Tracking ID</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g. 1234567"
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Track
                                </button>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {status && (
                        <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-start pb-4 border-b border-slate-100 text-sm">
                                <div>
                                    <p className="text-slate-500">Order ID</p>
                                    <p className="font-bold text-slate-800">{status.trackingId || status.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500">Status</p>
                                    <p className="font-bold text-indigo-600">{status.status}</p>
                                </div>
                            </div>

                            <div className="relative">
                                {status.steps.map((step, index) => (
                                    <div key={index} className="flex gap-4 mb-6 last:mb-0 relative">
                                        {index !== status.steps.length - 1 && (
                                            <div className={`absolute left-[11px] top-6 w-[2px] h-full ${step.completed ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                                        )}
                                        <div className={`z-10 flex items-center justify-center size-6 rounded-full border-2 ${step.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                                            {step.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                            {step.completed && <p className="text-xs text-slate-500">Completed</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 text-center">
                    <button
                        onClick={onClose}
                        className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
                    >
                        Close Tracking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderModal;
