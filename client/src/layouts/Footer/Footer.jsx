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

const EXPLORE_LINKS = [
  { label: 'Fitness', to: '/fitness-workouts' },
  { label: 'Fuel', to: '/fuel' },
  { label: 'Health A-Z', to: '/health-az' },
  { label: 'Nutrition', to: '/nutrition' },
  { label: 'Video Tutorials', to: '/video-tutorials' },
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
    <footer className="mt-14 w-full border-t border-gray-200 bg-white text-gray-700 transition-colors duration-300 dark:border-zinc-800 dark:bg-[#09090b] dark:text-gray-300">
      
      {/* ================= SECTION 1: Original Big Social Cards Row (Above Footer) ================= */}
      <div className="border-b border-gray-100 dark:border-zinc-800/80 px-4 py-10">
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

      {/* ================= SECTION 2: 3-Column Main Footer ================= */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* ================= LEFT: Brand Logo & Mission ================= */}
          <div className="lg:col-span-4 space-y-3.5">
            <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <div className="rounded-xl bg-black px-5 py-2.5 border border-gray-800 shadow-md inline-block">
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

          {/* ================= MIDDLE: 2 Link Columns (EXPLORE & COMPANY) ================= */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 pt-1">
            
            {/* Explore Links */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">
                EXPLORE
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {EXPLORE_LINKS.map((item) => (
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

            {/* Company Links */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">
                COMPANY
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
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

          </div>

          {/* ================= RIGHT: The Sunday Reset Newsletter Card ================= */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <span className="block text-[10px] font-black uppercase tracking-widest text-brand-hover dark:text-brand-primary mb-1">
                THE SUNDAY RESET
              </span>

              <h3 className="text-lg font-black text-gray-900 dark:text-white leading-snug">
                One useful workout, every Sunday.
              </h3>

              <p className="mt-1 mb-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Join readers who want practical advice, not noise.
              </p>

              {/* Input with embedded circular arrow button */}
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="h-10 w-full rounded-full border border-gray-300 bg-white pl-4 pr-12 text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-primary focus:outline-none transition-colors dark:border-zinc-700 dark:bg-black/50 dark:text-white dark:placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-black transition-all duration-300 hover:bg-brand-green3 hover:scale-105 disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
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
