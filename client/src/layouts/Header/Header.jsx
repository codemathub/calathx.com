import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  TwitterXIcon,
  YouTubeIcon,
} from '../../components/Common/SocialIcons';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Fitness', to: '/fitness-workouts' },
  { label: 'Fuel', to: '/fuel' },
  { label: 'Health A-Z', to: '/health-az' },
  { label: 'Nutrition', to: '/nutrition' },
  { label: 'Video Tutorials', to: '/video-tutorials' },
  { label: 'Contact Us', to: '/contact-us' },
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/calathx_official/',
    icon: InstagramIcon,
    hoverBg: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/channel/UCHLZbXRjUGf6obeV-YuxSqw',
    icon: YouTubeIcon,
    hoverBg: 'hover:bg-[#FF0000]',
  },
  {
    name: 'X (Twitter)',
    href: 'https://twitter.com/calathx',
    icon: TwitterXIcon,
    hoverBg: 'hover:bg-black',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/CalathX-338136270170048/',
    icon: FacebookIcon,
    hoverBg: 'hover:bg-[#1877F2]',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/calathx',
    icon: LinkedInIcon,
    hoverBg: 'hover:bg-[#0A66C2]',
  },
  {
    name: 'Pinterest',
    href: 'https://in.pinterest.com/calathx/',
    icon: PinterestIcon,
    hoverBg: 'hover:bg-[#BD081C]',
  },
];

export default function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const isScrolled = scrollY > 70;
  const logoInCorner = !isHome || isScrolled;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-t-2 border-brand-primary transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md dark:bg-zinc-950/95 dark:border-brand-primary'
          : 'bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] dark:bg-[#09090b] dark:border-brand-primary'
      }`}
    >
      {/* 
        =======================================================================
        TOP ROW (68px - Original Spacious Header):
        - Center: Pure clean CalathX Logo
        - On scroll: Smoothly animates into the top-left corner
        - Right: 6 Social SVG Icons + Theme Switcher + Search
        =======================================================================
      */}
      <div className="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-gray-800 hover:bg-gray-100 hover:text-brand-primary lg:hidden transition-colors dark:text-gray-200 dark:hover:bg-zinc-800 z-30"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* LEFT / CORNER LOGO (Smoothly fades in when scrolled or on subpages) */}
        <div
          className={`absolute top-1/2 left-12 sm:left-14 lg:left-4 -translate-y-1/2 z-20 transition-opacity duration-300 ease-out ${
            logoInCorner ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Link
            to="/"
            className="group flex items-center transition-transform duration-300 hover:scale-105"
          >
            <div className="rounded-xl bg-black border border-gray-800 shadow-md px-3.5 py-1.5 hover:border-brand-primary/60 transition-colors">
              <img
                src="/images/calathx-logo-white.png"
                alt="CalathX"
                className="h-7 md:h-8 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* CENTER LOGO (Smoothly fades out on scroll, NO sliding) */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 ease-out ${
            !logoInCorner ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Link
            to="/"
            className="group flex items-center transition-transform duration-300 hover:scale-105"
          >
            <div className="rounded-2xl bg-black border border-gray-800 shadow-xl px-5 sm:px-6 py-2 sm:py-2.5 hover:border-brand-primary/60 transition-colors">
              <img
                src="/images/calathx-logo-white.png"
                alt="CalathX"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Spacer to keep controls balanced on desktop */}
        <div className="w-10 lg:w-44 shrink-0 pointer-events-none" />

        {/* RIGHT CONTROLS: 6 Social icons + Theme toggle + Search */}
        <div className="flex items-center gap-2 sm:gap-3 z-20">
          <ul className="hidden items-center gap-1.5 sm:flex">
            {SOCIAL_LINKS.map((s) => {
              const IconComp = s.icon;
              return (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110 hover:text-white hover:shadow-md dark:bg-zinc-800 dark:text-gray-300 ${s.hoverBg}`}
                  >
                    <IconComp className="h-4 w-4" />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="h-5 w-[1px] bg-gray-200 hidden sm:block dark:bg-zinc-700" />

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="group relative flex h-[36px] items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 transition-all duration-300 hover:border-brand-primary hover:bg-brand-primary hover:text-brand-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-brand-primary dark:hover:text-black shadow-sm"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-400 group-hover:text-black transition-transform duration-300 group-hover:rotate-90" />
                <span className="hidden md:inline-block">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-zinc-600 group-hover:text-black transition-transform duration-300 group-hover:-rotate-45" />
                <span className="hidden md:inline-block">Dark</span>
              </>
            )}
          </button>

          {/* Search Trigger */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((prev) => !prev)}
            className={`flex h-[36px] w-[36px] items-center justify-center rounded-full border transition-all duration-200 ${
              searchOpen
                ? 'border-brand-primary bg-brand-primary text-brand-black shadow-sm'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-brand-primary hover:bg-brand-primary hover:text-brand-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300'
            }`}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation Bar Row */}
      <nav className="hidden border-t border-gray-100 bg-white/90 backdrop-blur-sm lg:block dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4">
          <ul className="flex items-center gap-1.5 py-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="flex items-center">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-[14px] font-semibold transition-all duration-200 rounded-lg ${
                      isActive
                        ? 'text-brand-hover dark:text-brand-primary font-bold bg-brand-primary/10 dark:bg-brand-primary/15'
                        : 'text-gray-700 hover:text-brand-black hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-zinc-800/60'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Search Bar Dropdown */}
      {searchOpen && (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200 dark:bg-zinc-900/95 dark:border-zinc-800">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-xl gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fitness, nutrition, health articles..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:bg-zinc-900"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-brand-black transition-all hover:bg-brand-hover hover:text-white shadow-sm hover:shadow"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Off-Canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex w-72 max-w-full flex-col bg-white p-6 shadow-2xl dark:bg-zinc-900 dark:text-white">
            <div className="mb-6 flex items-center justify-between border-b pb-4 dark:border-zinc-800">
              <div className="rounded-lg bg-black px-2.5 py-1">
                <img
                  src="/images/calathx-logo-white.png"
                  alt="CalathX"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-brand-primary text-brand-black shadow-sm'
                          : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-gray-200 pt-6 dark:border-zinc-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Follow Us
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-brand-primary hover:text-brand-black dark:bg-zinc-800 dark:text-gray-300"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
