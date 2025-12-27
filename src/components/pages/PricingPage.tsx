import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, Zap, Rocket, Crown, ArrowRight } from 'lucide-react';
import type { Theme, PricingPlan } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import ProjectInquiryModal from '../modals/ProjectInquiryModal';

interface PricingPageProps {
  theme: Theme;
  plans: PricingPlan[];
}

export default function PricingPage({ plans }: PricingPageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // Website Development Service Packages
  const websitePackages = [
    {
      id: 'starter',
      name: 'Starter Website',
      icon: Sparkles,
      price: 5000000,
      discount: 20,
      period: 'one-time',
      description: 'Perfect for personal portfolios and small businesses',
      features: [
        'Up to 5 pages',
        'Responsive design (mobile, tablet, desktop)',
        'Modern UI/UX design',
        'Contact form integration',
        'Social media integration',
        'Basic SEO optimization',
        'Free hosting for 1 year',
        '3 months free support',
      ],
      notIncluded: [
        'E-commerce functionality',
        'Custom animations',
        'Backend development',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional Website',
      icon: Rocket,
      price: 15000000,
      discount: 15,
      period: 'one-time',
      description: 'Ideal for growing businesses and startups',
      features: [
        'Up to 15 pages',
        'Premium responsive design',
        'Advanced UI/UX with animations',
        'Contact & newsletter forms',
        'Blog/news section',
        'Admin dashboard (CMS)',
        'Advanced SEO optimization',
        'Performance optimization',
        'Free hosting for 1 year',
        '6 months free support',
        'Analytics integration',
      ],
      notIncluded: [
        'E-commerce functionality',
        'Payment gateway integration',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Solution',
      icon: Crown,
      price: 0,
      period: 'custom',
      description: 'Custom solutions for large-scale projects',
      features: [
        'Unlimited pages',
        'Custom design & branding',
        'Full-stack development',
        'E-commerce integration',
        'Payment gateway setup',
        'User authentication system',
        'Advanced admin dashboard',
        'Real-time features',
        'API integration',
        'Database design',
        'Cloud deployment',
        'Security hardening',
        '1 year free support',
        'Priority support',
        'Regular maintenance',
      ],
      notIncluded: [],
      popular: false,
    },
  ];

  const formatPrice = (price: number): string => {
    if (price === 0) return t('pricing.customPrice');
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const calculateDiscountPrice = (price: number, discount?: number): number => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  const handleGetStarted = (pkg: typeof websitePackages[0]) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-blue-500/25 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[110px] animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/4 left-1/2 w-[350px] h-[350px] bg-pink-500/15 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('pricing.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t('pricing.hero.title')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            {t('pricing.hero.subtitle')}
          </p>
        </div>

        {/* Pricing Cards - Clean & Simple with Equal Heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto mb-16">
          {websitePackages.map((pkg) => {
            const Icon = pkg.icon;
            
            return (
              <div
                key={pkg.id}
                className={`h-full flex flex-col relative rounded-2xl bg-slate-900/50 border p-6 sm:p-8 transition-all duration-300 hover:bg-slate-900/70 ${
                  pkg.popular 
                    ? 'border-blue-500/50 shadow-xl shadow-blue-500/10' 
                    : 'border-slate-700/50'
                }`}
              >
                {/* Badges */}
                <div className="flex items-center gap-2 mb-6">
                  {pkg.popular && (
                    <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                      {t('pricing.mostPopular')}
                    </div>
                  )}
                  {pkg.discount && (
                    <div className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                      -{pkg.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Icon - Simple */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 border border-slate-700">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>

                {/* Package Info */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t(`pricing.packages.${pkg.id}.name`)}
                </h3>
                
                <p className="text-sm text-slate-400 mb-6">
                  {t(`pricing.packages.${pkg.id}.description`)}
                </p>

                {/* Price - With Discount */}
                <div className="mb-6 pb-6 border-b border-slate-700/50">
                  {pkg.price > 0 ? (
                    <>
                      {pkg.discount && (
                        <div className="text-lg text-slate-500 line-through mb-1">
                          {formatPrice(pkg.price)}
                        </div>
                      )}
                      <div className={`text-3xl font-bold mb-1 ${pkg.discount ? 'text-green-400' : 'text-white'}`}>
                        {formatPrice(calculateDiscountPrice(pkg.price, pkg.discount))}
                      </div>
                      <p className="text-xs text-slate-500">
                        {pkg.period === 'one-time' ? t('pricing.oneTimePayment') : t('pricing.contactForPricing')}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-white mb-1">
                        {t('pricing.customPrice')}
                      </div>
                      <p className="text-xs text-slate-500">
                        {t('pricing.contactForPricing')}
                      </p>
                    </>
                  )}
                </div>

                {/* Features - Clean List */}
                <div className="space-y-3 mb-6 flex-grow">
                  {t(`pricing.packages.${pkg.id}.features`, { returnObjects: true }).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                  
                  {t(`pricing.packages.${pkg.id}.notIncluded`, { returnObjects: true }).map((feature: string, idx: number) => (
                    <div key={`not-${idx}`} className="flex items-start gap-3 opacity-40">
                      <X className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-500 line-through">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Simple Button - Always at Bottom */}
                <button
                  onClick={() => handleGetStarted(pkg)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors mt-auto ${
                    pkg.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{t('pricing.getStarted')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Simple CTA Section */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-3">{t('pricing.cta.title')}</h3>
            <p className="text-slate-400 mb-6">
              {t('pricing.cta.description')}
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
            >
              <span>{t('pricing.cta.button')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPackage && (
        <ProjectInquiryModal
          theme="dark"
          package={selectedPackage}
          onClose={() => {
            setShowModal(false);
            setSelectedPackage(null);
          }}
        />
      )}
    </div>
  );
}
