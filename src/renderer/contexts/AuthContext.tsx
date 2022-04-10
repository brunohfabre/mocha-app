import { createContext, ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '@services/api';

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type SignInResponse = {
  user: UserType;
  token: string;
};

type SignInData = {
  email: string;
  password: string;
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
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: UpdateProfileData) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
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

  async function signIn({ email, password }: SignInData): Promise<void> {
    try {
      const response = await api.post<SignInResponse>('/sessions', {
        email,
        password,
      });

      localStorage.setItem('@mocha:token', response.data.token);
      localStorage.setItem('@mocha:user', JSON.stringify(response.data.user));

      setToken(response.data.token);
      setUser(response.data.user);
    } catch (err) {
      console.log(err);
    }
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
