// Simple Dashboard Authentication (No Database)
// Hardcoded admin credentials for dashboard access only

interface DashboardUser {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin';
}

// Hardcoded dashboard admin accounts
const DASHBOARD_ADMINS: DashboardUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    email: 'admin@neverlandstudio.com',
    role: 'admin'
  },
  {
    username: 'superadmin',
    password: 'admin123',
    name: 'Super Admin',
    email: 'superadmin@neverlandstudio.com',
    role: 'admin'
  }
];

class DashboardAuth {
  private readonly SESSION_KEY = 'dashboard_session';
  private readonly TOKEN_KEY = 'dashboard_token';

  /**
   * Login with hardcoded credentials
   */
  login(username: string, password: string): { success: boolean; user?: DashboardUser; error?: string } {
    // Find matching admin
    const admin = DASHBOARD_ADMINS.find(
      (a) => (a.username === username || a.email === username) && a.password === password
    );

    if (!admin) {
      return {
        success: false,
        error: 'Invalid username or password'
      };
    }

    // Create session
    const session = {
      user: {
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      loginTime: new Date().toISOString(),
      token: this.generateToken()
    };

    // Store in localStorage
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(this.TOKEN_KEY, session.token);

    return {
      success: true,
      user: admin
    };
  }

  /**
   * Set session manually (for backend authentication compatibility)
   */
  setSession(name: string, username: string, email: string): void {
    const session = {
      user: {
        username: username,
        name: name,
        email: email,
        role: 'admin'
      },
      loginTime: new Date().toISOString(),
      token: this.generateToken()
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(this.TOKEN_KEY, session.token);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const session = this.getSession();
    return session !== null && session.token === localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get current session
   */
  getSession(): { user: any; loginTime: string; token: string } | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): { username: string; name: string; email: string; role: string } | null {
    const session = this.getSession();
    return session ? session.user : null;
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Generate simple token
   */
  private generateToken(): string {
    return `dashboard_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

// Export singleton instance
export const dashboardAuth = new DashboardAuth();

// Export for easy access
export { DASHBOARD_ADMINS };
