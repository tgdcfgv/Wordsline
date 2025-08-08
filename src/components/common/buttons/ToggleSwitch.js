import React from 'react';

const ToggleSwitch = ({ checked, onChange, disabled = false, label, description }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        {label && (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </div>
        )}
        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </div>
        )}
      </div>
      <label className="toggle-switch ml-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-slider round"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
