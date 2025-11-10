import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  icon: ReactNode;
}

export interface Service {
  icon: ReactNode;
  title: string;
  desc: string;
  features: string[];
  color: string;
}

export interface PortfolioItem {
  title: string;
  category: string;
  image: string;
  desc: string;
  tags: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  desc: string;
  features: string[];
  popular: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface ProcessStep {
  icon: ReactNode;
  title: string;
  desc: string;
  step: string;
}

export interface Benefit {
  icon: ReactNode;
  title: string;
  desc: string;
}

export interface Stat {
  icon: ReactNode;
  number: string;
  label: string;
}

export interface FAQ {
  q: string;
  a: string;
}