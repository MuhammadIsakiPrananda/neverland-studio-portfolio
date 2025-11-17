import { useState } from 'react';
import { useNotification } from '@/component/ui/useNotification';

export type AuthProvider = 'google' | 'github' | 'linkedin';

// In a real application, these should be stored in environment variables (.env)
// and not hardcoded like this.
const OAUTH_CLIENT_IDS = {
  github: import.meta.env.VITE_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
  google: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
  linkedin: import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID',
};

/**
 * Custom hook to handle the social authentication (OAuth) flow.
 * Manages loading state and redirects the user to the provider's authentication URL.
 */
export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const { addNotification } = useNotification();

  const initiateLogin = (provider: AuthProvider) => {
    setIsLoading(provider);

    try {
      let authUrl = '';
      // This is the URL where the provider will redirect the user back to after login.
      // You will need to create a page/route to handle this callback.
      const redirectUri = `${window.location.origin}/auth/callback/${provider}`;

      switch (provider) {
        case 'github':
          authUrl = `https://github.com/login/oauth/authorize?client_id=${OAUTH_CLIENT_IDS.github}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
          break;
        case 'google':
          authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${OAUTH_CLIENT_IDS.google}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email`;
          break;
        case 'linkedin':
          // LinkedIn uses a 'state' parameter for CSRF protection
          const csrfToken = Math.random().toString(36).substring(2);
          sessionStorage.setItem('linkedin_csrf_token', csrfToken);
          authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${OAUTH_CLIENT_IDS.linkedin}&redirect_uri=${redirectUri}&state=${csrfToken}&scope=profile%20email%20openid`;
          break;
        default:
          // This case is for type safety and should not be reached.
          throw new Error(`Provider ${provider} is not supported.`);
      }

      // Redirect the user to the authentication page
      window.location.href = authUrl;
    } catch (error) {
      addNotification('Authentication Error', error instanceof Error ? error.message : 'An unknown error occurred.', 'error');
      setIsLoading(null);
    }
  };

  return { initiateLogin, isLoading };
};