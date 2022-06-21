import Modal from 'react-modal';
import { MemoryRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { AppProvider } from './contexts';
import { HooksProvider } from './hooks';
import { Routes } from './routes';

Modal.setAppElement('#root');

export function App() {
  return (
    <HooksProvider>
      <ToastContainer />

      <Router>
        <AppProvider>
          <Routes />
        </AppProvider>
      </Router>
    </HooksProvider>
  );
}
