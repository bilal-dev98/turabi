'use client'
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const metadata = {
    title: "Contact Us - Turabi Store",
    description: "Get in touch with the Turabi Store team. We are here to help you.",
};

export default function ContactPage() {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const name = `${formData.firstName} ${formData.lastName}`.trim();
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: formData.email, phone: formData.phone, message: formData.message }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Message sent successfully!");
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
            } else {
                toast.error(data.message || "Failed to send message.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-slate-600">
                        Have a question, feedback, or need assistance? Our team is here to help. Reach out to us using the form below or through our contact information.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                    {/* Left Panel: Contact Info */}
                    <div className="p-6 sm:p-8 md:p-12 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <p className="text-slate-300 mb-12">
                                Fill up the form and our Team will get back to you within 24 hours.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-full text-primary">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">WhatsApp</h3>
                                        <p className="text-slate-300 mt-1">+92 325 5821056<br />+92 309 9162733</p>
                                        <p className="text-slate-400 text-sm mt-1">Mon-Sat from 9am to 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-full text-primary">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email</h3>
                                        <p className="text-slate-300 mt-1">info@turabi.store</p>
                                        <p className="text-slate-400 text-sm mt-1">Online support 24/7</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-full text-primary">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Office</h3>
                                        <p className="text-slate-300 mt-1">Shams Colony H-13 Islamabad<br />Pindora chungi Rawalpindi Punjab</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-full text-primary">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Working Hours</h3>
                                        <p className="text-slate-300 mt-1">Monday - Friday: 9:00 AM - 6:00 PM<br />Weekend: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-16 flex gap-4">
                            {/* Social Icons Placeholder */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                <span className="font-bold text-sm">FB</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                <span className="font-bold text-sm">TW</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                <span className="font-bold text-sm">IG</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Panel: Contact Form */}
                    <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white relative">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">First Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message <span className="text-red-500">*</span></label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 px-6 rounded-xl bg-primary text-slate-900 font-bold hover:bg-[#0be052] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <>Send Message <Send size={18} /></>}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
