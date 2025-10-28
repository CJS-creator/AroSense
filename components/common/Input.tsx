import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', containerClassName = '', ...props }) => {
  const baseStyles = "block w-full px-3 py-2 border border-border bg-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-dark sm:text-sm text-textPrimary placeholder-textSecondary transition-all duration-150 ease-in-out";
  const errorStyles = "border-danger focus:ring-danger focus:border-danger";

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-textSecondary mb-1">{label}</label>}
      <input
        id={id}
        className={`${baseStyles} ${error ? errorStyles : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};