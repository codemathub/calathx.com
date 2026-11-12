import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const FOOTER_SOCIALS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/CalathX-338136270170048/',
    img: '/images/2019/05/facebook.png',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/calathx',
    img: '/images/2019/07/link-1.png',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/calathx_official/',
    img: '/images/2019/05/instagram.png',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/calathx',
    img: '/images/2019/05/twitter.png',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/channel/UCHLZbXRjUGf6obeV-YuxSqw',
    img: '/images/2019/05/utube.png',
  },
  {
    name: 'Pinterest',
    href: 'https://in.pinterest.com/calathx/',
    img: '/images/2019/05/pin.png',
  },
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
      toast.success(res.data.message || 'Subscribed!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="mt-12 w-full">
      {/* Section 1: Social Icons Bar */}
      <div className="flex min-h-[80px] items-center justify-center border-b border-white bg-brand-black px-4">
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {FOOTER_SOCIALS.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="block px-[21px] py-[16px] transition-all duration-500 hover:scale-110 hover:rotate-[360deg] hover:bg-brand-primary"
              >
                <img src={s.img} alt={s.name} className="h-9 w-9 object-contain md:h-10 md:w-10" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2: Logo + Newsletter Subscribe */}
      <div className="bg-[#1b1b1b] px-4 py-7">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div className="flex justify-center md:justify-start">
            <Link to="/">
              <img
                src="/images/2019/03/calathx-logo.png"
                alt="CalathX"
                className="w-[230px] object-contain"
              />
            </Link>
          </div>

          <div className="flex justify-center md:justify-end">
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to subscribe..."
                className="h-[39px] w-full rounded-l-[5px] border border-brand-primary/40 bg-brand-black px-3 text-sm text-brand-primary placeholder:text-brand-primary/60 focus:border-brand-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-[39px] shrink-0 rounded-r-[5px] bg-brand-primary px-5 text-sm font-bold text-brand-black transition-colors hover:bg-brand-green3 disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section 3: Absolute Copyright Bar */}
      <div className="bg-brand-dark px-4 py-2 text-xs text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <ul className="flex flex-wrap items-center gap-4 text-gray-300">
            <li>
              <Link to="/about-us" className="hover:text-brand-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-brand-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/disclaimer" className="hover:text-brand-primary">
                Disclaimer
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-brand-primary">
                Contact Us
              </Link>
            </li>
          </ul>
          <p className="text-[#8c8c8c]">
            Copyright {new Date().getFullYear()} © <strong className="text-white">CalathX</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}

