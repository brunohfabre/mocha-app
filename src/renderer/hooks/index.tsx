import { ReactNode } from 'react';

import { LoadingProvider } from './loadingHook';
import { PageTitleProvider } from './pageTitleHook';

type HooksProviderProps = {
  children: ReactNode;
};

export function HooksProvider({ children }: HooksProviderProps): JSX.Element {
  return (
    <LoadingProvider>
      <PageTitleProvider>{children}</PageTitleProvider>
    </LoadingProvider>
  );
}
