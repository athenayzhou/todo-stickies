import React, { useState, useRef, useEffect } from "react";
import { GoTrash } from "react-icons/go";
import { IoDuplicateOutline } from "react-icons/io5";
import ColorControls from "./colorControls";
import LayerControls from "./layerControls";
import { INACTIVE_COLOR } from "../lib/constants";

type Props = {
  x: number;
  y: number;
  onMove: (position: { x: number; y: number }) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  paletteColors: string[];
  colorOptions: string[];
  onUpdateColor: (index: number, newColor: string) =>void;
  onLayerUp: () => void;
  onLayerDown: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ToolBar({
  x,
  y,
  onMove,
  currentColor,
  onColorChange,
  paletteColors,
  colorOptions,
  onUpdateColor,
  onLayerUp,
  onLayerDown,
  onDuplicate,
  onDelete,
} : Props) {
  const [position, setPosition] = useState({x,y});
  const positionRef = useRef(position);
  const dragStart = useRef<{ x: number, y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const updatePosition = (newPos: { x: number; y: number }) => {
    positionRef.current = newPos;
    setPosition(newPos);
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    isDraggingRef.current = true;
  }
  const handleMouseMove = (e: MouseEvent) => {
    if(!isDraggingRef.current || !dragStart.current) return;
    updatePosition({
      x: e.clientX - (dragStart.current.x),
      y: e.clientY - (dragStart.current.y)
    });
  };
  const handleMouseUp = () => {
    if(!isDraggingRef.current) return;
    isDraggingRef.current = false;
    onMove(positionRef.current)
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleMouseUp)
    }
  }, [])

  return (
    <div 
      className="toolBar flex items-center gap-1 p-2 bg-white rounded-[5rem] shadow-lg absolute z-10 cursor-pointer min-w-[300px]"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={handleMouseDown}
      >
        <ColorControls
          currentColor={currentColor}
          onSelect={onColorChange}
          paletteColors={paletteColors}
          colorOptions={colorOptions}
          onUpdateColor={onUpdateColor}
        />

        <div className="w-[1px] h-5 bg-gray-300 mx-3 border-[1px] rounded" />
        
        <LayerControls
          onLayerUp={onLayerUp}
          onLayerDown={onLayerDown}
        />

        <button 
          className="duplicateButton px-1 py-1 ml-2 rounded focus:outline-none hover:bg-gray-100" 
          style={{
            color: INACTIVE_COLOR,
          }}
          onClick={onDuplicate}
          aria-label="duplicate"
        >
            <IoDuplicateOutline size={25} />
        </button>     
        <button 
          className="deleteButton px-1 py-1 ml-1 mr-2 rounded focus:outline-none hover:bg-gray-100"
          style={{
            color: INACTIVE_COLOR,
          }}
          onClick={onDelete} 
          aria-label="delete">
            <GoTrash size={25} 
            // strokeWidth={0.6} 
            />
        </button>     

    </div>
    )
}