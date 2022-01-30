import { ReactNode } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';

interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps): JSX.Element {
  return (
    <div className="h-screen flex overflow-auto">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
        <Header />

        {children}
      </div>
    </div>
  );
}
