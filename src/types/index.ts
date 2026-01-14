/**
 * Centralized Type Exports
 * 
 * This file serves as the main entry point for all TypeScript types
 * used throughout the application.
 */

// Export all API types
export * from './api';

// Export all model types
export * from './models';

// Legacy/UI-specific types (kept for backward compatibility)
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'id';

// Pricing Plan (UI-specific)
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

// Re-export commonly used types for convenience
export type {
  User,
  Project,
  Contact,
  Enrollment,
  Consultation,
  Newsletter,
  ActivityLog,
  LoginHistory,
  UserSession,
  MaintenanceSettings,
  Service,
  Testimonial,
  TeamMember,
  Notification,
} from './models';

export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  AuthResponse,
  DashboardStats,
  ChartData,
  ActivityData,
  ProfileResponse,
  ProfileUpdateRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ContactSubmitRequest,
  EnrollmentSubmitRequest,
  ConsultationSubmitRequest,
  NewsletterSubscribeRequest,
  MaintenanceStatus,
  RealtimeData,
  FileUploadResponse,
  QueryParams,
  BatchOperationRequest,
  BatchOperationResponse,
} from './api';
