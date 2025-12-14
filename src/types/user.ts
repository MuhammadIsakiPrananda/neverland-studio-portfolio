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
  twoFactorEnabled?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
