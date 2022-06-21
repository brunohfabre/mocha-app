import { createContext, ReactNode, useContext, useState } from 'react';

import { Spin } from '../components/Spin';

interface LoadingContextData {
  setLoading(value: boolean): void;
}

export const LoadingContext = createContext({} as LoadingContextData);

type LoadingProviderProps = {
  children: ReactNode;
};

export function LoadingProvider({
  children,
}: LoadingProviderProps): JSX.Element {
  const [refs, setRefs] = useState(0);

  function setLoading(value: boolean): void {
    if (value) {
      setRefs((prevState) => prevState + 1);
    } else {
      setRefs((prevState) => (prevState <= 0 ? 0 : prevState - 1));
    }
  }

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      <Spin spinning={!!refs} />

      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextData {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  return context;
}
