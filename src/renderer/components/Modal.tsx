import { ReactNode } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  title: string;
}

export function Modal({
  isOpen,
  onRequestClose,
  children,
  title,
}: ModalProps): JSX.Element {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',

          background: '#ffffff',
          borderRadius: 0,
          border: 'none',
          padding: 32,
          width: 448,

          display: 'flex',
          flexDirection: 'column',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <div className="mb-8 flex justify-between items-start">
        <span className="text-3xl">{title}</span>

        <button type="button" className="h-6 w-6" onClick={onRequestClose}>
          X
        </button>
      </div>

      {children}
    </ReactModal>
  );
}
