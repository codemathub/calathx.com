import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';

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
  { name: 'Facebook', href: 'https://www.facebook.com/CalathX-338136270170048/', icon: 'f' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/calathx', icon: 'in' },
  { name: 'Instagram', href: 'https://www.instagram.com/calathx_official/', icon: 'ig' },
  { name: 'Twitter', href: 'https://twitter.com/calathx', icon: 'tw' },
  { name: 'YouTube', href: 'https://www.youtube.com/channel/UCHLZbXRjUGf6obeV-YuxSqw', icon: 'yt' },
  { name: 'Pinterest', href: 'https://in.pinterest.com/calathx/', icon: 'p' },
];

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-t-2 border-brand-primary bg-white transition-all duration-300 ${
        stuck ? 'opacity-90 shadow-md' : 'shadow-[0_3px_8px_0_rgba(0,0,0,0.2)]'
      }`}
    >
      {/* Main Header Row (66px) */}
      <div className="mx-auto flex h-[66px] max-w-7xl items-center justify-between px-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="rounded p-2 text-brand-black hover:text-brand-primary lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/2019/03/calathx-logo.png"
            alt="CalathX"
            className="h-11 w-auto max-w-[200px] object-contain md:max-w-[230px]"
          />
        </Link>

        {/* Right: Social Circle Icons + Search */}
        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-1.5 sm:flex">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-[33px] w-[33px] items-center justify-center rounded-full bg-brand-black text-xs font-bold uppercase text-white transition-all duration-300 hover:rotate-[360deg] hover:bg-brand-primary hover:text-brand-black"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((prev) => !prev)}
            className="flex h-[33px] w-[33px] items-center justify-center rounded-full border border-gray-200 text-brand-black transition-colors hover:border-brand-primary hover:bg-brand-primary"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Header Bottom Navigation Bar */}
      <nav className="hidden border-t border-[#ddd] bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4">
          <ul className="flex items-center">
            {NAV_ITEMS.map((item, idx) => (
              <li key={item.to} className="flex items-center">
                {idx > 0 && <span className="text-gray-300 select-none">|</span>}
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative px-[15px] py-[10.5px] text-[15px] font-semibold text-brand-black transition-colors hover:text-brand-hover ${
                      isActive
                        ? 'after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-brand-primary'
                        : 'hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-[3px] hover:after:w-full hover:after:bg-brand-primary'
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
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-xl gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fitness, nutrition, health articles..."
              className="w-full rounded-[10px] border border-gray-300 bg-white px-4 py-2 text-sm focus:border-brand-primary focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-[5px] bg-brand-primary px-5 py-2 text-sm font-bold text-brand-black transition-colors hover:bg-brand-hover hover:text-white"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Off-Canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex w-72 max-w-full flex-col bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <img src="/images/2019/03/calathx-logo.png" alt="CalathX" className="h-9 w-auto" />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6 text-gray-700" />
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
                      `block rounded px-3 py-2.5 text-sm font-semibold ${
                        isActive ? 'bg-brand-primary text-brand-black' : 'text-gray-800 hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

