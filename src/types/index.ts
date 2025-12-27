// Types
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'id';
export type UserRole = 'admin' | 'editor' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  techStack: string[];
  client: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  discount?: number;
  enabled: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  position: string;
  rating: number;
  content: string;
  avatar: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}
