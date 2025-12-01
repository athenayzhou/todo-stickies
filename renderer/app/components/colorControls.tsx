import React, { useState } from "react";
import { DEFAULT_COLOR_OPTIONS, COLOR_OPTIONS, ACTIVE_COLOR_PRIMARY, ACTIVE_COLOR_SECONDARY, INACTIVE_COLOR  } from "../lib/constants";
import { RiPaintFill } from "react-icons/ri";

type ColorPickerProps = {
  currentColor: string;
  onSelect: (color: string) => void;
  paletteColors: string[];
  colorOptions: string[];
  onUpdateColor: (index:number, newColor:string) => void;
}

export default function ColorControls({
  currentColor,
  onSelect,
  paletteColors,
  colorOptions,
  onUpdateColor,
} : ColorPickerProps) {
  // const [paletteColors, setPaletteColors] = useState([...DEFAULT_COLOR_OPTIONS]);
  // const [colorOptions, setColorOptions] = useState([...COLOR_OPTIONS]);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hover, setHover] = useState(false);

  const handleColorClick = (color: string, index: number) => {
    setSelectedIndex(index);
    onSelect(color);
  }

  const handleColorSelect = (newColor: string) => {
    const index = selectedIndex ?? paletteColors.indexOf(currentColor);
    if (index === -1) return;

  //moved to page.tsx to handle so it persists
    // const newPaletteColor = paletteColors[index]
    // const updatedPalette = [...paletteColors];
    // updatedPalette[index] = newColor;
    // const updatedOptions = colorOptions.map((c) => 
    //   c === newColor ? newPaletteColor : c
    // )
    // setPaletteColors(updatedPalette);
    // setColorOptions(updatedOptions)
    onUpdateColor(index, newColor);

    onSelect(newColor);
    setSelectedIndex(null);
    setShowColorOptions(false);
  }

  return (
    <div className="flex gap-4 p-1 left-1 relative">
        {paletteColors.map((color, index) => (
            <button
                key={color + index}
                onClick={() => handleColorClick(color, index)}
                className={`
                    w-6 h-6 rounded-full gap-1 relative top-1 
                    border
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black    
                `}
                style={{ 
                  backgroundColor: color,
                  borderColor: currentColor === color ? INACTIVE_COLOR : "#d1d5db",
                  borderWidth: currentColor === color ? 2 : 1,
                }}
                aria-label={`select color ${color}`}
            />
        ))}

        <button 
          className="relative left-1.2 px-1 p-1 rounded transition-colors"
          style={{
            backgroundColor: showColorOptions 
            ? ACTIVE_COLOR_SECONDARY 
            : hover
            ? "#F3F4F6" //hex equiv to tailwind gray-100
            : "#ffffff",
            color: showColorOptions ? ACTIVE_COLOR_PRIMARY : INACTIVE_COLOR,
          }}
          onMouseEnter={()=>setHover(true)}
          onMouseLeave={()=>setHover(false)}
          onClick={() => setShowColorOptions((prev) => !prev)}
          aria-label="open color options"
          >
            <RiPaintFill size={25} />
        </button>

        {showColorOptions && (
        <div className="colorOptions absolute top-full left-[-10px] w-56 mt-3 grid grid-cols-4 gap-y-3 gap-x-8 px-7 py-6 bg-white shadow-lg rounded-3xl z-20">
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
