import type { ReactElement } from 'react';

export interface NavItem {
  name: string;
  href: string;
  icon: ReactElement;
}

export interface Benefit {
  title: string;
  desc: string;
  icon: ReactElement;
}

export interface Service {
  title: string;
  desc: string;
  icon: ReactElement;
  color: string;
  features: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  icon: ReactElement;
}

export interface PortfolioItem {
  title: string;
  desc: string;
  image: string;
  category: string;
  tags: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
  rating: number;
}

export interface PricingPlan {
  name: string;
  price: string;
  desc: string;
  features: string[];
  popular?: boolean;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Stat {
  number: string;
  label: string;
  icon: ReactElement;
}