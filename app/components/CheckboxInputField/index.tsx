import React from 'react';
import classNames from 'classnames';

interface CheckboxInputFieldProps {
  label?: string;
  checkboxValue: boolean;
  inputValue: string;
  onCheckboxChange: (value: boolean) => void;
  onInputChange: (value: string) => void;
  editable?: boolean;
  layoutClass?: number;
  className?: string;
}

const CheckboxInputField: React.FC<CheckboxInputFieldProps> = ({
  label,
  checkboxValue,
  inputValue,
  onCheckboxChange,
  onInputChange,
  editable = true,
  layoutClass = 12,
  className,
}) => {
  return (
    <div className={classNames('mb-4', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checkboxValue}
          onChange={(e) => onCheckboxChange(e.target.checked)}
          disabled={!editable}
          className={classNames(
            'w-5 h-5 rounded border-gray-300 text-blue-600',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
            'transition-all duration-200',
            { 'cursor-not-allowed': !editable }
          )}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={!editable}
          className={classNames(
            'flex-1 px-4 py-2.5 border rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            {
              'bg-gray-100 cursor-not-allowed': !editable,
              'bg-white hover:border-gray-400': editable,
              'border-gray-300': true,
            }
          )}
        />
      </div>
    </div>
  );
};

export default CheckboxInputField;

