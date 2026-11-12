import SEOHead from '../components/Common/SEOHead';

export default function AboutUs() {
  return (
    <>
      <SEOHead title="About Us - CalathX" url="/about-us" />
      <div className="bg-brand-green2 py-6 text-center text-white">
        <h1 className="text-3xl font-bold uppercase tracking-wide">About Us</h1>
      </div>

      <div className="mx-auto my-10 max-w-[90%] px-4 text-justify leading-relaxed text-gray-700 md:max-w-4xl">
        <h3 className="mb-4 text-2xl font-bold text-brand-black">About Us</h3>
        <p className="mb-4">
          In this arena of supplements driven world, CalathX aims to shape you in a lot different ways. Generally,
          people sculpt their bodies by going to the gym followed by intakes of supplements they add in, the practice
          of which can be good to some extent but beyond that seems to be a question.
        </p>
        <p className="mb-4">
          However, we are here to break your sweat with Calathics and several ways of body weight exercises that breaks,
          shakes and makes you. At core, CalathX is a fast-paced journey that is beyond crunches, squats and pulls
          you’ve been doing till now. Breaking the conventional medium of workout and discovering your true potential is
          what CalathX aims to do.
        </p>
        <p className="mb-4">
          So our readers can certainly be assured of getting most valuable content (that too, is backed by Science) in
          our blog.
        </p>
        <p>
          The feast doesn’t end here! At our amazing streak of blogs, we will be acquainting you with right kind of
          nutrition needed for your body, the what’s and what’s not of your intakes, exercises and everything of your
          good.
        </p>
      </div>
    </>
  );
}

