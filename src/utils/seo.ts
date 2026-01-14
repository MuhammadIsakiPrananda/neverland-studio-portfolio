/**
 * SEO Utility Functions
 * Helper functions untuk optimasi SEO
 */

/**
 * Generate dynamic page title
 */
export const generatePageTitle = (page: string, suffix = 'Neverland Studio'): string => {
  const titles: Record<string, string> = {
    home: 'IT Services & Digital Solutions Indonesia',
    about: 'About Us - Professional IT Company',
    services: 'Our IT Services - Web & App Development',
    'it-learning': 'IT Learning Programs - Technology Training',
    'it-solutions': 'IT Solutions - Custom Software Development',
    projects: 'Our Projects - Portfolio & Case Studies',
    team: 'Our Team - Expert IT Professionals',
    skills: 'Our Skills - Technology Expertise',
    awards: 'Awards & Recognition',
    pricing: 'Pricing Plans - Affordable IT Services',
    testimonials: 'Client Testimonials & Reviews',
    contact: 'Contact Us - Get in Touch'
  };

  const title = titles[page] || page.charAt(0).toUpperCase() + page.slice(1);
  return `${title} | ${suffix}`;
};

/**
 * Generate dynamic meta description
 */
export const generateMetaDescription = (page: string): string => {
  const descriptions: Record<string, string> = {
    home: 'Neverland Studio menyediakan solusi IT profesional untuk pembelajaran dan pengembangan digital. Jasa pembuatan website, aplikasi mobile, konsultasi IT, dan pelatihan teknologi terkini dengan harga terjangkau.',
    about: 'Kenali Neverland Studio, perusahaan IT profesional yang berpengalaman dalam pengembangan web, aplikasi mobile, dan solusi digital. Tim ahli kami siap membantu transformasi digital bisnis Anda.',
    services: 'Layanan IT lengkap dari Neverland Studio: Web Development, Mobile App Development, UI/UX Design, Cloud Solutions, IT Consulting, dan Digital Marketing. Solusi terbaik untuk bisnis Anda.',
    'it-learning': 'Program pelatihan IT dan kursus teknologi dari Neverland Studio. Belajar programming, web development, mobile development, dan teknologi terkini dengan instruktur berpengalaman.',
    'it-solutions': 'Solusi IT custom untuk kebutuhan bisnis Anda. Software development, system integration, cloud migration, dan digital transformation dengan teknologi terkini.',
    projects: 'Portfolio proyek-proyek IT yang telah kami kerjakan. Website, aplikasi mobile, sistem enterprise, dan solusi digital untuk berbagai industri.',
    team: 'Tim profesional Neverland Studio terdiri dari developer, designer, dan IT consultant berpengalaman. Dedikasi penuh untuk kesuksesan proyek Anda.',
    skills: 'Keahlian teknologi Neverland Studio mencakup React, Node.js, Laravel, Flutter, AWS, dan teknologi modern lainnya untuk solusi IT terbaik.',
    awards: 'Penghargaan dan sertifikasi yang diraih Neverland Studio sebagai bukti kualitas dan profesionalisme dalam bidang IT.',
    pricing: 'Paket harga IT services yang terjangkau dan fleksibel. Pilih paket yang sesuai dengan kebutuhan dan budget bisnis Anda.',
    testimonials: 'Testimoni dan review dari klien yang puas dengan layanan IT Neverland Studio. Kepuasan klien adalah prioritas kami.',
    contact: 'Hubungi Neverland Studio untuk konsultasi gratis tentang kebutuhan IT Anda. Tim kami siap membantu mewujudkan ide digital Anda.'
  };

  return descriptions[page] || 'Neverland Studio - Solusi IT profesional untuk bisnis Anda.';
};

/**
 * Generate keywords for page
 */
export const generateKeywords = (page: string): string => {
  const baseKeywords = 'Neverland Studio, IT Services, Web Development, Mobile App Development, Digital Solutions';
  
  const pageKeywords: Record<string, string> = {
    home: 'IT Company Indonesia, Jasa IT Terpercaya, Software Development Indonesia',
    about: 'IT Company Profile, Professional IT Team, IT Consulting Indonesia',
    services: 'Web Development Services, App Development Services, IT Outsourcing, Custom Software',
    'it-learning': 'IT Training, Programming Course, Technology Learning, Coding Bootcamp',
    'it-solutions': 'Enterprise Solutions, Cloud Solutions, System Integration, Digital Transformation',
    projects: 'IT Portfolio, Case Studies, Project Showcase, Client Projects',
    team: 'IT Team, Developers, UI/UX Designers, Project Managers',
    skills: 'React Developer, Laravel Developer, Mobile Developer, Full Stack Developer',
    awards: 'IT Awards, Certifications, Recognition, Achievements',
    pricing: 'IT Pricing, Affordable Web Development, App Development Cost',
    testimonials: 'Client Reviews, Customer Feedback, IT Testimonials',
    contact: 'Contact IT Company, IT Consultation, Free Quote, Get in Touch'
  };

  return `${baseKeywords}, ${pageKeywords[page] || ''}`;
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://portfolio.neverlandstudio.my.id';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumb = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Generate FAQ structured data
 */
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * Check if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Format date for schema.org
 */
export const formatSchemaDate = (date: Date): string => {
  return date.toISOString();
};
