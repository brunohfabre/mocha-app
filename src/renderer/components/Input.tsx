import { useField } from '@unform/core';
import { useEffect, useRef } from 'react';

interface Props {
  name: string;
  label?: string;
}
type InputProps = JSX.IntrinsicElements['input'] & Props;

export function Input({
  name,
  label,
  className,
  ...rest
}: InputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={fieldName} className="text-sm">
          {label}
        </label>
      )}

      <input
        id={fieldName}
        ref={inputRef}
        className="h-10 bg-pink-300 px-4 text-sm text-slate-900 placeholder:text-slate-400"
        defaultValue={defaultValue}
        {...rest}
      />

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
