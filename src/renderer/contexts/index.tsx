import { ReactNode } from 'react';

import { AuthContextProvider } from './AuthContext';
import { ProjectContextProvider } from './ProjectContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AuthProviderProps): JSX.Element {
  return (
    <AuthContextProvider>
      <ProjectContextProvider>{children}</ProjectContextProvider>
    </AuthContextProvider>
  );
}
