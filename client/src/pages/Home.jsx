import SEOHead from '../components/Common/SEOHead';
import HeroBannerGrid from '../components/Posts/HeroBannerGrid';
import CategorySection from '../components/Posts/CategorySection';
import LatestBlogRow from '../components/Posts/LatestBlogRow';
import InstagramSection from '../components/Posts/InstagramSection';
import Sidebar from '../layouts/Sidebar/Sidebar';

export default function Home() {
  return (
    <>
      <SEOHead
        title="CalathX - Health, Fitness & Wellness"
        description="Breaking the conventional medium of workout and discovering your true potential with science-backed fitness, nutrition, and wellness articles."
        url="/"
      />

      {/* 1. Hero Banner Grid (Full Width Video Block) */}
      <HeroBannerGrid />

      {/* 2. Main 9-Col Content + 3-Col Sidebar */}
      <div className="mx-auto mt-8 max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <CategorySection
              title="Fitness"
              slug="fitness-workouts"
              icon="/images/2019/07/fitness.png"
              variant="masonry"
            />
            <CategorySection
              title="Fuel"
              slug="fuel"
              icon="/images/2019/07/fuel.png"
              variant="overlay"
            />
            <CategorySection
              title="Health A-Z"
              slug="health-az"
              icon="/images/2019/07/health.png"
              variant="masonry"
            />
            <CategorySection
              title="Nutrition"
              slug="nutrition"
              icon="/images/2019/07/nutrition.png"
              variant="overlay"
            />
          </div>

          <div className="hidden lg:col-span-3 lg:block">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* 3. Latest Blog Row */}
      <LatestBlogRow />

      {/* 4. Follow Us on Instagram */}
      <InstagramSection />
    </>
  );
}

