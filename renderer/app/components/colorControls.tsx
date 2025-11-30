import React, { useState } from "react";
import { DEFAULT_COLOR_OPTIONS, COLOR_OPTIONS,  } from "../lib/constants";
import { RiPaintFill } from "react-icons/ri";

type ColorPickerProps = {
  currentColor: string;
  onSelect: (color: string) => void;
}

export default function ColorControls({
  currentColor,
  onSelect
} : ColorPickerProps) {
  const [paletteColors, setPaletteColors] = useState([...DEFAULT_COLOR_OPTIONS]);
  const [colorOptions, setColorOptions] = useState([...COLOR_OPTIONS]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleColorClick = (color: string, index: number) => {
    setSelectedIndex(index);
    onSelect(color);
  }

  const handleColorSelect = (newColor: string) => {
    // if(selectedIndex === null) return;
    const index = selectedIndex ?? paletteColors.indexOf(currentColor);
    if (index === -1) return;

    const newPaletteColor = paletteColors[index]

    const updatedPalette = [...paletteColors];
    updatedPalette[index] = newColor;
    
    const updatedOptions = colorOptions.map((c) => 
      c === newColor ? newPaletteColor : c
    )

    setPaletteColors(updatedPalette);
    setColorOptions(updatedOptions)

    // setColorOptions((prev) => 
    //   prev.map((color) => (color === currentColor ? newColor: color ))
    // );
    onSelect(newColor);
    setSelectedIndex(null);
    setShowOptions(false);
  }

  return (
    <div className="flex gap-3 p-1 left-1 relative">
        {paletteColors.map((color, index) => (
            <button
                key={color + index}
                onClick={() => handleColorClick(color, index)}
                className={`
                    w-5 h-5 rounded-full gap-1 relative top-1 
                    ${currentColor === color ? "border-gray-400" : "border-gray-300"}
                    ${currentColor === color ? "border-[2px]" : "border-[1px]"}
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black    
                `}
                style={{ backgroundColor: color }}
                aria-label={`select color ${color}`}
            />
        ))}

        <button 
          className="relative left-1.2 p-1 hover:bg-gray-100 rounded"
          onClick={() => setShowOptions((prev) => !prev)}
          aria-label="open color options"
          >
            <RiPaintFill size={23} />
        </button>

        {showOptions && (
        <div className="colorOptions absolute top-full left-0 mt-3 grid grid-cols-4 gap-2 p-2 border bg-white shadow-lg rounded z-20">
        {colorOptions.map((color) => (
            <button
              key={color}
              className="colorOption w-6 h-6 rounded-full cursor-pointer border border-gray-200 hover:scale-110 transition"
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
