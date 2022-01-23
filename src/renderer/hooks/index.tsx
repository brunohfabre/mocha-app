import { ReactNode } from 'react';

import { LoadingContextProvider } from './loadingHook';

interface HooksProviderProps {
  children: ReactNode;
}

export function HooksProvider({ children }: HooksProviderProps): JSX.Element {
  return <LoadingContextProvider>{children}</LoadingContextProvider>;
}
