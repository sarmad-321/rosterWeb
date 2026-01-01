import React from 'react';
import classNames from 'classnames';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email';
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: 'top' | 'center' | 'bottom';
  onChangeText?: (value: string) => void;
  type?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value = '',
  disabled = false,
  error,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  textAlignVertical = 'center',
  onChangeText,
  type = 'text',
  className,
  inputClassName,
  required = false,
}) => {
  const getInputType = () => {
    if (keyboardType === 'email') return 'email';
    if (keyboardType === 'numeric') return 'number';
    return type;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const inputClasses = classNames(
    'w-full px-4 py-2.5 border rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    {
      'bg-gray-100 cursor-not-allowed': disabled,
      'bg-white hover:border-gray-400': !disabled,
      'border-red-500 focus:ring-red-500': error,
      'border-gray-300': !error,
      'resize-none': multiline,
    },
    inputClassName
  );

  return (
    <div className={classNames('mb-4', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          rows={numberOfLines}
          className={inputClasses}
          style={{ textAlignVertical }}
        />
      ) : (
        <input
          type={getInputType()}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          className={inputClasses}
        />
      )}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default InputField;

