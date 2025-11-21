import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

// Tipe data untuk profil pengguna
export type UserProfile = {
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio?: string;
};

// Tipe data untuk konteks
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  login: (user: UserProfile, rememberMe?: boolean) => void;
  logout: () => void;
  updateProfile: (newProfileData: Partial<UserProfile>) => void;
}

// Membuat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Komponen Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk menangani loading awal

  // Efek untuk rehidrasi state dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userProfile');
      if (storedUser) {
        setUserProfile(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user profile from localStorage", error);
      localStorage.removeItem('userProfile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Bungkus fungsi dengan useCallback agar referensinya tidak berubah di setiap render
  const login = useCallback((user: UserProfile, rememberMe = false) => {
    setUserProfile(user);
    if (rememberMe) {
      localStorage.setItem('userProfile', JSON.stringify(user));
    }
  }, []);

  const logout = useCallback(() => {
    setUserProfile(null);
    localStorage.removeItem('userProfile');
  }, []);

  const updateProfile = useCallback((newProfileData: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      if (!prevProfile) return null;
      const updatedProfile = { ...prevProfile, ...newProfileData };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []);

  // Gunakan useMemo untuk memoize nilai context, mencegah re-render yang tidak perlu
  // pada komponen consumer. isLoggedIn sekarang di-derive dari userProfile.
  const value = useMemo(() => ({
    isLoggedIn: !!userProfile,
    isLoading,
    userProfile,
    login,
    logout,
    updateProfile,
  }), [userProfile, isLoading, login, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook untuk menggunakan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};