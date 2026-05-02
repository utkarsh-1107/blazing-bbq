'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContact(form);
      if (res.success) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-64 md:h-80">
        <Image
          src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1200&h=400&fit=crop"
          alt="Contact Us"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Contact Us</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>

            {success && (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value.slice(0, 255) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                  placeholder="How can we help you?"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {form.message.length}/255
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2',
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-600'
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Get in touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Primary Contact</h3>
                  <a href="tel:+919321836106" className="text-gray-600 hover:text-primary">
                    +91 9321836106
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Thane Branch</h3>
                  <a href="tel:+918369434959" className="text-gray-600 hover:text-primary">
                    +91 8369434959
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                  <a
                    href="mailto:blazingbarbecue@gmail.com"
                    className="text-gray-600 hover:text-primary"
                  >
                    blazingbarbecue@gmail.com
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">Thane, Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-white">
              <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-white/80">Monday - Friday</span>
                  <span>11:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/80">Saturday</span>
                  <span>11:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/80">Sunday</span>
                  <span>12:00 PM - 10:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
