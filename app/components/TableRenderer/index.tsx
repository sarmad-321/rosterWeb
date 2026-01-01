import React from "react";
import classNames from "classnames";
import InputField from "../InputField";
import InputDropdown from "../InputDropdown";
import ColorPickerInput from "../ColorPickerInput";
import ClockPickerInput from "../ClockPickerInput";
import DatePickerInput from "../DatePickerInput";

interface TableColumn {
  propertyCode: string;
  columnName: string;
  displayName: string;
  fieldType: string;
  fieldDataType: string;
  isRequired?: boolean;
  placeholder?: string;
  modalID?: string;
  childModalID?: string;
  tableDataEnum?: number;
  jsonDataKeyName?: string;
  isPost?: boolean;
  fieldData?: any[];
}

interface TableRendererProps {
  tableId: string;
  tableHeaderName: string;
  columns: TableColumn[];
  data: any[];
  onChange: (data: any[]) => void;
  onModalPress?: (
    column: TableColumn,
    rowIndex: number,
    currentValue: any
  ) => void;
  isAddNewRowEnabled?: boolean;
  isDeleteRowBtnEnabled?: boolean;
  validationErrors?: { [key: string]: string };
}

const getDisplayValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.map((item) => getDisplayValue(item)).join(", ");
  }
  return value?.code || value?.description || value?.Value || value || "";
};

const TableRenderer: React.FC<TableRendererProps> = ({
  tableId,
  tableHeaderName,
  columns,
  data,
  onChange,
  onModalPress,
  isAddNewRowEnabled = true,
  isDeleteRowBtnEnabled = true,
  validationErrors = {},
}) => {
  const handleAddRow = () => {
    const newRow: any = {};
    columns.forEach((col) => {
      if (col.fieldType === "AutoIncrement") {
        newRow[col.columnName] = data.length + 1;
      } else {
        newRow[col.columnName] = "";
      }
    });
    onChange([...data, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    // Update AutoIncrement values
    const updatedData = newData.map((row, idx) => {
      const autoIncrementCol = columns.find(
        (col) => col.fieldType === "AutoIncrement"
      );
      if (autoIncrementCol) {
        return { ...row, [autoIncrementCol.columnName]: idx + 1 };
      }
      return row;
    });
    onChange(updatedData);
  };

  const handleCellChange = (
    rowIndex: number,
    columnName: string,
    value: any
  ) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [columnName]: value };
    onChange(newData);
  };

  const renderCell = (
    column: TableColumn,
    rowIndex: number,
    value: any,
    columnIndex: number
  ) => {
    const errorKey = `${tableId}_${rowIndex}_${column.columnName}`;
    const hasError = !!validationErrors[errorKey];

    // AutoIncrement - read-only counter
    if (column.fieldType === "AutoIncrement") {
      return (
        <div className="px-3 py-2 text-sm font-medium text-gray-700">
          {rowIndex + 1}
        </div>
      );
    }

    // Display - read-only text
    if (column.fieldType === "Display") {
      const previousColumn = columns[columnIndex - 1];
      const previousValue =
        previousColumn && data[rowIndex]?.[previousColumn.columnName];
      const displayValue =
        value ||
        (column.propertyCode && column.propertyCode.toLowerCase()
          ? previousValue?.[column.propertyCode.toLowerCase()]
          : "-");

      return (
        <div className="px-3 py-2 text-sm text-gray-700">{displayValue}</div>
      );
    }

    // Delete - action button
    if (column.fieldType === "Delete") {
      return (
        isDeleteRowBtnEnabled && (
          <button
            type="button"
            onClick={() => handleDeleteRow(rowIndex)}
            className="px-3 py-2 text-red-600 hover:text-red-800 font-semibold transition-colors duration-200"
          >
            ✕
          </button>
        )
      );
    }

    // Modal - opens modal for selection
    if (column.fieldType === "Modal" || column.fieldType === "ModalInput") {
      return (
        <div className="min-w-[200px]">
          <InputDropdown
            placeholder={column.placeholder || column.displayName}
            value={getDisplayValue(value).toString() || ""}
            ismodal={true}
            dropdown={false}
            error={hasError ? validationErrors[errorKey] : undefined}
            onPress={() => onModalPress?.(column, rowIndex, value)}
            className="mb-0"
          />
        </div>
      );
    }

    // SelectDropdown - inline dropdown
    if (column.fieldType === "SelectDropdown") {
      return (
        <div className="min-w-[200px]">
          <InputDropdown
            placeholder={column.placeholder || column.displayName}
            value={value?.description || value?.Value || value || ""}
            dropdownData={column.fieldData || []}
            dropdown={true}
            error={hasError ? validationErrors[errorKey] : undefined}
            onChange={(item) =>
              handleCellChange(rowIndex, column.columnName, item)
            }
            className="mb-0"
          />
        </div>
      );
    }

    // InputField - text input
    if (column.fieldType === "InputField") {
      return (
        <div className="min-w-[200px]">
          <InputField
            placeholder={column.placeholder || column.displayName}
            value={value || ""}
            error={hasError ? validationErrors[errorKey] : undefined}
            onChangeText={(text) =>
              handleCellChange(rowIndex, column.columnName, text)
            }
            className="mb-0"
          />
        </div>
      );
    }

    // ColorPicker
    if (column.fieldType === "ColorPicker") {
      return (
        <div className="min-w-[200px]">
          <ColorPickerInput
            field={{ ...column, defaultValue: value }}
            onChange={(color) =>
              handleCellChange(rowIndex, column.columnName, color)
            }
            className="mb-0"
          />
        </div>
      );
    }

    // ClockPicker
    if (column.fieldType === "ClockPicker") {
      return (
        <div className="min-w-[200px]">
          <ClockPickerInput
            field={{ ...column, defaultValue: value }}
            onChange={(time) =>
              handleCellChange(rowIndex, column.columnName, time)
            }
            hidelabel={true}
            className="mb-0"
          />
        </div>
      );
    }

    // DatePicker
    if (column.fieldType === "DatePickerSingle") {
      return (
        <div className="min-w-[200px]">
          <DatePickerInput
            field={{ ...column, defaultValue: value }}
            onChange={(date) =>
              handleCellChange(rowIndex, column.columnName, date)
            }
            className="mb-0"
          />
        </div>
      );
    }

    // Default - plain text
    return (
      <div className="px-3 py-2 text-sm text-gray-700">{value || "-"}</div>
    );
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
        <h3 className="text-base font-bold text-gray-800">{tableHeaderName}</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {col.displayName}
                  {col.isRequired && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-2">
                      {renderCell(col, rowIndex, row[col.columnName], colIndex)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No data available. Click "Add Row" to add a new entry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      {isAddNewRowEnabled && (
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleAddRow}
            className={classNames(
              "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm",
              "hover:bg-blue-700 transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
          >
            + Add Row
          </button>
        </div>
      )}
    </div>
  );
};

export default TableRenderer;
