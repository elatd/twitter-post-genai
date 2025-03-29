import React from "react";

interface DropdownProps<T> {
  label: string;
  options: T[];
  selectedOption: T | undefined;
  setSelectedOption: (value: T | undefined) => void;
}

const Dropdown = <T extends string | number>({
  label,
  options,
  selectedOption,
  setSelectedOption,
}: DropdownProps<T>) => {
  return (
    <div className="w-full flex flex-col gap-1 text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-gray-800 transition-colors duration-500 ease-in">
      <label htmlFor={label} className="block text-sm font-semibold text-gray-300">
        {label}
      </label>
      <select
        id={label}
        value={selectedOption || ''}
        onChange={(e) => {
          e.preventDefault();
          const value = e.target.value;
          setSelectedOption(value === '' ? undefined : value as T);
        }}
        className=" text-white bg-black text-sm border-2 border-gray-800 rounded-lg p-2 w-full"
      >
        <option value=""> Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
