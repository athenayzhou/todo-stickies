import React, { useState, useRef, useEffect } from "react";
import { GoTrash } from "react-icons/go";
import { IoDuplicateOutline } from "react-icons/io5";
import ColorControls from "./colorControls";

type Props = {
  x: number;
  y: number;
  onMove: (position: { x: number; y: number }) => void;
  currentColor: string;
  onDelete: () => void;
  onColorChange: (color: string) => void;
  onDuplicate: () => void;
}

export default function ToolBar({
  x,
  y,
  onMove,
  currentColor,
  onColorChange,
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
    if(!isDraggingRef.current) return;
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
      className="toolBar flex items-center gap-10 p-2 bg-white border rounded shadow-lg absolute z-10 cursor-pointer min-w-[300px]"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={handleMouseDown}
      >
        <ColorControls
          currentColor={currentColor}
          onSelect={onColorChange}
        />

        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button 
          className="duplicateButton px-2 py-1 border rounded hover:bg-gray-100 focus:outline-none" 
          onClick={onDuplicate}
          aria-label="duplicate"
        >
            <IoDuplicateOutline />
        </button>     
        <button 
          className="deleteButton px-2 py-1 border rounded hover:bg-gray-100 focus:outline-none" 
          onClick={onDelete} 
          aria-label="delete">
            <GoTrash />
        </button>     

    </div>
    )
}