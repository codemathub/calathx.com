import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const HERO_CARDS = [
  {
    span: 'md:col-span-4',
    title: 'Human Growth Hormone (HGH) Side Effects: HGH Gut & Palumboism',
    image: '/images/2019/05/Bioxyn-1.jpg',
    to: '/health-az/human-growth-hormone-hgh-side-effects-and-myth-about-hgh-gut-palumboism',
    overlay: 'rgba(9, 6, 6, 0.6)',
    bgPos: '32% 58%',
  },
  {
    span: 'md:col-span-4',
    title: 'Why You Should Work Out with Your Partner ?',
    image: '/images/2019/05/couple-workout-1109.jpg',
    to: '/fitness-workouts/why-couple-work-out-with-partner-beneficial',
    overlay: 'rgba(9, 8, 8, 0.73)',
    bgPos: '47% 55%',
  },
  {
    span: 'md:col-span-4',
    title: 'Best Weight Loss Supplement ?',
    image: '/images/2019/05/exercise-routine.jpg',
    to: '/fuel',
    overlay: 'rgba(11, 10, 10, 0.69)',
    bgPos: '66% 22%',
  },
  {
    span: 'md:col-span-6',
    title: 'Top 5 Fitness Apps to Solve Your Workout Problems',
    image: '/images/2018/10/pexels-photo-841130.jpeg',
    to: '/fitness-workouts/top-5-fitness-apps-to-solve-your-workout-problems',
    overlay: 'rgba(14, 13, 13, 0.69)',
    bgPos: 'center',
  },
  {
    span: 'md:col-span-6',
    title: 'Why Shouldn’t We Drink Tea Empty Stomach',
    image: '/images/2018/10/1.jpg',
    to: '/nutrition/side-effects-of-having-morning-tea',
    overlay: 'rgba(11, 8, 8, 0.62)',
    bgPos: '61% 30%',
  },
];

export default function HeroBannerGrid() {
  return (
    <section className="w-full px-1 pt-1">
      <div className="grid grid-cols-1 gap-1.5 md:h-[590px] md:grid-cols-12 md:grid-rows-2">
        {HERO_CARDS.map((card, idx) => (
          <Link
            key={idx}
            to={card.to}
            className={`group relative min-h-[240px] overflow-hidden md:min-h-0 ${card.span}`}
          >
            <div
              className="absolute inset-0 bg-cover transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${card.image})`,
                backgroundPosition: card.bgPos,
              }}
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
            <div
              className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-5 py-4 text-white"
              style={{ backgroundColor: card.overlay }}
            >
              <h3 className="text-base font-bold leading-snug text-white md:text-lg">
                {card.title}
              </h3>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white/80 text-white transition-colors group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-brand-black">
                <Play className="h-4 w-4 fill-current" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

