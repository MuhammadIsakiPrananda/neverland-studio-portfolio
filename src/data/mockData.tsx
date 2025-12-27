import { 
  Code, Smartphone, Shield, Cloud, Palette, TrendingUp 
} from 'lucide-react';
import type { Service, Project, PricingPlan, Testimonial } from '../types';

export const services: Service[] = [
  {
    id: '1',
    icon: <Code className="w-8 h-8" />,
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business needs with cutting-edge technologies and agile methodologies.',
    features: ['Web Applications', 'Desktop Software', 'API Development', 'System Integration']
  },
  {
    id: '2',
    icon: <Smartphone className="w-8 h-8" />,
    title: 'Web & Mobile Apps',
    description: 'Beautiful, responsive, and high-performance applications for iOS, Android, and web platforms.',
    features: ['iOS Development', 'Android Development', 'Progressive Web Apps', 'Cross-platform Solutions']
  },
  {
    id: '3',
    icon: <Shield className="w-8 h-8" />,
    title: 'Cyber Security',
    description: 'Comprehensive security solutions to protect your digital assets and ensure business continuity.',
    features: ['Security Audits', 'Penetration Testing', 'Security Consulting', '24/7 Monitoring']
  },
  {
    id: '4',
    icon: <Cloud className="w-8 h-8" />,
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and migration services for modern businesses.',
    features: ['Cloud Migration', 'AWS/Azure/GCP', 'DevOps Services', 'Cloud Optimization']
  },
  {
    id: '5',
    icon: <Palette className="w-8 h-8" />,
    title: 'UI/UX Design',
    description: 'User-centered design that combines aesthetics with functionality for exceptional user experiences.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
  },
  {
    id: '6',
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Digital Transformation',
    description: 'Strategic guidance to modernize your business processes and embrace digital technologies.',
    features: ['Digital Strategy', 'Process Automation', 'Change Management', 'Technology Consulting']
  }
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform Revolution',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
    description: 'A complete e-commerce solution with AI-powered recommendations and real-time inventory management.',
    techStack: ['React', 'Node.js', 'MongoDB', 'AWS', 'Stripe'],
    client: 'RetailCorp International'
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    category: 'Mobile Development',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    description: 'Secure and intuitive mobile banking application with biometric authentication and instant transfers.',
    techStack: ['React Native', 'TypeScript', 'Firebase', 'Plaid API'],
    client: 'FinTech Solutions Ltd'
  },
  {
    id: '3',
    title: 'Healthcare Management System',
    category: 'Enterprise Software',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    description: 'Comprehensive healthcare platform connecting patients, doctors, and hospitals seamlessly.',
    techStack: ['Vue.js', 'Python', 'PostgreSQL', 'Docker', 'Redis'],
    client: 'MediCare Group'
  },
  {
    id: '4',
    title: 'Smart City IoT Platform',
    category: 'Cloud Solutions',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
    description: 'IoT platform managing thousands of sensors for smart city infrastructure.',
    techStack: ['Angular', 'Java', 'Kubernetes', 'MQTT', 'InfluxDB'],
    client: 'City Government'
  },
  {
    id: '5',
    title: 'AI-Powered Analytics Dashboard',
    category: 'Data Analytics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    description: 'Real-time analytics dashboard with machine learning insights and predictive modeling.',
    techStack: ['React', 'Python', 'TensorFlow', 'D3.js', 'BigQuery'],
    client: 'DataTech Innovations'
  },
  {
    id: '6',
    title: 'Restaurant Management Suite',
    category: 'SaaS',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800',
    description: 'All-in-one solution for restaurant operations, from ordering to inventory management.',
    techStack: ['Next.js', 'GraphQL', 'Prisma', 'Vercel', 'Stripe'],
    client: 'FoodChain Network'
  }
];

export const initialPricingPlans: PricingPlan[] = [
  {
    id: '1',
    name: 'Starter',
    price: 15000000,
    period: 'month',
    features: [
      'Basic website development',
      'Responsive design',
      '3 pages included',
      'Basic SEO optimization',
      '1 month support',
      'Source code included'
    ],
    enabled: true
  },
  {
    id: '2',
    name: 'Professional',
    price: 45000000,
    period: 'month',
    popular: true,
    discount: 25,
    features: [
      'Advanced web application',
      'Custom design system',
      'Unlimited pages',
      'Advanced SEO & Analytics',
      '6 months support',
      'API integration',
      'Admin dashboard',
      'Security features'
    ],
    enabled: true
  },
  {
    id: '3',
    name: 'Business',
    price: 90000000,
    period: 'month',
    discount: 15,
    features: [
      'Enterprise application',
      'Premium UI/UX design',
      'Multi-platform support',
      'Advanced analytics',
      '12 months support',
      'Cloud infrastructure',
      'Custom integrations',
      'Dedicated team',
      'Priority support'
    ],
    enabled: true
  },
  {
    id: '4',
    name: 'Enterprise',
    price: 0,
    period: 'custom',
    features: [
      'Full digital transformation',
      'Custom everything',
      'Unlimited resources',
      'White-label solutions',
      'Lifetime support',
      'Dedicated account manager',
      'SLA guarantees',
      'Training & consulting',
      '24/7 premium support'
    ],
    enabled: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Global',
    position: 'CEO',
    rating: 5,
    content: 'Neverland Studio transformed our digital presence completely. Their team delivered beyond expectations with exceptional attention to detail and professionalism.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'StartupHub',
    position: 'CTO',
    rating: 5,
    content: 'Working with Neverland was seamless. They understood our vision and created a scalable solution that grew with our business. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'FinanceFlow',
    position: 'Product Manager',
    rating: 5,
    content: 'The security and quality of their work is outstanding. Our mobile app has received incredible feedback from users. Best investment we made!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
  },
  {
    id: '4',
    name: 'David Kim',
    company: 'HealthTech Solutions',
    position: 'Founder',
    rating: 5,
    content: 'Exceptional service from start to finish. The team at Neverland Studio is professional, responsive, and truly cares about delivering results.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    company: 'EduLearn Platform',
    position: 'VP of Engineering',
    rating: 5,
    content: 'Their expertise in cloud solutions helped us scale efficiently. The migration was smooth and our platform performance improved dramatically.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  },
  {
    id: '6',
    name: 'James Wilson',
    company: 'RetailPro Inc',
    position: 'Director of IT',
    rating: 5,
    content: 'Neverland Studio delivered our e-commerce platform on time and within budget. Their ongoing support has been invaluable to our success.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'
  }
];

export const trustedCompanies = [
  'Microsoft', 'Amazon', 'Google', 'Apple', 'Meta', 'Netflix', 
  'Tesla', 'Samsung', 'IBM', 'Oracle', 'Salesforce', 'Adobe',
  'Intel', 'Cisco', 'SAP', 'Spotify', 'Uber', 'Airbnb'
];

export const teamMembers = [
  {
    name: 'Alex Thompson',
    position: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: '15+ years in software engineering and business leadership'
  },
  {
    name: 'Jessica Park',
    position: 'CTO',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    bio: 'Former Google engineer, expert in scalable architectures'
  },
  {
    name: 'Marcus Lee',
    position: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    bio: 'Award-winning designer with a passion for user experience'
  },
  {
    name: 'Rachel Cohen',
    position: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    bio: 'Full-stack expert specializing in modern web technologies'
  },
  {
    name: 'Omar Hassan',
    position: 'Security Architect',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400',
    bio: 'Certified ethical hacker and cybersecurity consultant'
  },
  {
    name: 'Sophie Martin',
    position: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
    bio: 'Agile expert ensuring smooth project delivery'
  }
];
