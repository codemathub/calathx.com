import { Camera } from 'lucide-react';

const INSTAGRAM_PREVIEW_IMAGES = [
  '/images/2018/10/pexels-photo-841130.jpeg',
  '/images/2018/10/pexels-photo-1229356.jpeg',
  '/images/2018/10/pexels-photo-1556710.jpeg',
  '/images/2018/10/pexels-photo-1566404.jpeg',
  '/images/2019/05/couple-workout-1109.jpg',
  '/images/2019/05/healthy-breakfast-items.jpg',
];

export default function InstagramSection() {
  return (
    <section className="w-full pt-6">
      <div className="mb-4 flex items-center justify-center gap-2 text-center">
        <Camera className="h-7 w-7 text-brand-primary" />
        <a
          href="https://www.instagram.com/calathx_official/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-bold text-brand-primary hover:underline"
        >
          Follow Us on Instagram (@calathx_official)
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
        {INSTAGRAM_PREVIEW_IMAGES.map((src, idx) => (
          <a
            key={idx}
            href="https://www.instagram.com/calathx_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden"
          >
            <img
              src={src}
              alt="CalathX Instagram"
              loading="lazy"
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
