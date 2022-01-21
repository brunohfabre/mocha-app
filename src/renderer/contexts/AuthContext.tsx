import { createContext, ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

interface SignInData {
  user: UserType;
  token: string;
}
interface AuthContextData {
  isSigned: boolean;
  token: string;
  user: UserType | null;
  signIn: (data: SignInData) => void;
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

  const [token, setToken] = useState(() => {
    const tokenData = localStorage.getItem('@mocha:token');

    if (tokenData) {
      return tokenData;
    }

    return '';
  });
  const [user, setUser] = useState<UserType | null>(() => {
    const userData = localStorage.getItem('@mocha:user');

    if (userData) {
      return JSON.parse(userData);
    }

    return null;
  });

  const isSigned = useMemo(() => !!token && !!user?.id, [token, user]);

  function signIn(data: SignInData): void {
    localStorage.setItem('@mocha:token', data.token);
    localStorage.setItem('@mocha:user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  }

  function signOut(): void {
    localStorage.removeItem('@mocha:token');
    localStorage.removeItem('@mocha:user');

    setToken('');
    setUser(null);

    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ isSigned, token, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
