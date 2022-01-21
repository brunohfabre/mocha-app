import { useContext } from 'react';

import { AuthContext } from './contexts/AuthContext';
import { DefaultLayout } from './pages/layouts/Default';

import { AppRoutes } from './routes/AppRoutes';
import { AuthRoutes } from './routes/AuthRoutes';

export function Routes(): JSX.Element {
  const { isSigned } = useContext(AuthContext);

  if (isSigned) {
    return (
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
    );
  }

  return <AuthRoutes />;
}
