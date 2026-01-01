import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

interface DropdownOption {
  code?: string;
  description?: string;
  value?: string;
  label?: string;
  [key: string]: any;
}

interface InputDropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  dropdownData?: DropdownOption[];
  dropdown?: boolean;
  ismodal?: boolean;
  error?: string;
  onPress?: () => void;
  onChange?: (item: DropdownOption) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const InputDropdown: React.FC<InputDropdownProps> = ({
  label,
  placeholder = 'Select an option',
  value = '',
  dropdownData = [],
  dropdown = false,
  ismodal = false,
  error,
  onPress,
  onChange,
  disabled = false,
  className,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    if (disabled) return;
    
    if (ismodal && onPress) {
      onPress();
    } else if (dropdown) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (item: DropdownOption) => {
    if (onChange) {
      onChange(item);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  // Ensure dropdownData is always an array
  const safeDropdownData = Array.isArray(dropdownData) ? dropdownData : [];
  
  const filteredData = safeDropdownData.filter((item) => {
    const searchValue = searchTerm.toLowerCase();
    const itemValue = (item.description || item.label || item.code || item.value || '').toLowerCase();
    return itemValue.includes(searchValue);
  });

  return (
    <div className={classNames('mb-4 relative', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        onClick={handleClick}
        className={classNames(
          'w-full px-4 py-2.5 border rounded-lg transition-all duration-200',
          'flex items-center justify-between cursor-pointer',
          {
            'bg-gray-100 cursor-not-allowed': disabled,
            'bg-white hover:border-gray-400': !disabled,
            'border-red-500': error,
            'border-gray-300': !error,
            'ring-2 ring-blue-500': isOpen,
          }
        )}
      >
        <span className={classNames(
          'text-sm',
          { 'text-gray-400': !value, 'text-gray-900': value }
        )}>
          {value || placeholder}
        </span>
        <svg
          className={classNames(
            'w-5 h-5 text-gray-400 transition-transform duration-200',
            { 'rotate-180': isOpen }
          )}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {isOpen && dropdown && dropdownData.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {item.description || item.label || item.code || item.value}
                  </p>
                  {item.code && item.description && (
                    <p className="text-xs text-gray-500 mt-0.5">Code: {item.code}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default InputDropdown;

