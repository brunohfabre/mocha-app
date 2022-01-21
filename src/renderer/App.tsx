import { MemoryRouter as Router } from 'react-router-dom';
import Modal from 'react-modal';
import { loader } from '@monaco-editor/react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { AppProvider } from './contexts';

import { Routes } from './routes';

loader.init();

Modal.setAppElement('#root');

export function App() {
  return (
    <>
      <ToastContainer />

      <Router>
        <AppProvider>
          <Routes />
        </AppProvider>
      </Router>
    </>
  );
}
