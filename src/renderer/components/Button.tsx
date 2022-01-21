import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  isLoading,
  disabled,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className={`px-6 bg-emerald-400 h-10 uppercase ${className}`}
      {...rest}
      disabled={isLoading || disabled}
    >
      {isLoading ? 'loading...' : children}
    </button>
  );
}
