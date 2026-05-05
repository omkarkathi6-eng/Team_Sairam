import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isTokenExpired, refreshToken, clearAuthTokens } from '@/lib/auth';

export const useAuthCheck = (requiredRole = null) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        
        // No token, redirect to login
        if (!token) {
          throw new Error('No authentication token');
        }

        // Check if token is expired and try to refresh it
        if (isTokenExpired()) {
          const newTokens = await refreshToken();
          if (!newTokens?.access_token) {
            throw new Error('Token refresh failed');
          }
        }

        // If role is required, verify it
        if (requiredRole) {
          // You might want to decode the token to get user roles
          // For now, we'll just check if the user is authenticated
          const user = JSON.parse(localStorage.getItem('jobraze-user') || '{}');
          if (user.userType !== requiredRole) {
            throw new Error('Unauthorized access');
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        clearAuthTokens();
        window.dispatchEvent(new Event('unauthorized'));
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up global unauthorized handler
    const handleUnauthorized = () => {
      clearAuthTokens();
      router.push('/auth/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [router, requiredRole]);

  return { isLoading, isAuthorized };
};
