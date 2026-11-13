import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import FloatingSidebarDrawer from '../components/Common/FloatingSidebarDrawer';

export default function MainLayout() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-[#09090b] dark:text-gray-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Global Floating "Latest & Popular" Drawer */}
      <FloatingSidebarDrawer />

      {showTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-accent bg-white text-brand-black shadow-md transition-all hover:bg-brand-primary dark:bg-zinc-800 dark:border-brand-primary dark:text-white"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
