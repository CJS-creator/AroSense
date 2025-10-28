import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, options, className = '', containerClassName = '', ...props }) => {
  const baseStyles = "block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-dark sm:text-sm text-textPrimary bg-surface transition-all duration-150 ease-in-out";
  const errorStyles = "border-danger focus:ring-danger focus:border-danger";

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-textSecondary mb-1">{label}</label>}
      <select
        id={id}
        className={`${baseStyles} ${error ? errorStyles : ''} ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};