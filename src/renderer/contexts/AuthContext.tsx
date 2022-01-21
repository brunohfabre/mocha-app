import { createContext, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
  isSigned: boolean;
  signIn: () => void;
  signOut: () => void;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): JSX.Element {
  const navigate = useNavigate();

  const [isSigned, setIsSigned] = useState(false);

  function signIn(): void {
    setIsSigned(true);
  }

  function signOut(): void {
    navigate('/');

    setIsSigned(false);
  }

  return (
    <AuthContext.Provider value={{ isSigned, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
