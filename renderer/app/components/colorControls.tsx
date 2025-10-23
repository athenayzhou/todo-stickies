import React, { useState } from "react";
import { DEFAULT_COLOR_OPTIONS, COLOR_OPTIONS,  } from "../lib/constants";
import { CgColorPicker } from "react-icons/cg";

type ColorPickerProps = {
  currentColor: string;
  onSelect: (color: string) => void;
}

export default function colorControls({
  currentColor,
  onSelect
} : ColorPickerProps) {
  const [colorOptions, setColorOptions] = useState(DEFAULT_COLOR_OPTIONS);
  const [showOptions, setShowOptions] = useState(false);

  const handleColorSelect = (newColor: string) => {
    setColorOptions((prev) => 
      prev.map((color) => (color === currentColor ? newColor: color ))
    );
    onSelect(newColor);
    setShowOptions(false);
  }

  return (
    <div className="flex gap-10 relative">
        {colorOptions.map((color) => (
            <button
                key={color}
                onClick={() => onSelect(color)}
                className={`
                    w-7 h-7 rounded-full border-2 gap-8
                    ${currentColor === color ? "border-black" : "border-transparent"}
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black    
                `}
                style={{ backgroundColor: color }}
                aria-label={`select color ${color}`}
            />
        ))}

        <button 
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setShowOptions((prev) => !prev)}
          aria-label="open color options"
          >
            <CgColorPicker />
        </button>

        {showOptions && (
        <div className="colorOptions absolute top-full left-0 mt-1 flex flex-wrap gap-1 p-2 border bg-white shadow-lg rounded z-20">
        {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              className="colorOption w-5 h-5 rounded cursor-pointer border border-gray-200 hover:scale 110 transition"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              aria-label={`select color ${color}`}
            />
        ))}
        </div>
        )}

    </div>
  )
}
