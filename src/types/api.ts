/**
 * API Type Definitions
 * 
 * Comprehensive type definitions for all API requests and responses
 */

// Base API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    timestamp?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    code?: string;
    status?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

// Authentication Types
export interface AuthResponse {
    user: {
        id: number;
        name: string;
        email: string;
        role: 'admin' | 'user' | 'student';
        avatar?: string;
        email_verified_at?: string;
        created_at: string;
        updated_at: string;
    };
    token: string;
    expires_in?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

// Dashboard Types
export interface DashboardStats {
    users: {
        total: number;
        new_today: number;
        new_this_week: number;
        new_this_month: number;
        active: number;
    };
    contacts: {
        total: number;
        unread: number;
        replied: number;
        archived: number;
    };
    enrollments: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    consultations: {
        total: number;
        pending: number;
        scheduled: number;
        completed: number;
    };
    projects: {
        total: number;
        active: number;
        completed: number;
    };
    newsletter: {
        total: number;
        active: number;
        unsubscribed: number;
    };
    revenue?: {
        total: number;
        this_month: number;
        this_week: number;
        today: number;
    };
}

export interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
        borderWidth?: number;
    }>;
}

export interface ActivityData {
    id: number;
    type: string;
    description: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    metadata?: Record<string, any>;
}

// Profile Types
export interface ProfileUpdateRequest {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    current_password?: string;
    password?: string;
    password_confirmation?: string;
    avatar?: File | string;
}

export interface ProfileResponse {
    id: number;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    role: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

// Contact Types
export interface ContactSubmitRequest {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

// Enrollment Types
export interface EnrollmentSubmitRequest {
    name: string;
    email: string;
    phone: string;
    course: string;
    level?: string;
    message?: string;
}

// Consultation Types
export interface ConsultationSubmitRequest {
    name: string;
    email: string;
    phone: string;
    company?: string;
    service: string;
    preferred_date: string;
    preferred_time: string;
    message?: string;
}

// Newsletter Types
export interface NewsletterSubscribeRequest {
    email: string;
    name?: string;
}

// Maintenance Types
export interface MaintenanceStatus {
    is_active: boolean;
    message?: string;
    estimated_end?: string;
    allowed_ips?: string[];
}

// Real-time Types
export interface RealtimeData {
    stats: DashboardStats;
    recent_activities: ActivityData[];
    online_users?: number;
    last_updated: string;
}

// File Upload Types
export interface FileUploadResponse {
    url: string;
    path: string;
    filename: string;
    size: number;
    mime_type: string;
}

// Common Filter/Sort Types
export interface QueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    filter?: Record<string, any>;
}

// Batch Operation Types
export interface BatchOperationRequest {
    ids: number[];
    action: 'delete' | 'archive' | 'restore' | 'approve' | 'reject';
}

export interface BatchOperationResponse {
    success: boolean;
    processed: number;
    failed: number;
    errors?: Array<{
        id: number;
        error: string;
    }>;
}
