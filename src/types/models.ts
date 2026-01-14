/**
 * Data Model Type Definitions
 * 
 * Type definitions for all data models used in the application
 */

// User Model
export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    role: 'admin' | 'user' | 'student' | 'instructor';
    email_verified_at?: string;
    two_factor_enabled?: boolean;
    is_active: boolean;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
}

// Project Model
export interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    category: string;
    tags?: string[];
    image?: string;
    images?: string[];
    demo_url?: string;
    github_url?: string;
    technologies?: string[];
    client?: string;
    completion_date?: string;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    views: number;
    likes: number;
    created_by?: number;
    created_at: string;
    updated_at: string;
}

// Contact Model
export interface Contact {
    id: number;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    reply?: string;
    replied_at?: string;
    replied_by?: number;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    updated_at: string;
}

// Enrollment Model
export interface Enrollment {
    id: number;
    name: string;
    email: string;
    phone: string;
    course: string;
    level?: string;
    message?: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    payment_status?: 'unpaid' | 'paid' | 'refunded';
    payment_amount?: number;
    payment_date?: string;
    approved_at?: string;
    approved_by?: number;
    rejection_reason?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// Consultation Model
export interface Consultation {
    id: number;
    name: string;
    email: string;
    phone: string;
    company?: string;
    service: string;
    preferred_date: string;
    preferred_time: string;
    message?: string;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    scheduled_date?: string;
    scheduled_time?: string;
    meeting_link?: string;
    notes?: string;
    assigned_to?: number;
    completed_at?: string;
    cancelled_at?: string;
    cancellation_reason?: string;
    created_at: string;
    updated_at: string;
}

// Newsletter Model
export interface Newsletter {
    id: number;
    email: string;
    name?: string;
    status: 'active' | 'unsubscribed';
    subscribed_at: string;
    unsubscribed_at?: string;
    verification_token?: string;
    verified_at?: string;
    ip_address?: string;
    created_at: string;
    updated_at: string;
}

// Activity Log Model
export interface ActivityLog {
    id: number;
    user_id?: number;
    user?: Partial<User>;
    type: string;
    action: string;
    description: string;
    model_type?: string;
    model_id?: number;
    ip_address?: string;
    user_agent?: string;
    metadata?: Record<string, any>;
    created_at: string;
}

// Login History Model
export interface LoginHistory {
    id: number;
    user_id: number;
    user?: Partial<User>;
    ip_address: string;
    user_agent: string;
    device?: string;
    browser?: string;
    platform?: string;
    location?: {
        country?: string;
        city?: string;
        region?: string;
    };
    status: 'success' | 'failed' | 'blocked';
    failure_reason?: string;
    session_id?: string;
    logout_at?: string;
    created_at: string;
}

// User Session Model
export interface UserSession {
    id: string;
    user_id: number;
    user?: Partial<User>;
    ip_address: string;
    user_agent: string;
    device?: string;
    browser?: string;
    platform?: string;
    last_activity: string;
    is_current: boolean;
    created_at: string;
    expires_at?: string;
}

// Maintenance Settings Model
export interface MaintenanceSettings {
    id: number;
    is_active: boolean;
    message?: string;
    estimated_end?: string;
    allowed_ips?: string[];
    bypass_token?: string;
    updated_by?: number;
    created_at: string;
    updated_at: string;
}

// Service Model (for displaying services)
export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    features?: string[];
    price?: {
        amount: number;
        currency: string;
        unit: string;
    };
    category: string;
    popular?: boolean;
}

// Testimonial Model
export interface Testimonial {
    id: number;
    name: string;
    position?: string;
    company?: string;
    avatar?: string;
    rating: number;
    comment: string;
    featured: boolean;
    approved: boolean;
    created_at: string;
    updated_at: string;
}

// Team Member Model
export interface TeamMember {
    id: number;
    name: string;
    position: string;
    bio?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    social_links?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        website?: string;
    };
    skills?: string[];
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Notification Model
export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    read: boolean;
    read_at?: string;
    action_url?: string;
    action_text?: string;
    metadata?: Record<string, any>;
    created_at: string;
}
