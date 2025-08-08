import React from 'react';

const SelectField = ({ 
  value, 
  onChange, 
  options = [], 
  label, 
  description,
  placeholder = "请选择",
  className = ""
}) => {
  return (
    <div className={`py-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="py-2">
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </div>
      )}
    </div>
  );
};

export default SelectField;
