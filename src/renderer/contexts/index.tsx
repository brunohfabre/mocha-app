import { ReactNode } from 'react';

import { AuthProvider } from './AuthContext';
import { ProjectProvider } from './ProjectContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AuthProviderProps): JSX.Element {
  return (
    <AuthProvider>
      <ProjectProvider>{children}</ProjectProvider>
    </AuthProvider>
  );
}
