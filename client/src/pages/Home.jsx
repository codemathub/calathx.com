import SEOHead from '../components/Common/SEOHead';
import HeroBannerGrid from '../components/Posts/HeroBannerGrid';
import VideoTutorialsSection from '../components/Posts/VideoTutorialsSection';
import CategoryCardsRow from '../components/Posts/CategoryCardsRow';
import LatestBlogRow from '../components/Posts/LatestBlogRow';
import InstagramSection from '../components/Posts/InstagramSection';

export default function Home() {
  return (
    <>
      <SEOHead
        title="CalathX - Health, Fitness & Wellness"
        description="Breaking the conventional medium of workout and discovering your true potential with science-backed fitness, nutrition, and wellness articles."
        url="/"
      />

      {/* 1. Hero Section */}
      <HeroBannerGrid />

      {/* 2. Video Tutorials & Workout Section (Directly Below Hero with Play on Click & View More) */}
      <VideoTutorialsSection />

      {/* 3. Category Grids (4 Cards Each with Zoom & Highlight Hover Effects) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16 xl:px-20 pt-1 pb-2 sm:pt-2 sm:pb-3">
        {/* Fitness */}
        <CategoryCardsRow
          title="Fitness"
          slug="fitness-workouts"
          icon="/images/2019/07/fitness.png"
          description="High-intensity routines, calisthenics breakdowns, and progressive strength plans."
        />

        {/* Fuel */}
        <CategoryCardsRow
          title="Fuel"
          slug="fuel"
          icon="/images/2019/07/fuel.png"
          description="Optimal fueling strategies, clean supplements, and hydration science."
        />

        {/* Health A-Z */}
        <CategoryCardsRow
          title="Health A-Z"
          slug="health-az"
          icon="/images/2019/07/health.png"
          description="Science-backed health answers, injury prevention, and everyday longevity."
        />

        {/* Nutrition */}
        <CategoryCardsRow
          title="Nutrition"
          slug="nutrition"
          icon="/images/2019/07/nutrition.png"
          description="Macro guidelines, whole-food recipes, and sustainable eating protocols."
        />
      </div>

      {/* 4. Latest Blog Row */}
      <LatestBlogRow />

      {/* 5. Follow Us on Instagram */}
      <InstagramSection />
    </>
  );
}
