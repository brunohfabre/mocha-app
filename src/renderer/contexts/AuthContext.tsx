import { createContext, ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type SignInData = {
  user: UserType;
  token: string;
};

type UpdateProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AuthContextData = {
  isSigned: boolean;
  token: string;
  user: UserType | null;
  signIn: (data: SignInData) => void;
  signOut: () => void;
  updateProfile: (data: UpdateProfileData) => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

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

  function updateProfile(data: UpdateProfileData): void {
    if (user) {
      const { id } = user;
      const newData = { id, ...data };

      localStorage.setItem('@mocha:user', JSON.stringify(newData));

      setUser(newData);
    }
  }

  return (
    <AuthContext.Provider
      value={{ isSigned, token, user, signIn, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
