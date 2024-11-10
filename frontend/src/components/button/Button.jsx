import React from "react";

export const Button = ({
  accentColor,
  children,
  className,
  disabled,
  ...allProps
}) => {
  return (
    <button
      className={`flex flex-row ${disabled ? "pointer-events-none" : ""
        } text-gray-950 text-sm justify-center border border-transparent bg-${accentColor}-500 px-3 py-1 rounded-md transition ease-out duration-250 hover:bg-transparent hover:shadow-${accentColor} hover:border-${accentColor}-500 hover:text-${accentColor}-500 active:scale-[0.98] ${className}`}
      disabled={disabled}
      {...allProps}
    >
      {children}
    </button>
  );
};
