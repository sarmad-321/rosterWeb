import React from "react";
import classNames from "classnames";

interface ClockPickerInputProps {
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
  hidelabel?: boolean;
}

const ClockPickerInput: React.FC<ClockPickerInputProps> = ({
  field,
  onChange,
  error,
  className,
  hidelabel = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={classNames("mb-4", className)}>
      {field.displayName && !hidelabel && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {field.displayName}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="time"
        value={field.defaultValue || ""}
        onChange={handleChange}
        disabled={field.isReadOnly}
        placeholder={field.placeholder}
        className={classNames(
          "w-full px-4 py-2.5 border rounded-lg transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          {
            "bg-gray-100 cursor-not-allowed": field.isReadOnly,
            "bg-white hover:border-gray-400": !field.isReadOnly,
            "border-red-500 focus:ring-red-500": error,
            "border-gray-300": !error,
          }
        )}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default ClockPickerInput;
