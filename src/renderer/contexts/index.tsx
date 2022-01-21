import { ReactNode } from 'react';

import { AuthContextProvider } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AuthProviderProps): JSX.Element {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
