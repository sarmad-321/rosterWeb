import React from 'react';
import classNames from 'classnames';

interface ColorPickerInputProps {
  field: {
    displayName?: string;
    placeholder?: string;
    defaultValue?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    jquerySelectorID?: string;
  };
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  field,
  onChange,
  error,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store color without # prefix to match mobile app behavior
    const color = e.target.value.replace('#', '');
    onChange(color);
  };

  // Ensure color has # prefix for input
  const colorValue = field.defaultValue 
    ? field.defaultValue.startsWith('#') 
      ? field.defaultValue 
      : `#${field.defaultValue}`
    : '#000000';

  return (
    <div className={classNames('mb-4', className)}>
      {field.displayName && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {field.displayName}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={colorValue}
          onChange={handleChange}
          disabled={field.isReadOnly}
          className={classNames(
            'h-11 w-20 rounded-lg border cursor-pointer transition-all duration-200',
            {
              'cursor-not-allowed opacity-60': field.isReadOnly,
              'border-red-500': error,
              'border-gray-300': !error,
            }
          )}
        />
        <input
          type="text"
          value={field.defaultValue || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={field.isReadOnly}
          placeholder={field.placeholder || 'Enter color code'}
          className={classNames(
            'flex-1 px-4 py-2.5 border rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            {
              'bg-gray-100 cursor-not-allowed': field.isReadOnly,
              'bg-white hover:border-gray-400': !field.isReadOnly,
              'border-red-500 focus:ring-red-500': error,
              'border-gray-300': !error,
            }
          )}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default ColorPickerInput;

