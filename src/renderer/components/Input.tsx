import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps): JSX.Element {
  return (
    <input
      {...rest}
      className={`h-10 bg-pink-400 px-4 placeholder:text-slate-900 ${className}`}
    />
  );
}
