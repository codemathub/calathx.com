import { useState, useEffect, useRef } from 'react';
import { Flame, X } from 'lucide-react';
import Sidebar from '../../layouts/Sidebar/Sidebar';

export default function FloatingSidebarDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* ================= Floating Trigger Tab (Well-Proportioned Vertical Tab) ================= */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsOpen(true)}
          className="group relative flex flex-col items-center gap-2 rounded-l-xl border-y border-l border-brand-primary/50 bg-black/95 py-3 px-2 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-black hover:pl-2.5 hover:shadow-brand-primary/30 dark:bg-zinc-900/95 dark:border-brand-primary/40 cursor-pointer"
          aria-label="Open Popular and Latest posts"
          title="Open Popular & Latest"
        >
          {/* Flame Icon */}
          <div className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-brand-primary text-black shadow-sm transition-transform duration-300 group-hover:scale-110">
            <Flame className="h-3.5 w-3.5 fill-current text-black" />
          </div>

          {/* Vertical Text */}
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-black uppercase tracking-wider text-white whitespace-nowrap group-hover:text-brand-primary transition-colors py-1">
            Popular &amp; Latest
          </span>
        </button>
      </div>

      {/* ================= Slide-Over Drawer Backdrop & Container ================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        {/* Slide-out Panel */}
        <div
          ref={drawerRef}
          className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transform transition-transform duration-500 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl dark:bg-zinc-900 flex flex-col h-full border-l border-gray-200 dark:border-zinc-800">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  Explore CalathX
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Latest stories, popular reads &amp; newsletter
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content: Houses the Sidebar */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <Sidebar />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
