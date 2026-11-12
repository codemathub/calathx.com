import { Link } from 'react-router-dom';
import SEOHead from '../components/Common/SEOHead';

export default function NotFound() {
  return (
    <>
      <SEOHead title="Page Not Found - CalathX" />
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-6xl font-black text-brand-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-brand-black">Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-[5px] bg-brand-primary px-6 py-2.5 text-sm font-bold uppercase text-brand-black transition-colors hover:bg-brand-hover hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}

