import { Helmet } from 'react-helmet-async';

export default function SEOHead({
  title = 'CalathX - Health, Fitness & Wellness',
  description = 'Breaking the conventional medium of workout and discovering your true potential with science-backed fitness, nutrition, and wellness articles.',
  image = '/images/2019/03/calathx-logo.png',
  url = '',
  type = 'website',
  schema = null,
}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://calathx.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image?.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
}

