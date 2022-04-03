import Modal from 'react-modal';
import { MemoryRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { AppProvider } from './contexts';
import { PageTitleProvider } from './hooks/pageTitleHook';
import { Routes } from './routes';

Modal.setAppElement('#root');

export function App() {
  return (
    <PageTitleProvider>
      <ToastContainer />

      <Router>
        <AppProvider>
          <Routes />
        </AppProvider>
      </Router>
    </PageTitleProvider>
  );
}
