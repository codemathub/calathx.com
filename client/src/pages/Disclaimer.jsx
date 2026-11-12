import SEOHead from '../components/Common/SEOHead';

export default function Disclaimer() {
  return (
    <>
      <SEOHead title="Disclaimer - CalathX" url="/disclaimer" />
      <div className="bg-brand-green2 py-6 text-center text-white">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Disclaimer</h1>
      </div>

      <div className="mx-auto my-10 max-w-[90%] space-y-4 px-4 text-justify leading-relaxed text-gray-700 md:max-w-4xl">
        <p>
          The information provided on CalathX.com is for educational and informational purposes only and is not intended
          as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your
          physician or other qualified health provider with any questions you may have regarding a medical condition or
          fitness program.
        </p>
        <p>
          Never disregard professional medical advice or delay in seeking it because of something you have read on this
          website. Reliance on any information provided by CalathX is solely at your own risk.
        </p>
      </div>
    </>
  );
}

