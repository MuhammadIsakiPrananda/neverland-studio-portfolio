import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { z } from 'zod';

// Skema Zod untuk validasi data pengguna, diselaraskan dengan model Sequelize
export const UserProfileSchema = z.object({
  id: z.union([z.string(), z.number()]), // ID bisa berupa string (dari Google/GitHub) atau number
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  bio: z.string().optional(), // Dihapus .nullable() untuk menyelaraskan dengan tipe form dan komponen
  role: z.enum(['user', 'admin']),
  provider: z.enum(['email', 'google', 'github']).optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export interface AuthContextType {
  userProfile: UserProfile | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: UserProfile, authToken: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user dari localStorage saat mount
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        // Cek localStorage dulu, lalu sessionStorage
        let storedToken = localStorage.getItem('authToken');
        let storedUser = localStorage.getItem('user');

        if (!storedToken || !storedUser) {
          storedToken = sessionStorage.getItem('authToken');
          storedUser = sessionStorage.getItem('user');
        }
        
        if (storedToken && storedUser) {
          const potentialUser = JSON.parse(storedUser);
          // Validasi data dari storage sebelum dimasukkan ke state
          const validationResult = UserProfileSchema.safeParse(potentialUser);
          if (validationResult.success) {
            setToken(storedToken);
            setUserProfile(validationResult.data);
          } else {
            // Jika data tidak valid, bersihkan storage
            throw new Error('Invalid user data in storage.');
          }
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to load or validate auth from storage:', err);
        }
        // Bersihkan storage jika ada data yang korup atau tidak valid
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (userData: UserProfile, authToken: string, rememberMe: boolean) => {
    try {
      // Set state
      setUserProfile(userData);
      setToken(authToken);

      // Persist to localStorage or sessionStorage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', authToken);
      storage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    // Clear state
    setUserProfile(null);
    setToken(null);

    // Clear both storages to ensure a clean logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userProfile');
    
    // Dispatch logout event to clear 2FA and other user-specific state
    window.dispatchEvent(new Event('userLogout'));
  };

  const updateProfile = async (userData: Partial<UserProfile>) => {
    if (!userProfile) return;

    const potentialUpdatedUser = { ...userProfile, ...userData };

    // Validasi data yang telah digabung sebelum menyimpannya
    const validationResult = UserProfileSchema.safeParse(potentialUpdatedUser);

    if (!validationResult.success) {
      if (import.meta.env.DEV) {
        console.error('Update profile failed validation:', validationResult.error);
      }
      // Jangan update state atau storage jika data baru tidak valid
      return;
    }

    const validUpdatedUser = validationResult.data;
    setUserProfile(validUpdatedUser);

    // Update the correct storage
    const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(validUpdatedUser));
  };

  const value: AuthContextType = {
    userProfile,
    token,
    isLoggedIn: !!userProfile && !!token,
    isLoading,
    login,
    logout,
    updateProfile,
  };

  // Jangan render children sampai status otentikasi selesai dimuat.
  // Ini mencegah "flash of unauthenticated content" (FOUC).
  if (isLoading) {
    return null; // Atau tampilkan global loader/spinner di sini
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}