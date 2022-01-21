import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export function LinkButton({
  children,
  className,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className={`text-emerald-400 underline ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
