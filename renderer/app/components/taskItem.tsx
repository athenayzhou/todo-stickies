import React, { useState, useRef, useEffect } from "react";
import type { Task } from "../lib/types";
import { DEFAULT_TASK_SIZE , TASK_COLOR_OPTIONS } from "../lib/constants";

import { TiDelete } from "react-icons/ti"; 

type TaskItemProps = {
    task: Task;
    updateTask: (id: string, update: Partial<Task>) => void;
    deleteTask: (id: string) => void;
}

export default function TaskItem({
  task,
  updateTask,
  deleteTask
} : TaskItemProps) {
  const [position, setPosition] = useState({ x: task.x, y: task.y });
  const [size, setSize] = useState({ width: task.width || DEFAULT_TASK_SIZE.width, height: task.height || DEFAULT_TASK_SIZE.height });

  const [isHovering, setIsHovering] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const resizeStart = useRef<{ x: number; y: number } | null>(null);

  const colorSelect = (color: string) => {
    updateTask(task.id, { backgroundColor: color });
    setShowColor(false);
  }

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if(!task.isEditing){
      dragStart.current = { x:e.clientX, y:e.clientY };
      isDraggingRef.current = true;
      e.stopPropagation();
    }
  };
  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    resizeStart.current = { x: e.clientX, y: e.clientY };
    isResizingRef.current = true;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startDrag(e)
    if( (isDraggingRef.current || isResizingRef.current )){
      updateTask(task.id, { isSelected: true });
    } else {
      if(task.isSelected) updateTask(task.id, { isSelected: false})
      else updateTask(task.id, { isSelected: true})
    }
  }
  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    if(isDraggingRef.current && dragStart.current){
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition(prev => ({ 
        x: prev.x + dx, 
        y: prev.y + dy,
      }));
      dragStart.current = { x:e.clientX, y:e.clientY };

    } else if (isResizingRef.current && resizeStart.current) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      setSize(prev => ({
        width: Math.max(DEFAULT_TASK_SIZE.width, prev.width + dx),
        height: Math.max(DEFAULT_TASK_SIZE.height, prev.height + dy),
      }));
      resizeStart.current = { x: e.clientX, y: e.clientY };
    }
  };
  const onMouseUp = (e: MouseEvent) => {
    if((e.target as HTMLElement).closest('.controls')) return;
    if(isDraggingRef.current || isResizingRef.current){
      updateTask(task.id, { x: position.x, y: position.y, width: size.width, height: size.height });
    } 

    // if(isDraggingRef.current || isResizingRef.current){
    //   if(!isSelected) updateTask(task.id, { isSelected: true })
    //   updateTask(task.id, { x: position.x, y: position.y, width: size.width, height: size.height})
    //   } else {
    //     setIsSelected(prev => !prev)
    //   }
    

    isDraggingRef.current = false;
    isResizingRef.current = false;
    dragStart.current = null;
    resizeStart.current = null;
  }

  useEffect(() => {
    const handleMove = (e: MouseEvent) => onMouseMove(e);
    const handleUp = (e: MouseEvent) => onMouseUp(e);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  },[]);

  const handleBlur = () => {
    if(!task.content.trim()){
      deleteTask(task.id);
    } else {
      updateTask(task.id, { isEditing: false, isSelected: false });
    }
  };

  return(
    <div
      className={`taskItem ${isDraggingRef.current ? "dragging" : ""} ${isResizingRef.current ? "resizing" : ""} ${isHovering ? "hovering" : ""} ${task.isSelected ? "selecting" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: task.backgroundColor,
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowColor(false);
      }}
    >
      {task.isEditing ? (
        <input
          type="text"
          autoFocus
          value={task.content}
          onChange={(e) => updateTask(task.id, {content: e.target.value })}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if(e.key === 'Enter'){
              e.preventDefault();
              handleBlur();
            }
          }}
        />
      ) : (
        <p onDoubleClick = {()=> updateTask(task.id, { isEditing: true, isSelected:true })}>
          {task.content}
        </p>
      )}

      {isHovering && (
        <div className="controls">
          <button
            // className="deleteHandle"
            onClick={() => deleteTask(task.id)}
          >
            <TiDelete />
          </button>
          <button
            // className="colorHandle"
            onClick={() => setShowColor((prev) => !prev)}
          >
            <div
              className="colorHandle"
              style={{
                backgroundColor: task.backgroundColor,
              }}
              />
          </button>
          <div className="resizeHandle" onMouseDown={startResize} />
          
          {showColor && (
            <div className="colorOptions" >
                {TASK_COLOR_OPTIONS.map((color) => (
                  <div
                    key={color}  
                    className="colorOption"
                    style={{
                      backgroundColor: color,
                    }}
                    onClick={() => colorSelect(color)} 
                  />
                ))}
              </div>
          )}
        </div>
      )}
      
    </div>
  )

}