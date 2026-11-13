import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Dumbbell, Sparkles } from 'lucide-react';

export default function HeroBannerGrid() {
  const [reps, setReps] = useState(0);

  const handleTapRing = () => {
    setReps((prev) => (prev >= 10 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-gray-100 bg-gradient-to-b from-gray-50/70 via-white to-white transition-colors duration-300 dark:border-zinc-800/80 dark:from-zinc-950 dark:via-[#09090b] dark:to-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-2 sm:pt-8 sm:pb-3 md:pt-8 md:pb-3">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          
          {/* ================= LEFT COLUMN: Headline & CTAs (Like Image 1) ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-hover dark:bg-brand-primary/20 dark:text-brand-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Science-Backed Fitness &amp; Nutrition</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white leading-[1.1]">
              Build strength <br />
              that <span className="font-serif italic font-normal text-brand-hover dark:text-brand-primary">lasts.</span>
            </h1>

            {/* Sub-copy */}
            <p className="max-w-xl text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Science-backed workouts, honest nutrition guides, and verified health answers.
              Read a little, train a little, level up.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/fitness-workouts"
                className="inline-flex items-center gap-2 rounded-full bg-brand-black px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-brand-hover hover:scale-105 dark:bg-brand-primary dark:text-black dark:hover:bg-brand-green3"
              >
                <span>Start reading</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                to="/video-tutorials"
                className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-7 py-3 text-sm font-bold text-gray-800 transition-all duration-300 hover:border-brand-primary hover:text-brand-hover dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:border-brand-primary"
              >
                <Dumbbell className="h-4 w-4 text-brand-hover dark:text-brand-primary" />
                <span>Find my workout</span>
              </Link>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Hero Arch Visual + Interactive Rep Counter ================= */}
          <div className="relative lg:col-span-5 flex justify-center">
            
            {/* Large Arch Image Container (Matches your reference photo exactly) */}
            <div className="relative h-[380px] sm:h-[460px] w-full max-w-[380px] overflow-hidden rounded-t-[190px] rounded-b-3xl shadow-2xl border-4 border-white dark:border-zinc-800">
              <img
                src="/images/2018/10/pexels-photo-841130.jpeg"
                alt="Strength Training"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Interactive Rep Counter Widget (Floating over the image like in reference) */}
            <div
              onClick={handleTapRing}
              className="group absolute -bottom-5 left-4 sm:left-6 flex cursor-pointer select-none items-center gap-3 rounded-2xl bg-white/95 p-3.5 shadow-2xl backdrop-blur-md border border-gray-100 transition-all duration-300 hover:scale-105 dark:bg-zinc-900/95 dark:border-zinc-700"
            >
              {/* Circular Ring Gauge */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-brand-primary/30 group-hover:border-brand-primary transition-colors">
                <div className="text-center">
                  <span className="block text-lg font-black text-gray-900 dark:text-white leading-none">
                    {reps}
                  </span>
                  <span className="block text-[8px] font-bold uppercase text-gray-400">
                    / 10
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-gray-900 dark:text-white">
                  Workout Reps
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  Tap ring to log rep
                </span>
              </div>
            </div>

            {/* Floating Top Category Pill */}
            <div className="absolute top-6 right-2 sm:right-6 flex items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md border border-white/20">
              <Activity className="h-3.5 w-3.5 text-brand-primary" />
              <span>Calisthenics &amp; Gym</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
