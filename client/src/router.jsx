import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const TagPage = lazy(() => import('./pages/TagPage'));
const SinglePost = lazy(() => import('./pages/SinglePost'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const PostsList = lazy(() => import('./pages/admin/PostsList'));
const PostEditor = lazy(() => import('./pages/admin/PostEditor'));
const CategoriesManager = lazy(() => import('./pages/admin/CategoriesManager'));
const MediaLibrary = lazy(() => import('./pages/admin/MediaLibrary'));
const SubscribersList = lazy(() => import('./pages/admin/SubscribersList'));
const ContactSubmissions = lazy(() => import('./pages/admin/ContactSubmissions'));
const SiteSettings = lazy(() => import('./pages/admin/SiteSettings'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/tag/:slug" element={<TagPage />} />

          {/* Exact WordPress category slugs */}
          <Route path="/fitness-workouts" element={<CategoryPage />} />
          <Route path="/fuel" element={<CategoryPage />} />
          <Route path="/health-az" element={<CategoryPage />} />
          <Route path="/nutrition" element={<CategoryPage />} />
          <Route path="/myth-buster" element={<CategoryPage />} />
          <Route path="/video-tutorials" element={<CategoryPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />

          {/* Exact WordPress post permalink: /:category/:slug */}
          <Route path="/:category/:slug" element={<SinglePost />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin CMS Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/edit/:slug" element={<PostEditor />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="subscribers" element={<SubscribersList />} />
          <Route path="contacts" element={<ContactSubmissions />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

