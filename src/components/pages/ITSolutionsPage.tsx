import { Code, Smartphone, Cloud, Shield, Database, Network, CheckCircle2, ArrowRight, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import ConsultationModal from '../modals/ConsultationModal';

export default function ITSolutionsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<any>(null);

  const handleConsultationClick = (solution: any) => {
    setSelectedSolution(solution);
    setIsConsultationModalOpen(true);
  };

  const solutions = [
    {
      icon: Code,
      title: 'Web Development',
      subtitle: 'Modern Web Applications',
      description: 'Build modern and responsive web applications with cutting-edge technologies to enhance your digital presence.',
      features: [
        'Custom Website Development',
        'E-Commerce Solutions',
        'Progressive Web Apps (PWA)',
        'CMS Implementation',
        'API Integration',
        'SEO Optimization'
      ],
      oldPrice: 'Mulai Rp 5.000.000',
      price: 'Mulai Rp 1.000.000',
      deliveryTime: '2-4 Weeks',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      subtitle: 'iOS & Android Applications',
      description: 'Native and cross-platform mobile applications for iOS & Android with optimal performance and best UX.',
      features: [
        'Native iOS & Android Apps',
        'React Native Development',
        'Flutter Development',
        'App Store Deployment',
        'Maintenance & Updates',
        'Push Notifications',
        'In-App Purchases Integration'
      ],
      oldPrice: 'Mulai Rp 15.000.000',
      price: 'Mulai Rp 1.000.000',
      deliveryTime: '4-8 Weeks',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Network,
      title: 'Network Infrastructure',
      subtitle: 'Enterprise Network Solutions',
      description: 'Design and implement reliable, secure, and scalable network infrastructure for your business needs.',
      features: [
        'Network Design & Planning',
        'LAN/WAN Setup',
        'Wireless Network Installation',
        'Network Security',
        'Performance Optimization'
      ],
      oldPrice: 'Mulai Rp 10.000.000',
      price: 'Mulai Rp 2.000.000',
      deliveryTime: '3-6 Weeks',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      subtitle: 'Cloud Infrastructure & Migration',
      description: 'Modern cloud infrastructure migration and management for operational efficiency and business scalability.',
      features: [
        'Cloud Migration Services',
        'AWS/Azure/GCP Setup',
        'Cloud Architecture Design',
        'DevOps & CI/CD',
        '24/7 Monitoring',
        'Cost Optimization',
        'Backup & Disaster Recovery'
      ],
      oldPrice: 'Mulai Rp 8.000.000',
      price: 'Mulai Rp 1.600.000',
      deliveryTime: '2-5 Weeks',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Database,
      title: 'System Integration',
      subtitle: 'Business Process Integration',
      description: 'Information system integration for business efficiency and more productive workflow automation.',
      features: [
        'ERP Implementation',
        'CRM Solutions',
        'Database Management',
        'Business Process Automation',
        'Third-party Integration',
        'Legacy System Migration'
      ],
      oldPrice: 'Mulai Rp 12.000.000',
      price: 'Mulai Rp 2.400.000',
      deliveryTime: '4-8 Weeks',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'IT Security',
      subtitle: 'Cybersecurity & Protection',
      description: 'Comprehensive IT security to protect your digital assets and business data from cyber threats.',
      features: [
        'Security Audit & Assessment',
        'Firewall Configuration',
        'Data Encryption',
        'Vulnerability Testing',
        'Security Training',
        'Incident Response Plan'
      ],
      oldPrice: 'Mulai Rp 7.000.000',
      price: 'Mulai Rp 1.400.000',
      deliveryTime: '2-4 Weeks',
      color: 'from-red-500 to-pink-500'
    },
  ];

  const benefits = [
    { icon: CheckCircle2, text: 'Free Consultation' },
    { icon: CheckCircle2, text: '1 Year Warranty' },
    { icon: CheckCircle2, text: '24/7 Support' },
    { icon: Briefcase, text: 'Professional Team' },
  ];

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
            linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-md mb-6">
            <Code className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('itSolutions.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t('itSolutions.hero.title')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed mb-8">
            {t('itSolutions.hero.subtitle')}
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up delay-200">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-slate-300 text-center">{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
          {solutions.map((solution, index) => (
              <div
                key={index}
                className={`h-full animate-fade-in-up delay-${Math.min((index + 1) * 100, 600)}`}
              >
                <div className="group relative h-full flex flex-col rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Header - Clean minimal design */}
                <div className="relative p-6 bg-slate-700/30 border-b border-slate-700/50">
                  <h3 className="text-2xl font-bold text-white mb-2">{solution.title}</h3>
                  <p className="text-sm text-slate-400">{solution.subtitle}</p>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {solution.description}
                  </p>

                  {/* Stats - Better spacing */}
                  <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-400">{solution.deliveryTime}</div>
                      <div className="text-xs text-slate-400">Delivery</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-cyan-400">{solution.features.length} Features</div>
                      <div className="text-xs text-slate-400">Included</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="flex-grow mb-6">
                    <h4 className="text-sm font-semibold text-white mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs text-slate-400">Price</div>
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold animate-pulse whitespace-nowrap">80% OFF</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-500 line-through">{solution.oldPrice}</div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          {solution.price}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleConsultationClick(solution)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-600/20">
                      Free Consultation
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 max-w-4xl mx-auto text-center p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business Digitally?
          </h2>
          <p className="text-slate-300 mb-6">
            Consult your IT needs with our expert team. Free and no commitment required.
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/30">
            Contact Us Now
          </button>
        </div>
      </div>

      {/* Consultation Modal */}
      {isConsultationModalOpen && selectedSolution && (
        <ConsultationModal
          theme="dark"
          solution={selectedSolution}
          onClose={() => {
            setIsConsultationModalOpen(false);
            setSelectedSolution(null);
          }}
        />
      )}
    </div>
  );
}
