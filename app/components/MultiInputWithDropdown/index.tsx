import React, { useState } from 'react';
import classNames from 'classnames';

interface DropdownOption {
  code?: string;
  description?: string;
  value?: string;
  label?: string;
  [key: string]: any;
}

interface MultiInputWithDropdownProps {
  label?: string;
  placeholder?: string;
  value?: any[];
  error?: string;
  editable?: boolean;
  childJsonDataKeyName?: string;
  dropdownData?: DropdownOption[];
  dropdownTitle?: string;
  onChange: (values: any[]) => void;
  onDropdownPress?: () => Promise<DropdownOption[]> | void;
  className?: string;
}

const MultiInputWithDropdown: React.FC<MultiInputWithDropdownProps> = ({
  label,
  placeholder = 'Enter value',
  value = [],
  error,
  editable = true,
  childJsonDataKeyName,
  dropdownData = [],
  dropdownTitle = 'Select',
  onChange,
  onDropdownPress,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<DropdownOption | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [localDropdownData, setLocalDropdownData] = useState(dropdownData);

  const handleDropdownClick = async () => {
    if (onDropdownPress) {
      const data = await onDropdownPress();
      if (data) {
        setLocalDropdownData(data);
      }
    }
    setShowDropdown(!showDropdown);
  };

  const handleAdd = () => {
    if (inputValue.trim() && selectedDropdownValue) {
      const newItem: any = {
        [childJsonDataKeyName || 'value']: inputValue.trim(),
        ...selectedDropdownValue,
      };
      onChange([...value, newItem]);
      setInputValue('');
      setSelectedDropdownValue(null);
    }
  };

  const handleRemove = (index: number) => {
    const newValues = value.filter((_, i) => i !== index);
    onChange(newValues);
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
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
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
        
        <div className="relative">
          <button
            type="button"
            onClick={handleDropdownClick}
            disabled={!editable}
            className={classNames(
              'px-4 py-2.5 border border-gray-300 rounded-lg',
              'bg-white hover:bg-gray-50 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              { 'opacity-50 cursor-not-allowed': !editable }
            )}
          >
            {selectedDropdownValue?.description || selectedDropdownValue?.label || dropdownTitle}
          </button>
          
          {showDropdown && (
            <div className="absolute z-50 right-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {localDropdownData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDropdownValue(item);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {item.description || item.label || item.code}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleAdd}
          disabled={!editable || !inputValue.trim() || !selectedDropdownValue}
          className={classNames(
            'px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium',
            'hover:bg-blue-700 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            {
              'opacity-50 cursor-not-allowed': !editable || !inputValue.trim() || !selectedDropdownValue,
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
              <span className="text-sm text-gray-700">
                {item[childJsonDataKeyName || 'value']} - {item.description || item.label}
              </span>
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

export default MultiInputWithDropdown;

