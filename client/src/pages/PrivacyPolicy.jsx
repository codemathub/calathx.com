import SEOHead from '../components/Common/SEOHead';

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead title="Privacy Policy - CalathX" url="/privacy-policy" />
      <div className="bg-brand-green2 py-6 text-center text-white">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Privacy Policy</h1>
      </div>

      <div className="mx-auto my-10 max-w-[90%] space-y-4 px-4 text-justify leading-relaxed text-gray-700 md:max-w-4xl">
        <h3 className="text-xl font-bold text-brand-black">Who we are</h3>
        <p>Our website address is: https://calathx.com.</p>

        <h3 className="text-xl font-bold text-brand-black">What personal data we collect and why we collect it</h3>
        <h4 className="text-lg font-semibold text-brand-black">Comments</h4>
        <p>
          When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s
          IP address and browser user agent string to help spam detection.
        </p>

        <h4 className="text-lg font-semibold text-brand-black">Media</h4>
        <p>
          If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS)
          included. Visitors to the website can download and extract any location data from images on the website.
        </p>

        <h4 className="text-lg font-semibold text-brand-black">Cookies</h4>
        <p>
          If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies.
          These are for your convenience so that you do not have to fill in your details again when you leave another
          comment. These cookies will last for one year.
        </p>

        <h4 className="text-lg font-semibold text-brand-black">Embedded content from other websites</h4>
        <p>
          Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from
          other websites behaves in the exact same way as if the visitor has visited the other website.
        </p>

        <h3 className="text-xl font-bold text-brand-black">How long we retain your data</h3>
        <p>
          If you leave a comment, the comment and its metadata are retained indefinitely. For users that register on our
          website (if any), we also store the personal information they provide in their user profile.
        </p>

        <h3 className="text-xl font-bold text-brand-black">What rights you have over your data</h3>
        <p>
          If you have an account on this site, or have left comments, you can request to receive an exported file of the
          personal data we hold about you. You can also request that we erase any personal data we hold about you.
        </p>
      </div>
    </>
  );
}

