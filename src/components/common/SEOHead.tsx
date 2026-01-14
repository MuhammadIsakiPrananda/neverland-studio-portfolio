import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * SEOHead - Komponen untuk mengoptimalkan SEO
 * Menambahkan meta tags, Open Graph, Twitter Cards, dan Structured Data
 */
export default function SEOHead({
  title = 'Neverland Studio | IT Services & Digital Solutions',
  description = 'Neverland Studio menyediakan solusi IT profesional untuk pembelajaran dan pengembangan digital. Jasa pembuatan website, aplikasi mobile, konsultasi IT, dan pelatihan teknologi terkini.',
  keywords = 'IT Services, Web Development, Mobile App Development, Digital Solutions, IT Learning, IT Consulting, Software Development, Neverland Studio, Jasa IT, Pembuatan Website, Aplikasi Mobile',
  image = '/src/assets/Logo Neverland Studio.png',
  url = 'https://portfolio.neverlandstudio.my.id',
  type = 'website',
  author = 'Neverland Studio',
  publishedTime,
  modifiedTime
}: SEOHeadProps) {
  const siteUrl = 'https://portfolio.neverlandstudio.my.id';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Structured Data untuk Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Neverland Studio',
    url: siteUrl,
    logo: `${siteUrl}/src/assets/Logo Neverland Studio.png`,
    description: description,
    email: 'hello@neverlandstudio.my.id',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
      addressLocality: 'Indonesia'
    },
    sameAs: [
      'https://github.com/neverlandstudio',
      'https://linkedin.com/company/neverlandstudio',
      'https://twitter.com/neverlandstudio',
      'https://instagram.com/neverlandstudio'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'hello@neverlandstudio.my.id',
      availableLanguage: ['English', 'Indonesian']
    }
  };

  // Structured Data untuk Website
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Neverland Studio',
    url: siteUrl,
    description: description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Neverland Studio" />
      <meta property="og:locale" content="id_ID" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@neverlandstudio" />
      <meta name="twitter:creator" content="@neverlandstudio" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="Indonesian" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />

      {/* Mobile & PWA */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Neverland Studio" />
      
      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Geo Tags */}
      <meta name="geo.region" content="ID" />
      <meta name="geo.placename" content="Indonesia" />

      {/* Security */}
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="origin-when-cross-origin" />
    </Helmet>
  );
}
