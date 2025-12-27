const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  job_title?: string;
  company?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserListParams {
  search?: string;
  role?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
}

export interface CreateUserData {
  name: string;
  username?: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
  location?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  job_title?: string;
  company?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  email_verified_at?: boolean;
}

export interface UserStats {
  total: number;
  active: number;
  new_this_month: number;
}

class UserService {
  /**
   * Fetch users with optional search, filter, and pagination
   */
  async fetchUsers(params: UserListParams = {}): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.page) queryParams.append('page', params.page.toString());

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include credentials for CORS
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running at http://127.0.0.1:8000');
      }
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<{ success: boolean; message: string; data: User }> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create user');
    }

    return result;
  }

  /**
   * Get single user details
   */
  async getUser(id: number): Promise<{ success: boolean; data: User }> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    return response.json();
  }

  /**
   * Update existing user
   */
  async updateUser(id: number, data: UpdateUserData): Promise<{ success: boolean; message: string; data: User }> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update user');
    }

    return result;
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete user');
    }

    return result;
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{ success: boolean; data: UserStats }> {
    const response = await fetch(`${API_BASE_URL}/admin/users/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user statistics');
    }

    return response.json();
  }
}

export const userService = new UserService();
