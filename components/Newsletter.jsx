'use client'
import React, { useState } from 'react'
import Title from './Title'
import toast from 'react-hot-toast'

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setEmail('');
                setSubscribed(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center mx-4 my-16 sm:my-36'>
            <Title title="Join Newsletter" description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week." visibleButton={false} />
            {subscribed ? (
                <div className='flex items-center gap-3 bg-green-50 text-green-700 border border-green-200 rounded-2xl px-6 py-4 my-6 sm:my-10 font-medium text-xs sm:text-sm text-center'>
                    <span>✅ You&apos;re subscribed! Thank you for joining us.</span>
                </div>
            ) : (
                <div className='flex flex-col sm:flex-row bg-slate-100 text-sm p-1.5 sm:p-1 rounded-2xl sm:rounded-full w-full max-w-xl my-6 sm:my-10 border-2 border-white ring ring-slate-200 gap-2 sm:gap-0'>
                    <input
                        className='flex-1 pl-4 sm:pl-5 py-2.5 sm:py-0 outline-none bg-transparent text-sm placeholder:text-slate-400'
                        type="email"
                        placeholder='Enter your email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={handleSubscribe}
                        disabled={loading}
                        className='font-medium bg-green-500 text-white px-7 py-3 rounded-xl sm:rounded-full hover:scale-103 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm shrink-0'
                    >
                        {loading ? 'Subscribing...' : 'Get Updates'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Newsletter