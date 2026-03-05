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
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title title="Join Newsletter" description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week." visibleButton={false} />
            {subscribed ? (
                <div className='flex items-center gap-3 bg-green-50 text-green-700 border border-green-200 rounded-full px-8 py-4 my-10 font-medium text-sm'>
                    <span>✅ You&apos;re subscribed! Thank you for joining us.</span>
                </div>
            ) : (
                <div className='flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200'>
                    <input
                        className='flex-1 pl-5 outline-none bg-transparent'
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
                        className='font-medium bg-green-500 text-white px-7 py-3 rounded-full hover:scale-103 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Subscribing...' : 'Get Updates'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Newsletter