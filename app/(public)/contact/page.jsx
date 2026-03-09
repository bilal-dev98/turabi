import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata = {
    title: "Contact Us - Turabi Store",
    description: "Get in touch with the Turabi Store team. We are here to help you.",
};

export default function ContactPage() {
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

                    {/* Right Panel: Contact Form Component */}
                    <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white relative">
                        <ContactForm />
                    </div>

                </div>
            </div>
        </div>
    );
}
