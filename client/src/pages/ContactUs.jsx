import { useState } from 'react';
import toast from 'react-hot-toast';
import SEOHead from '../components/Common/SEOHead';
import api from '../services/api';

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/CalathX-338136270170048/', img: '/images/2019/05/facebook.png' },
  { name: 'Instagram', href: 'https://www.instagram.com/calathx_official/', img: '/images/2019/05/instagram.png' },
  { name: 'Twitter', href: 'https://twitter.com/calathx', img: '/images/2019/05/twitter.png' },
  { name: 'Pinterest', href: 'https://in.pinterest.com/calathx/', img: '/images/2019/05/pin.png' },
  { name: 'YouTube', href: 'https://www.youtube.com/channel/UCHLZbXRjUGf6obeV-YuxSqw', img: '/images/2019/05/utube.png' },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.contact.submit(form);
      toast.success(res.data.message || 'Message sent!');
      setForm({ name: '', email: '', subject: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead title="Contact Us - CalathX" url="/contact-us" />
      <section className="border-t border-[#ebebeb] bg-[#fbfbfb] px-4 py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded shadow-xl md:grid-cols-2">
          {/* Left Column: Dark Info Panel */}
          <div className="flex flex-col items-center justify-center bg-[#0d0c0c]/85 p-10 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Contact Us</h2>
            <p className="mb-6 text-base leading-relaxed text-gray-200">
              Mobile : <a href="tel:+919953609096" className="hover:text-brand-primary">+919953609096</a>
              <br />
              Email: <a href="mailto:info@calathx.com" className="hover:text-brand-primary">info@calathx.com</a>
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="rounded-full bg-black/50 p-2 transition-transform hover:scale-110 hover:bg-brand-primary"
                >
                  <img src={s.img} alt={s.name} className="h-6 w-6 object-contain" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-[#fefcfc] p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Your Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[5px] bg-brand-primary py-2.5 text-sm font-bold uppercase text-brand-black transition-colors hover:bg-brand-hover hover:text-white disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

