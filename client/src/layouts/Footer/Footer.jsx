import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  TwitterXIcon,
  YouTubeIcon,
} from '../../components/Common/SocialIcons';

const FOOTER_SOCIAL_CARDS = [
  {
    name: 'Instagram',
    handle: '@calathx_official',
    desc: 'Daily Science & Motivation',
    href: 'https://www.instagram.com/calathx_official/',
    icon: InstagramIcon,
    hoverColor: 'hover:text-rose-500',
    borderColor: 'group-hover:border-rose-500/40',
  },
  {
    name: 'YouTube',
    handle: 'CalathX Fitness',
    desc: 'Watch Workouts & Tutorials',
    href: 'https://www.youtube.com/channel/UCHLZbXRjUGf6obeV-YuxSqw',
    icon: YouTubeIcon,
    hoverColor: 'hover:text-[#FF0000]',
    borderColor: 'group-hover:border-[#FF0000]/40',
  },
  {
    name: 'X (Twitter)',
    handle: '@calathx',
    desc: 'News, Research & Updates',
    href: 'https://twitter.com/calathx',
    icon: TwitterXIcon,
    hoverColor: 'hover:text-black dark:hover:text-white',
    borderColor: 'group-hover:border-gray-500/40',
  },
  {
    name: 'LinkedIn',
    handle: 'CalathX',
    desc: 'Connect With Our Team',
    href: 'https://www.linkedin.com/company/calathx',
    icon: LinkedInIcon,
    hoverColor: 'hover:text-[#0A66C2]',
    borderColor: 'group-hover:border-[#0A66C2]/40',
  },
  {
    name: 'Facebook',
    handle: 'CalathX Community',
    desc: 'Join Our Fitness Community',
    href: 'https://www.facebook.com/CalathX-338136270170048/',
    icon: FacebookIcon,
    hoverColor: 'hover:text-[#1877F2]',
    borderColor: 'group-hover:border-[#1877F2]/40',
  },
  {
    name: 'Pinterest',
    handle: 'calathx',
    desc: 'Healthy Recipes & Workout Pins',
    href: 'https://in.pinterest.com/calathx/',
    icon: PinterestIcon,
    hoverColor: 'hover:text-[#BD081C]',
    borderColor: 'group-hover:border-[#BD081C]/40',
  },
];

const COMPANY_LINKS = [
  { label: 'About us', to: '/about-us' },
  { label: 'Contact', to: '/contact-us' },
  { label: 'Privacy policy', to: '/privacy-policy' },
  { label: 'Disclaimer', to: '/disclaimer' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.subscribers.subscribe({ email: email.trim() });
      toast.success(res.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="mt-2 md:mt-4 w-full border-t border-gray-200 bg-white text-gray-700 transition-colors duration-300 dark:border-zinc-800 dark:bg-[#09090b] dark:text-gray-300">
      
      {/* ================= SECTION 1: Original Big Social Cards Row (Above Footer) ================= */}
      <div className="border-b border-gray-100 dark:border-zinc-800/80 px-4 pt-4 pb-7 md:pt-5 md:pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {FOOTER_SOCIAL_CARDS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-gray-50/60 p-4 text-center transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2.5 hover:z-10 hover:bg-white hover:border-brand-primary hover:ring-2 hover:ring-brand-primary/50 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:hover:border-brand-primary ${s.borderColor}`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-800 shadow-sm transition-all duration-300 group-hover:scale-120 group-hover:bg-brand-primary group-hover:text-black dark:bg-zinc-800 dark:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className={`text-sm font-bold text-gray-900 dark:text-white transition-colors ${s.hoverColor}`}>
                    {s.name}
                  </h4>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                    {s.desc}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: Compact Main Footer ================= */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-9">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          
          {/* ================= LEFT (4 cols): Brand Logo & Mission ================= */}
          <div className="lg:col-span-4 space-y-3">
            <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <div className="rounded-xl bg-black px-5 py-2 border border-gray-800 shadow-md inline-block">
                <img
                  src="/images/calathx-logo-white.png"
                  alt="CalathX"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Breaking the conventional medium of workout and discovering your true potential with
              science-backed fitness, nutrition, and wellness articles.
            </p>
          </div>

          {/* ================= MIDDLE (3 cols): Company Links (in place of Explore) ================= */}
          <div className="lg:col-span-3 lg:pl-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {COMPANY_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-gray-600 transition-colors duration-200 hover:text-brand-hover dark:text-gray-400 dark:hover:text-brand-primary font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= RIGHT (5 cols): Large Prominent Sunday Reset Newsletter Card ================= */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 transition-all hover:border-brand-primary/50">
              <span className="block text-[10px] font-black uppercase tracking-widest text-brand-hover dark:text-brand-primary mb-1">
                THE SUNDAY RESET
              </span>

              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-snug">
                One useful workout, every Sunday.
              </h3>

              <p className="mt-1 mb-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Join readers who want practical advice, not noise.
              </p>

              {/* Wide Input with embedded circular arrow button */}
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="h-11 w-full rounded-full border border-gray-300 bg-white pl-5 pr-14 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-primary focus:outline-none transition-colors dark:border-zinc-700 dark:bg-black/50 dark:text-white dark:placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="absolute right-1.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-brand-primary text-black transition-all duration-300 hover:bg-brand-green3 hover:scale-105 disabled:opacity-50 shadow-sm"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* ================= Bottom Divider & Copyright ================= */}
        <div className="mt-8 pt-5 border-t border-gray-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <p>
            Copyright {new Date().getFullYear()} © <strong className="text-gray-900 dark:text-white">CalathX</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-brand-hover dark:hover:text-brand-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/disclaimer" className="hover:text-brand-hover dark:hover:text-brand-primary transition-colors">
              Disclaimer
            </Link>
            <Link to="/contact-us" className="hover:text-brand-hover dark:hover:text-brand-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
