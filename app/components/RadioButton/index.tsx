import React from 'react';
import classNames from 'classnames';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioButtonProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  error,
  className,
  direction = 'horizontal',
}) => {
  return (
    <div className={classNames('mb-4', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className={classNames(
        'flex gap-4',
        { 'flex-col': direction === 'vertical' }
      )}>
        {options.map((option) => (
          <label
            key={option.value}
            className={classNames(
              'flex items-center cursor-pointer select-none',
              { 'cursor-not-allowed opacity-60': disabled }
            )}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={classNames(
                'w-4 h-4 border-gray-300 text-blue-600',
                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                'transition-all duration-200',
                { 'cursor-not-allowed': disabled }
              )}
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default RadioButton;

