import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

interface LoadingContextData {
  setLoading: (value: boolean) => void;
}

interface LoadingContextProviderProps {
  children: ReactNode;
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData
);

export function LoadingContextProvider({
  children,
}: LoadingContextProviderProps): JSX.Element {
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [location]);

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {loading && (
        <div className="absolute bg-neutral-900/50 h-screen w-screen flex items-center justify-center z-50">
          <div className="w-5 h-5 rounded-full border-solid border-2 border-neutral-50/25 border-l-neutral-50 animate-spin" />
        </div>
      )}

      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextData {
  const { setLoading } = useContext(LoadingContext);

  return { setLoading };
}
