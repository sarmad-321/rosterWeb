import React, { useState, useMemo } from 'react';
import classNames from 'classnames';

interface TableViewModalProps {
  tableData: any[];
  title: string;
  isMultiSelect?: boolean;
  isLoading?: boolean;
  onChange: (selectedItems: any[]) => void;
  onClose: () => void;
}

const TableViewModal: React.FC<TableViewModalProps> = ({
  tableData = [],
  title,
  isMultiSelect = false,
  isLoading = false,
  onChange,
  onClose,
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;
    
    return tableData.filter((item) => {
      const searchValue = searchTerm.toLowerCase();
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchValue)
      );
    });
  }, [tableData, searchTerm]);

  const handleSelect = (item: any) => {
    if (isMultiSelect) {
      const isSelected = selectedItems.some((selected) => selected.code === item.code);
      if (isSelected) {
        setSelectedItems(selectedItems.filter((selected) => selected.code !== item.code));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      onChange([item]);
    }
  };

  const handleConfirm = () => {
    if (isMultiSelect) {
      onChange(selectedItems);
    }
  };

  const isItemSelected = (item: any) => {
    return selectedItems.some((selected) => selected.code === item.code);
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredData.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className={classNames(
                  'px-6 py-4 cursor-pointer transition-colors duration-150',
                  'hover:bg-blue-50',
                  {
                    'bg-blue-100 hover:bg-blue-100': isItemSelected(item),
                  }
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.description || item.label || item.name || item.code || item.value}
                    </p>
                    {item.code && (
                      <p className="text-xs text-gray-500 mt-1">Code: {item.code}</p>
                    )}
                    {item.Value && item.Value !== item.description && (
                      <p className="text-xs text-gray-500 mt-1">{item.Value}</p>
                    )}
                  </div>
                  {isMultiSelect && (
                    <input
                      type="checkbox"
                      checked={isItemSelected(item)}
                      onChange={() => {}}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-gray-500 text-center">No data available</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {isMultiSelect && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-600">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className={classNames(
                'px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200',
                {
                  'hover:bg-blue-700': selectedItems.length > 0,
                  'opacity-50 cursor-not-allowed': selectedItems.length === 0,
                }
              )}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableViewModal;

