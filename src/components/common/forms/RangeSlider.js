import React from 'react';

const RangeSlider = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  label, 
  description,
  options = [],
  showValue = true,
  unit = ''
}) => {
  const currentOption = options.find(opt => opt.value === value);
  const displayValue = currentOption ? currentOption.label : `${value}${unit}`;

  return (
    <div className="py-3">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </div>
          {showValue && (
            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              {displayValue}
            </div>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider w-full"
      />
      {description && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </div>
      )}
      {options.length > 0 && (
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {options.map((option, index) => (
            <span key={index}>{option.label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RangeSlider;
