import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type: 'button' | 'submit';
  children: string;
  isLoading?: boolean;
}

export function Button({
  type,
  children,
  className,
  isLoading,
  disabled,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={`px-6 bg-emerald-400 h-10 uppercase ${className}`}
      {...rest}
      disabled={isLoading || disabled}
    >
      {isLoading ? 'loading...' : children}
    </button>
  );
}
