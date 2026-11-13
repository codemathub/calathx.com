import { ArrowRight } from 'lucide-react';
import { InstagramIcon } from '../Common/SocialIcons';

const INSTAGRAM_POSTS = [
  {
    src: '/images/2018/10/pexels-photo-841130.jpeg',
    alt: 'Strength & Conditioning Training',
  },
  {
    src: '/images/2019/05/healthy-breakfast-items.jpg',
    alt: 'Nutrition & Healthy Fuel',
  },
  {
    src: '/images/2023/11/women-workout-scaled.jpg',
    alt: 'Cardio & Running Routines',
  },
  {
    src: '/images/2023/11/strength-training.jpg',
    alt: 'Weightlifting & Gym Form',
  },
  {
    src: '/images/2018/10/2.jpg',
    alt: 'Clean Eating & Whole Foods',
  },
  {
    src: '/images/2018/10/pexels-photo-1229356.jpeg',
    alt: 'Outdoor Fitness & Calisthenics',
  },
];

export default function InstagramSection() {
  return (
    <section className="w-full pt-8 pb-3 md:pt-10 md:pb-4 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* ================= Header (Matches Reference Image Exactly) ================= */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-[#5c6e58] dark:text-brand-primary">
              FOLLOW THE MOVEMENT
            </span>
            <a
              href="https://www.instagram.com/calathx_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-2.5 text-2xl sm:text-3xl font-black text-gray-900 transition-colors hover:text-brand-hover dark:text-white dark:hover:text-brand-primary"
            >
              <InstagramIcon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-900 dark:text-white" />
              <span>@calathx</span>
            </a>
          </div>

          <a
            href="https://www.instagram.com/calathx_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <span>Follow on Instagram</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* ================= 6 Image Cards Grid ================= */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-6 lg:gap-4">
          {INSTAGRAM_POSTS.map((item, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/calathx_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl bg-zinc-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-800"
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hover Overlay with Instagram Icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <InstagramIcon className="h-5 w-5" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
