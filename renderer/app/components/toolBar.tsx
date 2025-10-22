import React, { useState } from "react";
import { TASK_COLOR_OPTIONS } from "../lib/constants";
import { TiDelete } from "react-icons/ti";

type Props = {
  onDelete: () => void;
  onColorChange: (color: string) => void;
  currentColor: string;
}

export default function ToolBar({
  onDelete,
  onColorChange,
  currentColor,
} : Props) {
  const [showColor, setShowColor] = useState(false);

  return (
    <div className="toolBar flex gap-2 bg-white border rounded shadow p-1 absolute z-10">
        <button className="deleteButton" onClick={onDelete}>
            <TiDelete />
        </button>        
          
        <button onClick={() => setShowColor((prev) => !prev)}>
            <div
              className="colorHandle w-5 h-5 rounded"
              style={{ backgroundColor: currentColor }}
              />
        </button>

        {showColor && (
        <div className="colorOptions flex gap-1 p-1 border bg-white absolute top-full left-0">
        {TASK_COLOR_OPTIONS.map((color) => (
            <div
              key={color}
              className="colorOption w-5 h-5 rounded cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorChange(color)
                setShowColor(false)
              }}
            />
        ))}
        </div>
        )}

    </div>
    )
}