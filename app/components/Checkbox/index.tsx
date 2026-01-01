import React from 'react';
import classNames from 'classnames';

interface CheckboxProps {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const CheckboxComponent: React.FC<CheckboxProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
  error,
  className,
}) => {
  return (
    <div className={classNames('mb-4', className)}>
      <label className={classNames(
        'flex items-center cursor-pointer select-none',
        { 'cursor-not-allowed opacity-60': disabled }
      )}>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onValueChange(e.target.checked)}
          disabled={disabled}
          className={classNames(
            'w-5 h-5 rounded border-gray-300 text-blue-600',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
            'transition-all duration-200',
            { 'cursor-not-allowed': disabled }
          )}
        />
        {label && (
          <span className="ml-3 text-sm font-medium text-gray-700">
            {label}
          </span>
        )}
      </label>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default CheckboxComponent;

