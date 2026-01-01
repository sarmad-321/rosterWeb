import React from 'react';
import classNames from 'classnames';

interface DatePickerInputProps {
  field: {
    displayName?: string;
    placeholder?: string;
    defaultValue?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    jquerySelectorID?: string;
  };
  disabled?: boolean;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  field,
  disabled = false,
  onChange,
  error,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={classNames('mb-4', className)}>
      {field.displayName && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {field.displayName}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="date"
        value={field.defaultValue || ''}
        onChange={handleChange}
        disabled={disabled || field.isReadOnly}
        placeholder={field.placeholder}
        className={classNames(
          'w-full px-4 py-2.5 border rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          {
            'bg-gray-100 cursor-not-allowed': disabled || field.isReadOnly,
            'bg-white hover:border-gray-400': !disabled && !field.isReadOnly,
            'border-red-500 focus:ring-red-500': error,
            'border-gray-300': !error,
          }
        )}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default DatePickerInput;

