import React, { useState } from 'react';
import classNames from 'classnames';

interface MultiInputFieldProps {
  label?: string;
  placeholder?: string;
  value?: string[];
  error?: string;
  keyboardType?: 'default' | 'numeric';
  editable?: boolean;
  onChange: (values: string[]) => void;
  className?: string;
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({
  label,
  placeholder = 'Add item',
  value = [],
  error,
  keyboardType = 'default',
  editable = true,
  onChange,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    const newValues = value.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={classNames('mb-4', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <input
          type={keyboardType === 'numeric' ? 'number' : 'text'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={!editable}
          className={classNames(
            'flex-1 px-4 py-2.5 border rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            {
              'bg-gray-100 cursor-not-allowed': !editable,
              'bg-white hover:border-gray-400': editable,
              'border-red-500 focus:ring-red-500': error,
              'border-gray-300': !error,
            }
          )}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!editable || !inputValue.trim()}
          className={classNames(
            'px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium',
            'hover:bg-blue-700 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            {
              'opacity-50 cursor-not-allowed': !editable || !inputValue.trim(),
            }
          )}
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <span className="text-sm text-gray-700">{item}</span>
              {editable && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default MultiInputField;

