import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { createContext, PropsWithChildren, useContext } from 'react';

interface Auth0ContextType {
  isAuthenticated: boolean;
  user: any;
  login: (options?: { screen_hint?: 'signup' }) => void;
  logout: () => void;
  isLoading: boolean;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

export const Auth0Wrapper = ({ children }: PropsWithChildren) => {
  const redirectUri =
    typeof window !== 'undefined'
      ? window.location.origin
      : import.meta.env.VITE_APP_URL || '';

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${redirectUri}/auth/callback`,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <Auth0ContextProvider>{children}</Auth0ContextProvider>
    </Auth0Provider>
  );
};

const Auth0ContextProvider = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } =
    useAuth0();

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
  };

  return (
    <Auth0Context.Provider value={contextValue}>
      {children}
    </Auth0Context.Provider>
  );
};

export function useAuth0Context() {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error('useAuth0Context must be used within Auth0Wrapper');
  }
  return context;
}
