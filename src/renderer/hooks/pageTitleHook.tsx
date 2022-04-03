import { createContext, ReactNode, useContext, useState } from 'react';

type PageTitleContextData = {
  title: string;
  replaceTitle: (data: string) => void;
  addToTitle: (data: string) => void;
};

const PageTitleContext = createContext({} as PageTitleContextData);

type PageTitleProviderProps = {
  children: ReactNode;
};

export function PageTitleProvider({
  children,
}: PageTitleProviderProps): JSX.Element {
  const [title, setTitle] = useState('');

  function replaceTitle(data: string) {
    setTitle(data);
  }

  function addToTitle(data: string) {
    setTitle((prevState) => `${prevState} - ${data}`);
  }

  return (
    <PageTitleContext.Provider value={{ title, replaceTitle, addToTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle(): PageTitleContextData {
  const context = useContext(PageTitleContext);

  if (!context) {
    throw new Error('usePageHeader must be used within a PageHeaderProvider');
  }

  return context;
}
