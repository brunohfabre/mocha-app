import ReactDOM from 'react-dom';

interface SpinProps {
  spinning: boolean;
}

export function Spin({ spinning }: SpinProps): JSX.Element {
  if (!spinning) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <div className="absolute bg-neutral-900/50 h-screen w-screen flex items-center justify-center z-50">
      <div className="w-5 h-5 rounded-full border-solid border-2 border-neutral-50/25 border-l-neutral-50 animate-spin" />
    </div>,
    document.getElementById('spin') as HTMLElement
  );
}
