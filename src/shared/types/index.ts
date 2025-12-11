/**
 * Shared TypeScript Types & Interfaces
 * Central location for all common types used across the application
 */

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string | number;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  image?: string | null;
  bio?: string;
  role: "user" | "admin";
  provider?: "email" | "google" | "github";
  coverPhoto?: string | null;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// COMMON UI TYPES
// ============================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// ============================================
// FORM TYPES
// ============================================

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================
// MODAL TYPES
// ============================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// ============================================
// ROUTE TYPES
// ============================================

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  adminOnly?: boolean;
  title?: string;
}

// ============================================
// LANDING PAGE TYPES
// ============================================

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactElement;
}

export interface Benefit {
  title: string;
  desc: string;
  icon: React.ReactElement;
}

export interface Service {
  title: string;
  desc: string;
  icon: React.ReactElement;
  color: string;
  features: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactElement;
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
  icon: React.ReactElement;
}
