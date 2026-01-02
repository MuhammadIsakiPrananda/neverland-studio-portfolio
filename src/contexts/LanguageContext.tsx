import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'id') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      aboutUs: 'About Us',
      team: 'Team',
      skills: 'Skills',
      awards: 'Awards & Achievements',
      services: 'Services',
      allServices: 'All Services',
      itLearning: 'IT Learning',
      itSolutions: 'IT Solutions',
      itConsulting: 'IT Consulting',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      testimonials: 'Testimonials',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      editProfile: 'Edit Profile',
      myAccount: 'My Account',
      settings: 'Settings'
    },
    home: {
      hero: {
        greeting: 'Welcome to',
        title: 'Neverland Studio',
        subtitle: 'Transforming Ideas into Digital Excellence',
        description: 'We are a team of passionate developers, designers, and innovators dedicated to creating cutting-edge digital solutions that drive business growth and success.',
        cta: 'Get Started',
        learnMore: 'Learn More'
      },
      stats: {
        projects: 'Projects Completed',
        clients: 'Happy Clients',
        experience: 'Years Experience',
        awards: 'Awards Won'
      },
      services: {
        title: 'Our Services',
        subtitle: 'Comprehensive Solutions for Your Digital Needs',
        learning: {
          title: 'IT Learning',
          description: 'Master cutting-edge technologies with our expert-led courses. From web development to AI, we offer comprehensive training programs.'
        },
        solutions: {
          title: 'IT Solutions',
          description: 'Custom software development and IT consulting services tailored to your business needs. We build scalable and efficient solutions.'
        },
        explore: 'Explore Services'
      },
      features: {
        title: 'Why Choose Us',
        subtitle: 'What Makes Us Different',
        quality: {
          title: 'Quality Assured',
          description: 'We maintain the highest standards in every project we deliver'
        },
        support: {
          title: '24/7 Support',
          description: 'Round-the-clock assistance for all your technical needs'
        },
        innovation: {
          title: 'Innovation First',
          description: 'Leveraging latest technologies to create cutting-edge solutions'
        },
        experience: {
          title: 'Expert Team',
          description: 'Seasoned professionals with years of industry experience'
        }
      },
      testimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Real feedback from real clients',
        viewAll: 'View All Testimonials',
        writeReview: 'Write a Review'
      },
      cta: {
        title: 'Ready to Start Your Project?',
        subtitle: "Let's work together to bring your ideas to life",
        button: 'Contact Us Now'
      }
    },
    about: {
      hero: {
        title: 'About Neverland Studio',
        subtitle: 'Crafting Digital Excellence Since 2025'
      },
      story: {
        title: 'Our Story',
        content: 'Founded in 2025, Neverland Studio emerged from a passion for creating exceptional digital experiences. We started as a small team of developers and designers who believed that technology should be accessible, beautiful, and powerful. Today, we\'ve grown into a full-service digital agency, but our core values remain the same: innovation, quality, and client satisfaction.'
      },
      mission: {
        title: 'Our Mission',
        content: 'To empower businesses and individuals through innovative digital solutions that drive growth, enhance user experiences, and create lasting value. We strive to be more than just a service provider – we aim to be your technology partner.'
      },
      vision: {
        title: 'Our Vision',
        content: 'To become a leading digital solutions provider in Southeast Asia, recognized for our commitment to excellence, innovation, and client success. We envision a future where technology seamlessly integrates with business needs to create extraordinary outcomes.'
      },
      values: {
        title: 'Our Core Values',
        innovation: {
          title: 'Innovation',
          description: 'We embrace cutting-edge technologies and creative solutions'
        },
        excellence: {
          title: 'Excellence',
          description: 'We deliver nothing but the highest quality in everything we do'
        },
        integrity: {
          title: 'Integrity',
          description: 'We build trust through transparency and honest communication'
        },
        collaboration: {
          title: 'Collaboration',
          description: 'We work closely with clients as partners in success'
        }
      },
      cta: {
        title: 'Want to know more about us?',
        button: 'Contact Us'
      }
    },
    team: {
      badge: 'Our Amazing Team',
      hero: {
        title: 'Meet Our Team',
        subtitle: 'Our talented team of experts brings together diverse skills and experiences to deliver exceptional results for every project'
      },
      stats: {
        projects: 'Projects',
        experience: 'Exp'
      },
      roles: {
        founder: 'Founder & CEO',
        cto: 'Chief Technology Officer',
        designer: 'Lead Designer',
        developer: 'Senior Developer',
        manager: 'Project Manager',
        marketing: 'Marketing Director'
      }
    },
    awards: {
      badge: 'Recognition & Excellence',
      hero: {
        title: 'Awards & Achievements',
        subtitle: 'Recognition for our excellence, innovation, and commitment to delivering outstanding results'
      },
      year: 'Year',
      categories: {
        technology: 'Technology',
        design: 'Design',
        business: 'Business',
        service: 'Service',
        innovation: 'Innovation'
      },
      stats: {
        totalAwards: 'Total Awards',
        categories: 'Categories',
        years: 'Years',
        global: 'Global',
        recognition: 'Recognition'
      }
    },
    services: {
      badge: 'Professional IT Services',
      hero: {
        title: 'Our Services',
        subtitle: 'Comprehensive IT solutions designed to drive your business forward with cutting-edge technology'
      },
      categories: {
        webDevelopment: {
          title: 'Web Development',
          description: 'Custom websites and web applications built with modern technologies for scalability and performance.',
          subServices: {
            corporate: {
              name: 'Corporate Website',
              details: 'Professional company profile with CMS'
            },
            ecommerce: {
              name: 'E-Commerce Platform',
              details: 'Full-featured online store with payment gateway'
            },
            webapp: {
              name: 'Web Applications',
              details: 'Custom SaaS and enterprise solutions'
            },
            pwa: {
              name: 'Progressive Web Apps',
              details: 'Offline-capable responsive applications'
            },
            landing: {
              name: 'Landing Pages',
              details: 'High-converting marketing pages'
            },
            api: {
              name: 'API Development',
              details: 'RESTful & GraphQL API services'
            }
          }
        },
        mobileApps: {
          title: 'Mobile App Development',
          description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
          subServices: {
            ios: {
              name: 'iOS Development',
              details: 'Swift & SwiftUI native apps'
            },
            android: {
              name: 'Android Development',
              details: 'Kotlin & Jetpack Compose apps'
            },
            reactNative: {
              name: 'React Native Apps',
              details: 'Cross-platform JavaScript solutions'
            },
            flutter: {
              name: 'Flutter Apps',
              details: 'High-performance Dart applications'
            },
            aso: {
              name: 'App Store Optimization',
              details: 'Publishing & ASO services'
            },
            maintenance: {
              name: 'App Maintenance',
              details: 'Updates, bug fixes & support'
            }
          }
        },
        cloudSolutions: {
          title: 'Cloud Solutions',
          description: 'Scalable cloud infrastructure and migration services to modernize your business operations.',
          subServices: {
            migration: {
              name: 'Cloud Migration',
              details: 'Seamless transition to cloud platforms'
            },
            aws: {
              name: 'AWS Solutions',
              details: 'EC2, S3, Lambda, RDS & more'
            },
            azure: {
              name: 'Azure Services',
              details: 'Virtual Machines, Storage & Functions'
            },
            gcp: {
              name: 'Google Cloud Platform',
              details: 'Compute Engine, Cloud Storage & Firebase'
            },
            devops: {
              name: 'DevOps & CI/CD',
              details: 'Automated deployment pipelines'
            },
            monitoring: {
              name: 'Cloud Monitoring',
              details: 'Performance tracking & optimization'
            }
          }
        },
        database: {
          title: 'Database Management',
          description: 'Robust database solutions and optimization for reliable and efficient data management.',
          subServices: {
            design: {
              name: 'Database Design',
              details: 'Schema architecture & normalization'
            },
            sql: {
              name: 'SQL Databases',
              details: 'MySQL, PostgreSQL, MS SQL Server'
            },
            nosql: {
              name: 'NoSQL Solutions',
              details: 'MongoDB, Redis, Cassandra'
            },
            optimization: {
              name: 'Query Optimization',
              details: 'Performance tuning & indexing'
            },
            migration: {
              name: 'Data Migration',
              details: 'Seamless data transfer services'
            },
            backup: {
              name: 'Backup & Recovery',
              details: 'Automated backup solutions'
            }
          }
        },
        security: {
          title: 'IT Security',
          description: 'Comprehensive security solutions to protect your digital assets and sensitive information.',
          subServices: {
            audit: {
              name: 'Security Audit',
              details: 'Comprehensive system vulnerability assessment'
            },
            pentest: {
              name: 'Penetration Testing',
              details: 'Ethical hacking & security testing'
            },
            ssl: {
              name: 'SSL/TLS Implementation',
              details: 'HTTPS & certificate management'
            },
            encryption: {
              name: 'Data Encryption',
              details: 'End-to-end encryption solutions'
            },
            firewall: {
              name: 'Firewall Configuration',
              details: 'Network security & access control'
            },
            compliance: {
              name: 'Compliance Management',
              details: 'GDPR, ISO 27001, PCI-DSS compliance'
            }
          }
        },
        network: {
          title: 'Network Infrastructure',
          description: 'Reliable network design and implementation for seamless connectivity and performance.',
          subServices: {
            design: {
              name: 'Network Design',
              details: 'Topology planning & architecture'
            },
            lan: {
              name: 'LAN Setup',
              details: 'Local area network configuration'
            },
            wan: {
              name: 'WAN Solutions',
              details: 'Wide area network implementation'
            },
            vpn: {
              name: 'VPN Configuration',
              details: 'Secure remote access solutions'
            },
            security: {
              name: 'Network Security',
              details: 'Firewall, IDS/IPS implementation'
            },
            monitoring: {
              name: 'Performance Monitoring',
              details: 'Real-time network analytics'
            }
          }
        }
      },
      cta: {
        title: 'Ready to Transform Your Business?',
        subtitle: 'Let\'s discuss how our services can help you achieve your goals',
        button: 'Get Started'
      }
    },
    itLearning: {
      hero: {
        title: 'IT Learning Programs',
        subtitle: 'Master Technology with Expert Guidance',
        description: 'Comprehensive training programs designed to boost your career in technology'
      },
      courses: {
        title: 'Available Courses',
        subtitle: 'Choose the perfect course for your learning journey'
      },
      enroll: 'Enroll Now',
      discount: 'Save',
      week: 'Week',
      weeks: 'Weeks',
      features: {
        title: 'Why Choose Our Courses',
        expert: {
          title: 'Expert Instructors',
          description: 'Learn from industry professionals with years of experience'
        },
        flexible: {
          title: 'Flexible Schedule',
          description: 'Study at your own pace with lifetime access to materials'
        },
        certificate: {
          title: 'Certification',
          description: 'Receive industry-recognized certificates upon completion'
        },
        support: {
          title: 'Community Support',
          description: 'Join a vibrant community of learners and get help anytime'
        }
      }
    },
    itSolutions: {
      hero: {
        title: 'IT Solutions',
        subtitle: 'Custom Technology Solutions for Your Business',
        description: 'From web applications to enterprise systems, we build solutions that scale'
      },
      solutions: {
        title: 'Our Solutions',
        subtitle: 'Tailored services to meet your business needs'
      },
      getConsultation: 'Get Consultation',
      features: {
        title: 'Our Approach',
        analysis: {
          title: 'Requirements Analysis',
          description: 'We deeply understand your business needs and challenges'
        },
        design: {
          title: 'Strategic Design',
          description: 'Creating scalable architectures for long-term success'
        },
        development: {
          title: 'Agile Development',
          description: 'Iterative development with continuous client feedback'
        },
        support: {
          title: 'Ongoing Support',
          description: 'Dedicated support and maintenance after deployment'
        }
      }
    },
    itConsulting: {
      badge: 'IT Consulting & Support',
      hero: {
        title: 'Expert IT Consulting Services',
        subtitle: 'Transform your business with strategic IT consulting and comprehensive support services. We help you optimize technology, reduce costs, and drive innovation.'
      },
      benefits: {
        saveTime: {
          title: 'Save Time',
          description: 'Focus on your core business while we handle IT complexities'
        },
        reduceRisks: {
          title: 'Reduce Risks',
          description: 'Minimize downtime and security threats with expert guidance'
        },
        scaleBetter: {
          title: 'Scale Better',
          description: 'Build IT infrastructure that grows with your business'
        },
        strategicInsights: {
          title: 'Strategic Insights',
          description: 'Make informed decisions with expert IT consulting'
        }
      },
      services: {
        strategy: {
          title: 'IT Strategy & Planning',
          description: 'Comprehensive IT strategy development aligned with your business goals',
          features: [
            'Technology roadmap planning',
            'Digital transformation strategy',
            'IT budget optimization',
            'Risk assessment & mitigation',
            'Vendor selection & management'
          ]
        },
        infrastructure: {
          title: 'Infrastructure Consulting',
          description: 'Design and optimize your IT infrastructure for maximum efficiency',
          features: [
            'Network architecture design',
            'Server infrastructure planning',
            'Cloud migration strategy',
            'Disaster recovery planning',
            'Performance optimization'
          ]
        },
        support: {
          title: '24/7 IT Support',
          description: 'Round-the-clock technical support for your business operations',
          features: [
            'Help desk support',
            'Remote troubleshooting',
            'System monitoring',
            'Incident management',
            'Priority response times'
          ]
        },
        training: {
          title: 'IT Training & Workshops',
          description: 'Empower your team with comprehensive IT training programs',
          features: [
            'Custom training programs',
            'Software & tools training',
            'Cybersecurity awareness',
            'Best practices workshops',
            'Certification preparation'
          ]
        },
        optimization: {
          title: 'Process Optimization',
          description: 'Streamline your IT processes for better productivity',
          features: [
            'Workflow automation',
            'System integration',
            'Process documentation',
            'Performance metrics',
            'Continuous improvement'
          ]
        },
        management: {
          title: 'Project Management',
          description: 'Expert IT project management from planning to execution',
          features: [
            'Project planning & scheduling',
            'Resource allocation',
            'Risk management',
            'Quality assurance',
            'Stakeholder communication'
          ]
        }
      },
      cta: {
        title: 'Ready to Transform Your IT Infrastructure?',
        subtitle: "Let's discuss how our IT consulting services can help your business grow and succeed.",
        button: 'Get Started'
      }
    },
    portfolio: {
      badge: 'Portfolio Showcase',
      hero: {
        title: 'Our Projects',
        subtitle: 'Showcasing innovative solutions and the exceptional work we\'ve delivered to clients worldwide'
      },
      filter: 'Filter',
      categories: {
        all: 'All Projects',
        web: 'Web Development',
        mobile: 'Mobile Apps',
        design: 'UI/UX Design',
        other: 'Others'
      },
      viewProject: 'View Project',
      technologies: 'Technologies Used'
    },
    pricing: {
      badge: 'Transparent Pricing',
      hero: {
        title: 'Pricing Packages',
        subtitle: 'Professional website development services tailored to your business needs'
      },
      mostPopular: 'Most Popular',
      customPrice: 'Custom Price',
      oneTimePayment: 'One-time payment',
      contactForPricing: 'Contact for pricing',
      getStarted: 'Get Started',
      cta: {
        title: 'Need Something Custom?',
        description: 'Contact us to discuss your project and get a personalized quote',
        button: 'Contact Us'
      },
      packages: {
        starter: {
          name: 'Starter Website',
          description: 'Perfect for personal portfolios and small businesses',
          features: [
            'Up to 5 pages',
            'Responsive design (mobile, tablet, desktop)',
            'Modern UI/UX design',
            'Contact form integration',
            'Social media integration',
            'Basic SEO optimization',
            'Free hosting for 1 year',
            '3 months free support'
          ],
          notIncluded: [
            'E-commerce functionality',
            'Custom animations',
            'Backend development'
          ]
        },
        professional: {
          name: 'Professional Website',
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
            'Analytics integration'
          ],
          notIncluded: [
            'E-commerce functionality',
            'Payment gateway integration'
          ]
        },
        enterprise: {
          name: 'Enterprise Solution',
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
            'Regular maintenance'
          ],
          notIncluded: []
        }
      }
    },
    testimonials: {
      hero: {
        title: 'Client Testimonials',
        subtitle: 'What Our Clients Say About Us'
      },
      writeReview: 'Write a Review',
      filter: {
        all: 'All Reviews',
        recent: 'Most Recent',
        highest: 'Highest Rated'
      },
      verified: 'Verified Client',
      helpful: 'Helpful'
    },
    contact: {
      badge: 'Let\'s Connect',
      hero: {
        title: 'Get in Touch',
        subtitle: 'Have a project in mind? Let\'s discuss how we can help bring your vision to life'
      },
      info: {
        title: 'Contact Information',
        email: 'Email',
        phone: 'Phone',
        location: 'Location'
      },
      map: {
        title: 'Find Us Here'
      },
      form: {
        title: 'Send Message',
        name: 'Your Name',
        email: 'Your Email',
        phone: 'Phone Number',
        subject: 'Subject',
        message: 'Your Message',
        submit: 'Send Message',
        sending: 'Sending...'
      },
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.'
    },
    modals: {
      enrollment: {
        title: 'Enroll in Course',
        subtitle: 'Start your learning journey today',
        form: {
          name: 'Full Name',
          namePlaceholder: 'Enter your full name',
          email: 'Email Address',
          emailPlaceholder: 'your.email@example.com',
          phone: 'Phone Number',
          phonePlaceholder: '+62 XXX XXXX XXXX',
          schedule: 'Preferred Schedule',
          day: 'Day',
          dayPlaceholder: 'Select day',
          days: {
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday'
          },
          time: 'Time',
          timePlaceholder: 'e.g., 09:00 - 11:00',
          message: 'Additional Message',
          messagePlaceholder: 'Any questions or special requests?'
        },
        courseInfo: 'Course Information',
        courseName: 'Course',
        duration: 'Duration',
        price: 'Price',
        discount: 'Discount',
        finalPrice: 'Final Price',
        submit: 'Submit Enrollment',
        submitting: 'Submitting...',
        success: 'Enrollment Successful!',
        successMessage: 'Your enrollment request has been submitted. We will contact you shortly.',
        errors: {
          nameRequired: 'Name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email format',
          phoneRequired: 'Phone number is required',
          phoneInvalid: 'Invalid phone format'
        }
      },
      consultation: {
        title: 'Request Consultation',
        subtitle: 'Let\'s discuss your project needs',
        form: {
          name: 'Full Name',
          namePlaceholder: 'Enter your full name',
          email: 'Email Address',
          emailPlaceholder: 'your.email@example.com',
          phone: 'Phone Number',
          phonePlaceholder: '+62 XXX XXXX XXXX',
          company: 'Company Name',
          companyPlaceholder: 'Your company name (optional)',
          projectType: 'Project Type',
          projectTypePlaceholder: 'Select project type',
          message: 'Project Details',
          messagePlaceholder: 'Tell us about your project requirements'
        },
        solutionInfo: 'Solution Information',
        solutionName: 'Solution',
        submit: 'Submit Request',
        submitting: 'Submitting...',
        success: 'Request Submitted!',
        successMessage: 'We have received your consultation request. Our team will contact you within 24 hours.',
        errors: {
          nameRequired: 'Name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email format',
          phoneRequired: 'Phone number is required',
          messageRequired: 'Project details are required'
        }
      },
      projectInquiry: {
        title: 'Project Inquiry',
        subtitle: 'Tell us about your project',
        form: {
          name: 'Full Name',
          namePlaceholder: 'Enter your full name',
          email: 'Email Address',
          emailPlaceholder: 'your.email@example.com',
          phone: 'Phone Number',
          phonePlaceholder: '+62 XXX XXXX XXXX',
          company: 'Company Name',
          companyPlaceholder: 'Your company name (optional)',
          budget: 'Your Budget (IDR)',
          budgetPlaceholder: 'e.g., 10.000.000',
          projectDetails: 'Project Details',
          projectDetailsPlaceholder: 'Describe your project requirements in detail'
        },
        packageInfo: 'Package Information',
        packageName: 'Package',
        price: 'Starting Price',
        submit: 'Submit Inquiry',
        submitting: 'Submitting...',
        success: 'Inquiry Submitted!',
        successMessage: 'Thank you for your interest! Our team will review your inquiry and contact you soon.',
        errors: {
          nameRequired: 'Name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email format',
          phoneRequired: 'Phone number is required',
          budgetRequired: 'Budget is required for custom packages',
          projectDetailsRequired: 'Project details are required'
        }
      },
      writeReview: {
        title: 'Write a Review',
        subtitle: 'Share your experience with us',
        form: {
          name: 'Your Name',
          namePlaceholder: 'Enter your name',
          email: 'Email Address',
          emailPlaceholder: 'your.email@example.com',
          company: 'Company/Position',
          companyPlaceholder: 'Your company or position (optional)',
          rating: 'Rating',
          review: 'Your Review',
          reviewPlaceholder: 'Share your experience working with us...'
        },
        submit: 'Submit Review',
        submitting: 'Submitting...',
        success: 'Review Submitted!',
        successMessage: 'Thank you for your feedback! Your review will be published after verification.',
        errors: {
          nameRequired: 'Name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email format',
          reviewRequired: 'Review is required'
        }
      },
      login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to your account',
        form: {
          email: 'Email Address',
          emailPlaceholder: 'your.email@example.com',
          password: 'Password',
          passwordPlaceholder: 'Enter your password',
          remember: 'Remember me',
          forgot: 'Forgot password?'
        },
        submit: 'Sign In',
        submitting: 'Signing in...',
        noAccount: 'Don\'t have an account?',
        signup: 'Sign up',
        errors: {
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email format',
          passwordRequired: 'Password is required'
        }
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join Neverland Studio today',
        form: {
          name: 'Full Name',
          namePlaceholder: 'Enter your full name',
          email: 'Email Address',
          emailPlaceholder: 'your.email@example.com',
          password: 'Password',
          passwordPlaceholder: 'Create a strong password',
          confirmPassword: 'Confirm Password',
          confirmPasswordPlaceholder: 'Confirm your password',
          terms: 'I agree to the Terms & Conditions'
        },
        submit: 'Create Account',
        submitting: 'Creating account...',
        hasAccount: 'Already have an account?',
        signin: 'Sign in',
        errors: {
          nameRequired: 'Name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email format',
          passwordRequired: 'Password is required',
          passwordWeak: 'Password must be at least 8 characters',
          confirmPasswordRequired: 'Please confirm your password',
          passwordMismatch: 'Passwords do not match',
          termsRequired: 'You must agree to the terms'
        }
      }
    },
    skills: {
      badge: 'Our Expertise',
      hero: {
        title: 'Technical',
        titleHighlight: 'Skills',
        titleSuffix: '& Expertise',
        subtitle: 'Mastering cutting-edge technologies to deliver exceptional solutions'
      },
      technicalProficiencies: {
        title: 'Technical Proficiencies',
        subtitle: 'Comprehensive mastery across multiple technology stacks'
      },
      stats: {
        technologies: 'Technologies',
        frameworks: 'Frameworks',
        certifications: 'Certifications',
        experience: 'Experience',
        years: 'Years'
      },
      categories: {
        frontend: 'Frontend Development',
        backend: 'Backend Development',
        database: 'Database & Storage',
        cloud: 'Cloud & DevOps',
        mobile: 'Mobile Development',
        tools: 'Tools & Frameworks'
      },
      skills: {
        react: 'React.js',
        typescript: 'TypeScript',
        nextjs: 'Next.js',
        vue: 'Vue.js',
        tailwind: 'Tailwind CSS',
        html: 'HTML5/CSS3',
        nodejs: 'Node.js',
        python: 'Python',
        php: 'PHP',
        laravel: 'Laravel',
        express: 'Express.js',
        restapi: 'REST API',
        mongodb: 'MongoDB',
        postgresql: 'PostgreSQL',
        mysql: 'MySQL',
        redis: 'Redis',
        firebase: 'Firebase',
        graphql: 'GraphQL',
        aws: 'AWS',
        googlecloud: 'Google Cloud',
        docker: 'Docker',
        kubernetes: 'Kubernetes',
        cicd: 'CI/CD',
        nginx: 'Nginx',
        reactnative: 'React Native',
        flutter: 'Flutter',
        ios: 'iOS Development',
        android: 'Android Development',
        pwa: 'PWA',
        ionic: 'Ionic',
        git: 'Git & GitHub',
        vscode: 'VS Code',
        figma: 'Figma',
        webpack: 'Webpack',
        jest: 'Jest',
        postman: 'Postman'
      },
      softSkills: {
        title: 'Soft Skills & Attributes',
        subtitle: 'Beyond technical expertise, we excel in collaboration and leadership',
        problemSolving: 'Problem Solving',
        teamCollaboration: 'Team Collaboration',
        communication: 'Communication',
        projectManagement: 'Project Management',
        creativeThinking: 'Creative Thinking',
        timeManagement: 'Time Management'
      },
      languages: {
        title: 'Language Proficiency',
        subtitle: 'Multilingual communication capabilities',
        indonesian: {
          name: 'Indonesian',
          level: 'Native Speaker',
          speaking: 'Speaking',
          writing: 'Writing',
          reading: 'Reading',
          listening: 'Listening'
        },
        english: {
          name: 'English',
          level: 'Professional Working Proficiency',
          speaking: 'Speaking',
          writing: 'Writing',
          reading: 'Reading',
          listening: 'Listening'
        },
        globalCommunication: 'Global Communication',
        globalDesc: 'Fluent in both languages for seamless international collaboration and client communication'
      }
    },
    liveChat: {
      title: 'Live Chat',
      subtitle: 'We\'re here to help',
      online: 'Online',
      offline: 'Offline',
      placeholder: 'Type your message...',
      send: 'Send',
      typing: 'typing...',
      welcome: 'Hello! How can we help you today?',
      defaultResponse: 'Thank you for your message! Our team will respond shortly. For urgent matters, please call us or send an email.'
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      required: 'Required',
      optional: 'Optional',
      learnMore: 'Learn More',
      readMore: 'Read More',
      viewAll: 'View All',
      showMore: 'Show More',
      showLess: 'Show Less'
    },
    footer: {
      description: 'Transforming ideas into powerful digital solutions with cutting-edge technology and innovative strategies. Building the future, one project at a time.',
      followUs: 'Follow Us',
      quickLinks: 'Quick Links',
      services: 'Services',
      newsletter: 'Newsletter',
      newsletterDesc: 'Get latest updates and insights.',
      emailPlaceholder: 'Your email',
      paymentMethods: 'Payment Methods',
      securePayment: 'Secure payment options',
      badges: {
        sslsecure: 'SSL Secure',
        securepayment: 'Secure Payment',
        verifiedsecurity: 'Verified Security',
        moneybackguarantee: 'Money Back Guarantee'
      },
      copyright: '© 2025 Neverland Studio. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy'
    }
  },
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      aboutUs: 'Tentang Kami',
      team: 'Tim',
      skills: 'Keahlian',
      awards: 'Penghargaan & Prestasi',
      services: 'Layanan',
      allServices: 'Semua Layanan',
      itLearning: 'Pembelajaran IT',
      itSolutions: 'Solusi IT',
      itConsulting: 'Konsultan IT',
      portfolio: 'Portofolio',
      pricing: 'Harga',
      testimonials: 'Testimoni',
      contact: 'Kontak',
      login: 'Masuk',
      logout: 'Keluar',
      profile: 'Profil',
      editProfile: 'Edit Profil',
      myAccount: 'Akun Saya',
      settings: 'Pengaturan'
    },
    home: {
      hero: {
        greeting: 'Selamat Datang di',
        title: 'Neverland Studio',
        subtitle: 'Mengubah Ide Menjadi Keunggulan Digital',
        description: 'Kami adalah tim developer, desainer, dan inovator yang berdedikasi untuk menciptakan solusi digital terdepan yang mendorong pertumbuhan dan kesuksesan bisnis.',
        cta: 'Mulai Sekarang',
        learnMore: 'Pelajari Lebih Lanjut'
      },
      stats: {
        projects: 'Proyek Selesai',
        clients: 'Klien Puas',
        experience: 'Tahun Pengalaman',
        awards: 'Penghargaan'
      },
      services: {
        title: 'Layanan Kami',
        subtitle: 'Solusi Komprehensif untuk Kebutuhan Digital Anda',
        learning: {
          title: 'Pembelajaran IT',
          description: 'Kuasai teknologi terkini dengan kursus yang dipandu ahli. Dari pengembangan web hingga AI, kami menawarkan program pelatihan komprehensif.'
        },
        solutions: {
          title: 'Solusi IT',
          description: 'Pengembangan perangkat lunak khusus dan layanan konsultasi IT yang disesuaikan dengan kebutuhan bisnis Anda. Kami membangun solusi yang scalable dan efisien.'
        },
        explore: 'Jelajahi Layanan'
      },
      features: {
        title: 'Mengapa Memilih Kami',
        subtitle: 'Yang Membuat Kami Berbeda',
        quality: {
          title: 'Kualitas Terjamin',
          description: 'Kami menjaga standar tertinggi di setiap proyek yang kami kerjakan'
        },
        support: {
          title: 'Dukungan 24/7',
          description: 'Bantuan sepanjang waktu untuk semua kebutuhan teknis Anda'
        },
        innovation: {
          title: 'Inovasi Utama',
          description: 'Memanfaatkan teknologi terbaru untuk menciptakan solusi terdepan'
        },
        experience: {
          title: 'Tim Ahli',
          description: 'Profesional berpengalaman dengan pengalaman industri bertahun-tahun'
        }
      },
      testimonials: {
        title: 'Apa Kata Klien Kami',
        subtitle: 'Umpan balik asli dari klien asli',
        viewAll: 'Lihat Semua Testimoni',
        writeReview: 'Tulis Ulasan'
      },
      cta: {
        title: 'Siap Memulai Proyek Anda?',
        subtitle: 'Mari bekerja sama untuk mewujudkan ide Anda',
        button: 'Hubungi Kami Sekarang'
      }
    },
    about: {
      hero: {
        title: 'Tentang Neverland Studio',
        subtitle: 'Menciptakan Keunggulan Digital Sejak 2025'
      },
      story: {
        title: 'Kisah Kami',
        content: 'Didirikan pada tahun 2025, Neverland Studio muncul dari semangat untuk menciptakan pengalaman digital yang luar biasa. Kami memulai sebagai tim kecil developer dan desainer yang percaya bahwa teknologi harus dapat diakses, indah, dan powerful. Hari ini, kami telah berkembang menjadi agensi digital layanan penuh, tetapi nilai inti kami tetap sama: inovasi, kualitas, dan kepuasan klien.'
      },
      mission: {
        title: 'Misi Kami',
        content: 'Memberdayakan bisnis dan individu melalui solusi digital inovatif yang mendorong pertumbuhan, meningkatkan pengalaman pengguna, dan menciptakan nilai jangka panjang. Kami berusaha menjadi lebih dari sekadar penyedia layanan – kami bertujuan menjadi mitra teknologi Anda.'
      },
      vision: {
        title: 'Visi Kami',
        content: 'Menjadi penyedia solusi digital terkemuka di Asia Tenggara, diakui atas komitmen kami terhadap keunggulan, inovasi, dan kesuksesan klien. Kami membayangkan masa depan di mana teknologi terintegrasi dengan mulus dengan kebutuhan bisnis untuk menciptakan hasil yang luar biasa.'
      },
      values: {
        title: 'Nilai Inti Kami',
        innovation: {
          title: 'Inovasi',
          description: 'Kami merangkul teknologi terdepan dan solusi kreatif'
        },
        excellence: {
          title: 'Keunggulan',
          description: 'Kami memberikan tidak kurang dari kualitas tertinggi dalam semua yang kami lakukan'
        },
        integrity: {
          title: 'Integritas',
          description: 'Kami membangun kepercayaan melalui transparansi dan komunikasi yang jujur'
        },
        collaboration: {
          title: 'Kolaborasi',
          description: 'Kami bekerja erat dengan klien sebagai mitra dalam kesuksesan'
        }
      },
      cta: {
        title: 'Ingin tahu lebih banyak tentang kami?',
        button: 'Hubungi Kami'
      }
    },
    team: {
      badge: 'Tim Luar Biasa Kami',
      hero: {
        title: 'Kenali Tim Kami',
        subtitle: 'Tim ahli berbakat kami menyatukan keterampilan dan pengalaman beragam untuk memberikan hasil luar biasa di setiap proyek'
      },
      stats: {
        projects: 'Proyek',
        experience: 'Pengalaman'
      },
      roles: {
        founder: 'Pendiri & CEO',
        cto: 'Chief Technology Officer',
        designer: 'Lead Designer',
        developer: 'Senior Developer',
        manager: 'Manajer Proyek',
        marketing: 'Direktur Pemasaran'
      }
    },
    awards: {
      badge: 'Penghargaan & Keunggulan',
      hero: {
        title: 'Penghargaan & Prestasi',
        subtitle: 'Pengakuan atas keunggulan, inovasi, dan komitmen kami dalam memberikan hasil luar biasa'
      },
      year: 'Tahun',
      categories: {
        technology: 'Teknologi',
        design: 'Desain',
        business: 'Bisnis',
        service: 'Layanan',
        innovation: 'Inovasi'
      },
      stats: {
        totalAwards: 'Total Penghargaan',
        categories: 'Kategori',
        years: 'Tahun',
        global: 'Global',
        recognition: 'Pengakuan'
      }
    },
    services: {
      badge: 'Layanan IT Profesional',
      hero: {
        title: 'Layanan Kami',
        subtitle: 'Solusi IT komprehensif yang dirancang untuk memajukan bisnis Anda dengan teknologi terdepan'
      },
      categories: {
        webDevelopment: {
          title: 'Pengembangan Web',
          description: 'Website dan aplikasi web khusus yang dibangun dengan teknologi modern untuk skalabilitas dan performa.',
          subServices: {
            corporate: {
              name: 'Website Perusahaan',
              details: 'Profil perusahaan profesional dengan CMS'
            },
            ecommerce: {
              name: 'Platform E-Commerce',
              details: 'Toko online lengkap dengan payment gateway'
            },
            webapp: {
              name: 'Aplikasi Web',
              details: 'Solusi SaaS dan enterprise khusus'
            },
            pwa: {
              name: 'Progressive Web Apps',
              details: 'Aplikasi responsif yang bisa offline'
            },
            landing: {
              name: 'Landing Page',
              details: 'Halaman marketing dengan konversi tinggi'
            },
            api: {
              name: 'Pengembangan API',
              details: 'Layanan API RESTful & GraphQL'
            }
          }
        },
        mobileApps: {
          title: 'Pengembangan Aplikasi Mobile',
          description: 'Aplikasi mobile native dan cross-platform yang memberikan pengalaman pengguna luar biasa.',
          subServices: {
            ios: {
              name: 'Pengembangan iOS',
              details: 'Aplikasi native Swift & SwiftUI'
            },
            android: {
              name: 'Pengembangan Android',
              details: 'Aplikasi Kotlin & Jetpack Compose'
            },
            reactNative: {
              name: 'Aplikasi React Native',
              details: 'Solusi cross-platform JavaScript'
            },
            flutter: {
              name: 'Aplikasi Flutter',
              details: 'Aplikasi Dart performa tinggi'
            },
            aso: {
              name: 'Optimasi App Store',
              details: 'Layanan publishing & ASO'
            },
            maintenance: {
              name: 'Maintenance Aplikasi',
              details: 'Update, bug fixes & dukungan'
            }
          }
        },
        cloudSolutions: {
          title: 'Solusi Cloud',
          description: 'Infrastruktur cloud scalable dan layanan migrasi untuk modernisasi operasi bisnis Anda.',
          subServices: {
            migration: {
              name: 'Migrasi Cloud',
              details: 'Transisi mulus ke platform cloud'
            },
            aws: {
              name: 'Solusi AWS',
              details: 'EC2, S3, Lambda, RDS & lainnya'
            },
            azure: {
              name: 'Layanan Azure',
              details: 'Virtual Machines, Storage & Functions'
            },
            gcp: {
              name: 'Google Cloud Platform',
              details: 'Compute Engine, Cloud Storage & Firebase'
            },
            devops: {
              name: 'DevOps & CI/CD',
              details: 'Pipeline deployment otomatis'
            },
            monitoring: {
              name: 'Monitoring Cloud',
              details: 'Tracking performa & optimasi'
            }
          }
        },
        database: {
          title: 'Manajemen Database',
          description: 'Solusi database yang robust dan optimasi untuk manajemen data yang reliable dan efisien.',
          subServices: {
            design: {
              name: 'Desain Database',
              details: 'Arsitektur schema & normalisasi'
            },
            sql: {
              name: 'Database SQL',
              details: 'MySQL, PostgreSQL, MS SQL Server'
            },
            nosql: {
              name: 'Solusi NoSQL',
              details: 'MongoDB, Redis, Cassandra'
            },
            optimization: {
              name: 'Optimasi Query',
              details: 'Performance tuning & indexing'
            },
            migration: {
              name: 'Migrasi Data',
              details: 'Layanan transfer data mulus'
            },
            backup: {
              name: 'Backup & Recovery',
              details: 'Solusi backup otomatis'
            }
          }
        },
        security: {
          title: 'Keamanan IT',
          description: 'Solusi keamanan komprehensif untuk melindungi aset digital dan informasi sensitif Anda.',
          subServices: {
            audit: {
              name: 'Audit Keamanan',
              details: 'Penilaian kerentanan sistem komprehensif'
            },
            pentest: {
              name: 'Penetration Testing',
              details: 'Ethical hacking & pengujian keamanan'
            },
            ssl: {
              name: 'Implementasi SSL/TLS',
              details: 'Manajemen HTTPS & sertifikat'
            },
            encryption: {
              name: 'Enkripsi Data',
              details: 'Solusi enkripsi end-to-end'
            },
            firewall: {
              name: 'Konfigurasi Firewall',
              details: 'Keamanan jaringan & kontrol akses'
            },
            compliance: {
              name: 'Manajemen Compliance',
              details: 'Kepatuhan GDPR, ISO 27001, PCI-DSS'
            }
          }
        },
        network: {
          title: 'Infrastruktur Jaringan',
          description: 'Desain dan implementasi jaringan yang reliable untuk konektivitas dan performa seamless.',
          subServices: {
            design: {
              name: 'Desain Jaringan',
              details: 'Perencanaan topologi & arsitektur'
            },
            lan: {
              name: 'Setup LAN',
              details: 'Konfigurasi local area network'
            },
            wan: {
              name: 'Solusi WAN',
              details: 'Implementasi wide area network'
            },
            vpn: {
              name: 'Konfigurasi VPN',
              details: 'Solusi akses remote aman'
            },
            security: {
              name: 'Keamanan Jaringan',
              details: 'Implementasi Firewall, IDS/IPS'
            },
            monitoring: {
              name: 'Monitoring Performa',
              details: 'Analitik jaringan real-time'
            }
          }
        }
      },
      cta: {
        title: 'Siap Transformasi Bisnis Anda?',
        subtitle: 'Mari diskusikan bagaimana layanan kami dapat membantu Anda mencapai tujuan',
        button: 'Mulai Sekarang'
      }
    },
    itConsulting: {
      badge: 'Konsultasi & Dukungan IT',
      hero: {
        title: 'Layanan Konsultasi IT Profesional',
        subtitle: 'Transformasikan bisnis Anda dengan konsultasi IT strategis dan layanan dukungan komprehensif. Kami membantu Anda mengoptimalkan teknologi, mengurangi biaya, dan mendorong inovasi.'
      },
      benefits: {
        saveTime: {
          title: 'Hemat Waktu',
          description: 'Fokus pada bisnis inti Anda sementara kami menangani kompleksitas IT'
        },
        reduceRisks: {
          title: 'Kurangi Risiko',
          description: 'Minimalkan downtime dan ancaman keamanan dengan panduan ahli'
        },
        scaleBetter: {
          title: 'Skalabilitas Lebih Baik',
          description: 'Bangun infrastruktur IT yang berkembang bersama bisnis Anda'
        },
        strategicInsights: {
          title: 'Wawasan Strategis',
          description: 'Buat keputusan yang tepat dengan konsultasi IT profesional'
        }
      },
      services: {
        strategy: {
          title: 'Strategi & Perencanaan IT',
          description: 'Pengembangan strategi IT komprehensif yang selaras dengan tujuan bisnis Anda',
          features: [
            'Perencanaan roadmap teknologi',
            'Strategi transformasi digital',
            'Optimasi anggaran IT',
            'Penilaian & mitigasi risiko',
            'Seleksi & manajemen vendor'
          ]
        },
        infrastructure: {
          title: 'Konsultasi Infrastruktur',
          description: 'Desain dan optimalkan infrastruktur IT Anda untuk efisiensi maksimal',
          features: [
            'Desain arsitektur jaringan',
            'Perencanaan infrastruktur server',
            'Strategi migrasi cloud',
            'Perencanaan disaster recovery',
            'Optimasi performa'
          ]
        },
        support: {
          title: 'Dukungan IT 24/7',
          description: 'Dukungan teknis sepanjang waktu untuk operasional bisnis Anda',
          features: [
            'Dukungan help desk',
            'Troubleshooting jarak jauh',
            'Monitoring sistem',
            'Manajemen insiden',
            'Waktu respons prioritas'
          ]
        },
        training: {
          title: 'Pelatihan & Workshop IT',
          description: 'Berdayakan tim Anda dengan program pelatihan IT yang komprehensif',
          features: [
            'Program pelatihan custom',
            'Pelatihan software & tools',
            'Kesadaran keamanan siber',
            'Workshop best practices',
            'Persiapan sertifikasi'
          ]
        },
        optimization: {
          title: 'Optimasi Proses',
          description: 'Sederhanakan proses IT Anda untuk produktivitas yang lebih baik',
          features: [
            'Otomasi workflow',
            'Integrasi sistem',
            'Dokumentasi proses',
            'Metrik performa',
            'Perbaikan berkelanjutan'
          ]
        },
        management: {
          title: 'Manajemen Proyek',
          description: 'Manajemen proyek IT profesional dari perencanaan hingga eksekusi',
          features: [
            'Perencanaan & penjadwalan proyek',
            'Alokasi sumber daya',
            'Manajemen risiko',
            'Quality assurance',
            'Komunikasi stakeholder'
          ]
        }
      },
      cta: {
        title: 'Siap Transformasi Infrastruktur IT Anda?',
        subtitle: 'Mari diskusikan bagaimana layanan konsultasi IT kami dapat membantu bisnis Anda tumbuh dan sukses.',
        button: 'Mulai Sekarang'
      }
    },
    itLearning: {
      hero: {
        title: 'Program Pembelajaran IT',
        subtitle: 'Kuasai Teknologi dengan Bimbingan Ahli',
        description: 'Program pelatihan komprehensif yang dirancang untuk meningkatkan karir Anda di bidang teknologi'
      },
      courses: {
        title: 'Kursus Tersedia',
        subtitle: 'Pilih kursus yang sempurna untuk perjalanan belajar Anda'
      },
      enroll: 'Daftar Sekarang',
      discount: 'Hemat',
      week: 'Minggu',
      weeks: 'Minggu',
      features: {
        title: 'Mengapa Memilih Kursus Kami',
        expert: {
          title: 'Instruktur Ahli',
          description: 'Belajar dari profesional industri dengan pengalaman bertahun-tahun'
        },
        flexible: {
          title: 'Jadwal Fleksibel',
          description: 'Belajar dengan kecepatan Anda sendiri dengan akses seumur hidup ke materi'
        },
        certificate: {
          title: 'Sertifikasi',
          description: 'Terima sertifikat yang diakui industri setelah selesai'
        },
        support: {
          title: 'Dukungan Komunitas',
          description: 'Bergabung dengan komunitas pembelajar yang dinamis dan dapatkan bantuan kapan saja'
        }
      }
    },
    itSolutions: {
      hero: {
        title: 'Solusi IT',
        subtitle: 'Solusi Teknologi Khusus untuk Bisnis Anda',
        description: 'Dari aplikasi web hingga sistem enterprise, kami membangun solusi yang scalable'
      },
      solutions: {
        title: 'Solusi Kami',
        subtitle: 'Layanan yang disesuaikan untuk memenuhi kebutuhan bisnis Anda'
      },
      getConsultation: 'Dapatkan Konsultasi',
      features: {
        title: 'Pendekatan Kami',
        analysis: {
          title: 'Analisis Kebutuhan',
          description: 'Kami memahami secara mendalam kebutuhan dan tantangan bisnis Anda'
        },
        design: {
          title: 'Desain Strategis',
          description: 'Menciptakan arsitektur scalable untuk kesuksesan jangka panjang'
        },
        development: {
          title: 'Pengembangan Agile',
          description: 'Pengembangan iteratif dengan umpan balik klien berkelanjutan'
        },
        support: {
          title: 'Dukungan Berkelanjutan',
          description: 'Dukungan dan pemeliharaan khusus setelah deployment'
        }
      }
    },
    portfolio: {
      badge: 'Showcase Portofolio',
      hero: {
        title: 'Proyek Kami',
        subtitle: 'Menampilkan solusi inovatif dan karya luar biasa yang telah kami berikan kepada klien di seluruh dunia'
      },
      filter: 'Filter',
      categories: {
        all: 'Semua Proyek',
        web: 'Pengembangan Web',
        mobile: 'Aplikasi Mobile',
        design: 'Desain UI/UX',
        other: 'Lainnya'
      },
      viewProject: 'Lihat Proyek',
      technologies: 'Teknologi yang Digunakan'
    },
    pricing: {
      badge: 'Harga Transparan',
      hero: {
        title: 'Paket Harga',
        subtitle: 'Layanan pengembangan website profesional yang disesuaikan dengan kebutuhan bisnis Anda'
      },
      mostPopular: 'Paling Populer',
      customPrice: 'Harga Khusus',
      oneTimePayment: 'Pembayaran satu kali',
      contactForPricing: 'Hubungi untuk harga',
      getStarted: 'Mulai Sekarang',
      cta: {
        title: 'Butuh Sesuatu yang Khusus?',
        description: 'Hubungi kami untuk mendiskusikan proyek Anda dan dapatkan penawaran khusus',
        button: 'Hubungi Kami'
      },
      packages: {
        starter: {
          name: 'Website Starter',
          description: 'Sempurna untuk portofolio pribadi dan bisnis kecil',
          features: [
            'Hingga 5 halaman',
            'Desain responsif (mobile, tablet, desktop)',
            'Desain UI/UX modern',
            'Integrasi formulir kontak',
            'Integrasi media sosial',
            'Optimasi SEO dasar',
            'Hosting gratis 1 tahun',
            'Dukungan gratis 3 bulan'
          ],
          notIncluded: [
            'Fungsionalitas e-commerce',
            'Animasi kustom',
            'Pengembangan backend'
          ]
        },
        professional: {
          name: 'Website Professional',
          description: 'Ideal untuk bisnis berkembang dan startup',
          features: [
            'Hingga 15 halaman',
            'Desain responsif premium',
            'UI/UX lanjutan dengan animasi',
            'Formulir kontak & newsletter',
            'Bagian blog/berita',
            'Dashboard admin (CMS)',
            'Optimasi SEO lanjutan',
            'Optimasi performa',
            'Hosting gratis 1 tahun',
            'Dukungan gratis 6 bulan',
            'Integrasi analytics'
          ],
          notIncluded: [
            'Fungsionalitas e-commerce',
            'Integrasi payment gateway'
          ]
        },
        enterprise: {
          name: 'Solusi Enterprise',
          description: 'Solusi khusus untuk proyek berskala besar',
          features: [
            'Halaman unlimited',
            'Desain & branding khusus',
            'Pengembangan full-stack',
            'Integrasi e-commerce',
            'Setup payment gateway',
            'Sistem autentikasi user',
            'Dashboard admin lanjutan',
            'Fitur real-time',
            'Integrasi API',
            'Desain database',
            'Deployment cloud',
            'Penguatan keamanan',
            'Dukungan gratis 1 tahun',
            'Dukungan prioritas',
            'Maintenance berkala'
          ],
          notIncluded: []
        }
      }
    },
    testimonials: {
      hero: {
        title: 'Testimoni Klien',
        subtitle: 'Apa Kata Klien Kami Tentang Kami'
      },
      writeReview: 'Tulis Ulasan',
      filter: {
        all: 'Semua Ulasan',
        recent: 'Terbaru',
        highest: 'Tertinggi'
      },
      verified: 'Klien Terverifikasi',
      helpful: 'Membantu'
    },
    contact: {
      badge: 'Mari Terhubung',
      hero: {
        title: 'Hubungi Kami',
        subtitle: 'Punya proyek dalam pikiran? Mari diskusikan bagaimana kami dapat membantu mewujudkan visi Anda'
      },
      info: {
        title: 'Informasi Kontak',
        email: 'Email',
        phone: 'Telepon',
        location: 'Lokasi'
      },
      map: {
        title: 'Temukan Kami Di Sini'
      },
      form: {
        title: 'Kirim Pesan',
        name: 'Nama Anda',
        email: 'Email Anda',
        phone: 'Nomor Telepon',
        subject: 'Subjek',
        message: 'Pesan Anda',
        submit: 'Kirim Pesan',
        sending: 'Mengirim...'
      },
      success: 'Pesan berhasil dikirim!',
      error: 'Gagal mengirim pesan. Silakan coba lagi.'
    },
    modals: {
      enrollment: {
        title: 'Daftar Kursus',
        subtitle: 'Mulai perjalanan belajar Anda hari ini',
        form: {
          name: 'Nama Lengkap',
          namePlaceholder: 'Masukkan nama lengkap Anda',
          email: 'Alamat Email',
          emailPlaceholder: 'email.anda@example.com',
          phone: 'Nomor Telepon',
          phonePlaceholder: '+62 XXX XXXX XXXX',
          schedule: 'Jadwal Pilihan',
          day: 'Hari',
          dayPlaceholder: 'Pilih hari',
          days: {
            monday: 'Senin',
            tuesday: 'Selasa',
            wednesday: 'Rabu',
            thursday: 'Kamis',
            friday: 'Jumat',
            saturday: 'Sabtu',
            sunday: 'Minggu'
          },
          time: 'Waktu',
          timePlaceholder: 'contoh: 09:00 - 11:00',
          message: 'Pesan Tambahan',
          messagePlaceholder: 'Ada pertanyaan atau permintaan khusus?'
        },
        courseInfo: 'Informasi Kursus',
        courseName: 'Kursus',
        duration: 'Durasi',
        price: 'Harga',
        discount: 'Diskon',
        finalPrice: 'Harga Akhir',
        submit: 'Kirim Pendaftaran',
        submitting: 'Mengirim...',
        success: 'Pendaftaran Berhasil!',
        successMessage: 'Permintaan pendaftaran Anda telah dikirim. Kami akan menghubungi Anda segera.',
        errors: {
          nameRequired: 'Nama wajib diisi',
          emailRequired: 'Email wajib diisi',
          emailInvalid: 'Format email tidak valid',
          phoneRequired: 'Nomor telepon wajib diisi',
          phoneInvalid: 'Format telepon tidak valid'
        }
      },
      consultation: {
        title: 'Minta Konsultasi',
        subtitle: 'Mari diskusikan kebutuhan proyek Anda',
        form: {
          name: 'Nama Lengkap',
          namePlaceholder: 'Masukkan nama lengkap Anda',
          email: 'Alamat Email',
          emailPlaceholder: 'email.anda@example.com',
          phone: 'Nomor Telepon',
          phonePlaceholder: '+62 XXX XXXX XXXX',
          company: 'Nama Perusahaan',
          companyPlaceholder: 'Nama perusahaan Anda (opsional)',
          projectType: 'Tipe Proyek',
          projectTypePlaceholder: 'Pilih tipe proyek',
          message: 'Detail Proyek',
          messagePlaceholder: 'Ceritakan tentang kebutuhan proyek Anda'
        },
        solutionInfo: 'Informasi Solusi',
        solutionName: 'Solusi',
        submit: 'Kirim Permintaan',
        submitting: 'Mengirim...',
        success: 'Permintaan Terkirim!',
        successMessage: 'Kami telah menerima permintaan konsultasi Anda. Tim kami akan menghubungi Anda dalam 24 jam.',
        errors: {
          nameRequired: 'Nama wajib diisi',
          emailRequired: 'Email wajib diisi',
          emailInvalid: 'Format email tidak valid',
          phoneRequired: 'Nomor telepon wajib diisi',
          messageRequired: 'Detail proyek wajib diisi'
        }
      },
      projectInquiry: {
        title: 'Permintaan Proyek',
        subtitle: 'Ceritakan tentang proyek Anda',
        form: {
          name: 'Nama Lengkap',
          namePlaceholder: 'Masukkan nama lengkap Anda',
          email: 'Alamat Email',
          emailPlaceholder: 'email.anda@example.com',
          phone: 'Nomor Telepon',
          phonePlaceholder: '+62 XXX XXXX XXXX',
          company: 'Nama Perusahaan',
          companyPlaceholder: 'Nama perusahaan Anda (opsional)',
          budget: 'Anggaran Anda (IDR)',
          budgetPlaceholder: 'contoh: 10.000.000',
          projectDetails: 'Detail Proyek',
          projectDetailsPlaceholder: 'Jelaskan kebutuhan proyek Anda secara detail'
        },
        packageInfo: 'Informasi Paket',
        packageName: 'Paket',
        price: 'Harga Mulai',
        submit: 'Kirim Permintaan',
        submitting: 'Mengirim...',
        success: 'Permintaan Terkirim!',
        successMessage: 'Terima kasih atas minat Anda! Tim kami akan meninjau permintaan Anda dan segera menghubungi Anda.',
        errors: {
          nameRequired: 'Nama wajib diisi',
          emailRequired: 'Email wajib diisi',
          emailInvalid: 'Format email tidak valid',
          phoneRequired: 'Nomor telepon wajib diisi',
          budgetRequired: 'Anggaran wajib diisi untuk paket khusus',
          projectDetailsRequired: 'Detail proyek wajib diisi'
        }
      },
      writeReview: {
        title: 'Tulis Ulasan',
        subtitle: 'Bagikan pengalaman Anda dengan kami',
        form: {
          name: 'Nama Anda',
          namePlaceholder: 'Masukkan nama Anda',
          email: 'Alamat Email',
          emailPlaceholder: 'email.anda@example.com',
          company: 'Perusahaan/Posisi',
          companyPlaceholder: 'Perusahaan atau posisi Anda (opsional)',
          rating: 'Rating',
          review: 'Ulasan Anda',
          reviewPlaceholder: 'Bagikan pengalaman Anda bekerja dengan kami...'
        },
        submit: 'Kirim Ulasan',
        submitting: 'Mengirim...',
        success: 'Ulasan Terkirim!',
        successMessage: 'Terima kasih atas umpan balik Anda! Ulasan Anda akan dipublikasikan setelah verifikasi.',
        errors: {
          nameRequired: 'Nama wajib diisi',
          emailRequired: 'Email wajib diisi',
          emailInvalid: 'Format email tidak valid',
          reviewRequired: 'Ulasan wajib diisi'
        }
      },
      login: {
        title: 'Selamat Datang Kembali',
        subtitle: 'Masuk ke akun Anda',
        form: {
          email: 'Alamat Email',
          emailPlaceholder: 'email.anda@example.com',
          password: 'Kata Sandi',
          passwordPlaceholder: 'Masukkan kata sandi Anda',
          remember: 'Ingat saya',
          forgot: 'Lupa kata sandi?'
        },
        submit: 'Masuk',
        submitting: 'Masuk...',
        noAccount: 'Belum punya akun?',
        signup: 'Daftar',
        errors: {
          emailRequired: 'Email wajib diisi',
          emailInvalid: 'Format email tidak valid',
          passwordRequired: 'Kata sandi wajib diisi'
        }
      },
      register: {
        title: 'Buat Akun',
        subtitle: 'Bergabung dengan Neverland Studio hari ini',
        form: {
          name: 'Nama Lengkap',
          namePlaceholder: 'Masukkan nama lengkap Anda',
          email: 'Alamat Email',
          emailPlaceholder: 'email.anda@example.com',
          password: 'Kata Sandi',
          passwordPlaceholder: 'Buat kata sandi yang kuat',
          confirmPassword: 'Konfirmasi Kata Sandi',
          confirmPasswordPlaceholder: 'Konfirmasi kata sandi Anda',
          terms: 'Saya setuju dengan Syarat & Ketentuan'
        },
        submit: 'Buat Akun',
        submitting: 'Membuat akun...',
        hasAccount: 'Sudah punya akun?',
        signin: 'Masuk',
        errors: {
          nameRequired: 'Nama wajib diisi',
          emailRequired: 'Email wajib diisi',
          emailInvalid: 'Format email tidak valid',
          passwordRequired: 'Kata sandi wajib diisi',
          passwordWeak: 'Kata sandi harus minimal 8 karakter',
          confirmPasswordRequired: 'Harap konfirmasi kata sandi Anda',
          passwordMismatch: 'Kata sandi tidak cocok',
          termsRequired: 'Anda harus menyetujui syarat & ketentuan'
        }
      }
    },
    skills: {
      badge: 'Keahlian Kami',
      hero: {
        title: 'Keterampilan',
        titleHighlight: 'Teknis',
        titleSuffix: '& Keahlian',
        subtitle: 'Menguasai teknologi terdepan untuk memberikan solusi yang luar biasa'
      },
      technicalProficiencies: {
        title: 'Kemampuan Teknis',
        subtitle: 'Penguasaan menyeluruh di berbagai stack teknologi'
      },
      stats: {
        technologies: 'Teknologi',
        frameworks: 'Framework',
        certifications: 'Sertifikasi',
        experience: 'Tahun Pengalaman',
        years: 'Tahun'
      },
      categories: {
        frontend: 'Pengembangan Frontend',
        backend: 'Pengembangan Backend',
        database: 'Database & Penyimpanan',
        cloud: 'Cloud & DevOps',
        mobile: 'Pengembangan Mobile',
        tools: 'Tools & Framework'
      },
      skills: {
        react: 'React.js',
        typescript: 'TypeScript',
        nextjs: 'Next.js',
        vue: 'Vue.js',
        tailwind: 'Tailwind CSS',
        html: 'HTML5/CSS3',
        nodejs: 'Node.js',
        python: 'Python',
        php: 'PHP',
        laravel: 'Laravel',
        express: 'Express.js',
        restapi: 'REST API',
        mongodb: 'MongoDB',
        postgresql: 'PostgreSQL',
        mysql: 'MySQL',
        redis: 'Redis',
        firebase: 'Firebase',
        graphql: 'GraphQL',
        aws: 'AWS',
        googlecloud: 'Google Cloud',
        docker: 'Docker',
        kubernetes: 'Kubernetes',
        cicd: 'CI/CD',
        nginx: 'Nginx',
        reactnative: 'React Native',
        flutter: 'Flutter',
        ios: 'Pengembangan iOS',
        android: 'Pengembangan Android',
        pwa: 'PWA',
        ionic: 'Ionic',
        git: 'Git & GitHub',
        vscode: 'VS Code',
        figma: 'Figma',
        webpack: 'Webpack',
        jest: 'Jest',
        postman: 'Postman'
      },
      softSkills: {
        title: 'Soft Skills & Atribut',
        subtitle: 'Selain keahlian teknis, kami unggul dalam kolaborasi dan kepemimpinan',
        problemSolving: 'Pemecahan Masalah',
        teamCollaboration: 'Kolaborasi Tim',
        communication: 'Komunikasi',
        projectManagement: 'Manajemen Proyek',
        creativeThinking: 'Berpikir Kreatif',
        timeManagement: 'Manajemen Waktu'
      },
      languages: {
        title: 'Kemampuan Bahasa',
        subtitle: 'Kemampuan komunikasi multibahasa',
        indonesian: {
          name: 'Bahasa Indonesia',
          level: 'Penutur Asli',
          speaking: 'Berbicara',
          writing: 'Menulis',
          reading: 'Membaca',
          listening: 'Mendengarkan'
        },
        english: {
          name: 'Bahasa Inggris',
          level: 'Kemampuan Kerja Profesional',
          speaking: 'Berbicara',
          writing: 'Menulis',
          reading: 'Membaca',
          listening: 'Mendengarkan'
        },
        globalCommunication: 'Komunikasi Global',
        globalDesc: 'Fasih dalam kedua bahasa untuk kolaborasi internasional dan komunikasi klien yang lancar'
      }
    },
    liveChat: {
      title: 'Chat Langsung',
      subtitle: 'Kami siap membantu',
      online: 'Online',
      offline: 'Offline',
      placeholder: 'Ketik pesan Anda...',
      send: 'Kirim',
      typing: 'mengetik...',
      welcome: 'Halo! Ada yang bisa kami bantu hari ini?',
      defaultResponse: 'Terima kasih atas pesan Anda! Tim kami akan segera merespons. Untuk urusan mendesak, silakan hubungi kami atau kirim email.'
    },
    common: {
      loading: 'Memuat...',
      error: 'Terjadi kesalahan',
      success: 'Berhasil!',
      cancel: 'Batal',
      save: 'Simpan',
      delete: 'Hapus',
      edit: 'Edit',
      view: 'Lihat',
      close: 'Tutup',
      back: 'Kembali',
      next: 'Selanjutnya',
      previous: 'Sebelumnya',
      search: 'Cari',
      filter: 'Filter',
      sort: 'Urutkan',
      required: 'Wajib',
      optional: 'Opsional',
      learnMore: 'Pelajari Lebih Lanjut',
      readMore: 'Baca Selengkapnya',
      viewAll: 'Lihat Semua',
      showMore: 'Tampilkan Lebih Banyak',
      showLess: 'Tampilkan Lebih Sedikit'
    },
    footer: {
      description: 'Mengubah ide menjadi solusi digital yang powerful dengan teknologi terdepan dan strategi inovatif. Membangun masa depan, satu proyek pada satu waktu.',
      followUs: 'Ikuti Kami',
      quickLinks: 'Tautan Cepat',
      services: 'Layanan',
      newsletter: 'Newsletter',
      newsletterDesc: 'Dapatkan update dan insight terbaru.',
      emailPlaceholder: 'Email Anda',
      paymentMethods: 'Metode Pembayaran',
      securePayment: 'Opsi pembayaran aman',
      badges: {
        sslsecure: 'SSL Aman',
        securepayment: 'Pembayaran Aman',
        verifiedsecurity: 'Keamanan Terverifikasi',
        moneybackguarantee: 'Garansi Uang Kembali'
      },
      copyright: '© 2025 Neverland Studio. Hak cipta dilindungi.',
      privacyPolicy: 'Kebijakan Privasi',
      termsOfService: 'Syarat Layanan',
      cookiePolicy: 'Kebijakan Cookie'
    }
  }
};
