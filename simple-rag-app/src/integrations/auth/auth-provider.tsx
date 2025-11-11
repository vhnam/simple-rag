import { Auth0Provider, useAuth0, User } from '@auth0/auth0-react';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { authInterceptor } from '@/lib/axios';

export type Auth0User = User;

export interface AuthContextType {
  isAuthenticated: boolean;
  user?: Auth0User;
  isLoading: boolean;
  login: (options?: { screen_hint?: 'signup' }) => void;
  logout: () => void;
  getAccessTokenSilently: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthWrapper = ({ children }: PropsWithChildren) => {
  const redirectUri =
    typeof window !== 'undefined'
      ? window.location.origin
      : import.meta.env.VITE_APP_URL || '';

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: `${redirectUri}/auth/callback`,
        scope: 'openid profile email offline_access',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <AuthContextProvider>{children}</AuthContextProvider>
    </Auth0Provider>
  );
};

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    authInterceptor.setTokenCallback(async () => {
      try {
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          return token;
        }
        return null;
      } catch (error) {
        console.debug('Could not retrieve Auth0 token:', error);
        return null;
      }
    });
  }, [isAuthenticated, getAccessTokenSilently]);

  const contextValue = {
    isAuthenticated,
    user,
    login: (options?: { screen_hint?: 'signup' }) =>
      loginWithRedirect({
        authorizationParams: {
          screen_hint: options?.screen_hint,
        },
      }),
    logout: () =>
      logout({
        logoutParams: {
          returnTo:
            typeof window !== 'undefined'
              ? window.location.origin
              : import.meta.env.VITE_APP_URL || '',
        },
      }),
    isLoading,
    getAccessTokenSilently,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthWrapper');
  }
  return context;
}
