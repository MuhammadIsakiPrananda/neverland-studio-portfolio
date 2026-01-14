import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../config/api.config';

export interface Transaction {
    id: number;
    invoice_number: string;
    client_name: string;
    client_email: string;
    client_phone: string | null;
    product_name: string;
    description: string | null;
    amount: number;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    payment_method: 'bank_transfer' | 'credit_card' | 'e_wallet' | 'cash' | null;
    payment_reference: string | null;
    paid_at: string | null;
    due_date: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface TransactionStats {
    total_revenue: number;
    pending_amount: number;
    pending_count: number;
    paid_this_month: number;
    overdue_amount: number;
    overdue_count: number;
}

export interface TransactionFilters {
    status?: 'all' | 'pending' | 'paid' | 'overdue' | 'cancelled';
    search?: string;
    per_page?: number;
    page?: number;
}

export interface TransactionResponse {
    success: boolean;
    data: {
        data: Transaction[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: TransactionStats;
}

export interface StatsResponse {
    success: boolean;
    stats: TransactionStats;
}

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

// Create axios instance for transactions
const createTransactionApi = () => {
    const baseURL = getApiUrl();
    const token = getAuthToken();

    return axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        timeout: 15000,
        withCredentials: true,
    });
};

// Retry utility with exponential backoff
const retryWithBackoff = async <T,>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;

        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status && status >= 400 && status < 500 && status !== 429) {
                throw error;
            }
        }

        console.log(`Retrying... ${retries} attempts left. Waiting ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2); // Exponential backoff
    }
};

class TransactionService {
    /**
     * Fetch all transactions with optional filters
     */
    async fetchTransactions(filters: TransactionFilters = {}): Promise<TransactionResponse> {
        return retryWithBackoff(async () => {
            try {
                const api = createTransactionApi();
                const params = new URLSearchParams();

                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status);
                }

                if (filters.search) {
                    params.append('search', filters.search);
                }

                if (filters.per_page) {
                    params.append('per_page', filters.per_page.toString());
                }

                if (filters.page) {
                    params.append('page', filters.page.toString());
                }

                const queryString = params.toString();
                const url = queryString ? `/dashboard/transactions?${queryString}` : '/dashboard/transactions';

                const response = await api.get(url);
                return response.data;
            } catch (error: any) {
                console.error('Error fetching transactions:', error);
                console.error('Error response:', error.response?.data);

                // Provide user-friendly error messages
                const message = error.response?.data?.message || error.message;
                if (error.response?.status === 404) {
                    throw new Error('Transaction endpoint not found. Please check your API configuration.');
                } else if (error.response?.status === 500) {
                    throw new Error('Server error occurred. Please try again later.');
                } else if (error.code === 'ECONNABORTED') {
                    throw new Error('Request timeout. Please check your internet connection.');
                } else {
                    throw new Error(message || 'Failed to fetch transactions');
                }
            }
        }, 2); // Retry up to 2 times
    }

    /**
     * Fetch transaction statistics only
     */
    async fetchTransactionStats(): Promise<StatsResponse> {
        return retryWithBackoff(async () => {
            try {
                const api = createTransactionApi();
                const response = await api.get('/dashboard/transactions/stats');
                return response.data;
            } catch (error: any) {
                console.error('Error fetching transaction stats:', error);

                const message = error.response?.data?.message || error.message;
                throw new Error(message || 'Failed to fetch transaction statistics');
            }
        }, 2);
    }

    /**
     * Fetch a single transaction by ID
     */
    async fetchTransactionById(id: number): Promise<Transaction> {
        return retryWithBackoff(async () => {
            try {
                const api = createTransactionApi();
                const response = await api.get(`/dashboard/transactions/${id}`);
                return response.data.data;
            } catch (error: any) {
                console.error('Error fetching transaction:', error);

                const message = error.response?.data?.message || error.message;
                throw new Error(message || 'Failed to fetch transaction');
            }
        }, 1); // Lower retry count for specific transaction
    }

    /**
     * Mark a transaction as paid
     */
    async markAsPaid(
        id: number,
        paymentMethod: 'bank_transfer' | 'credit_card' | 'e_wallet' | 'cash',
        paymentReference?: string
    ): Promise<Transaction> {
        try {
            const api = createTransactionApi();
            const response = await api.post(`/dashboard/transactions/${id}/mark-as-paid`, {
                payment_method: paymentMethod,
                payment_reference: paymentReference,
            });
            return response.data.data;
        } catch (error: any) {
            console.error('Error marking transaction as paid:', error);

            const message = error.response?.data?.message || error.message;
            throw new Error(message || 'Failed to mark transaction as paid');
        }
    }

    /**
     * Update a transaction
     */
    async updateTransaction(id: number, data: Partial<Transaction>): Promise<Transaction> {
        try {
            const api = createTransactionApi();
            const response = await api.put(`/dashboard/transactions/${id}`, data);
            return response.data.data;
        } catch (error: any) {
            console.error('Error updating transaction:', error);

            const message = error.response?.data?.message || error.message;
            throw new Error(message || 'Failed to update transaction');
        }
    }

    /**
     * Delete a transaction
     */
    async deleteTransaction(id: number): Promise<void> {
        try {
            const api = createTransactionApi();
            await api.delete(`/dashboard/transactions/${id}`);
        } catch (error: any) {
            console.error('Error deleting transaction:', error);

            const message = error.response?.data?.message || error.message;
            throw new Error(message || 'Failed to delete transaction');
        }
    }
}

export default new TransactionService();
