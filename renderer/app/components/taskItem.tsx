import React, { useState, useRef, useEffect } from "react";
import type { Task } from "../lib/types";
import { DEFAULT_TASK_SIZE , TASK_COLOR_OPTIONS } from "../lib/constants";

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

  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const resizeStart = useRef<{ x: number; y: number } | null>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [showColor, setShowColor] = useState(false);

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
  const onMouseUp = () => {
    if(isDraggingRef.current || isResizingRef.current){
      updateTask(task.id, { x: position.x, y: position.y, width: size.width, height: size.height });
    };
    isDraggingRef.current = false;
    isResizingRef.current = false;
    dragStart.current = null;
    resizeStart.current = null;
  }

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  },[position, size]);

  const handleBlur = () => {
    if(!task.content.trim()) deleteTask(task.id);
    else updateTask(task.id, { isEditing: false });
  };

  return(
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        borderRadius: 4,
        border: "1px solid #ddd",
        backgroundColor: task.backgroundColor,
        cursor: task.isEditing ? "text" : isResizingRef.current ? "se-resize" : "grab",
        userSelect: "none",
        transition: "box-shadow 0.2s",
        boxShadow: isHovering? "0 2px 6px rgba(0,0,0,0.15)" : "none",
      }}
      onMouseDown={startDrag}
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
          style={{
            userSelect:"text",
            width:"100%",
            borderBottom: "1px, solid #ccc",
            fontSize: 16,
            padding: 2,
          }}
        />
      ) : (
        <p 
          onDoubleClick = {()=> updateTask(task.id, { isEditing: true })}
          style={{
            userSelect:"text",
          }}
        >
          {task.content}
        </p>
      )}

      {isHovering && (
        <div
          style={{
            position:"absolute",
            bottom: 4,
            right: 4,
            display: "flex",
            gap: 10,
            border: "2px solid #ccc"
          }}
        >
          <button
            className="delete-handle"
            onClick={() => deleteTask(task.id)}
          >
            X
          </button>
          <button
            className="color-handle"
            onClick={() => setShowColor((prev) => !prev)}
          >
            O
          </button>
          <div
            style={{
              width: "20px",
              height: "17px",
              background: "rgba(0,0,0,0.2)",
              borderRadius:"2px",
            }}
            // className="resize-handle"
            onMouseDown={startResize}
          />
          
          {showColor && (
            <div
              style={{
                position: "absolute",
                top: 24,
                right: 0,
                display: "flex",
                gap: 6,
                padding: 4,
                background:"#fff",
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            >
                {TASK_COLOR_OPTIONS.map((color) => (
                  <div 
                    key={color}
                    onClick={() => colorSelect(color)}
                    style={{
                      width:20,
                      height:20,
                      borderRadius: "50%",
                      backgroundColor: color,
                      cursor: "pointer",
                      border: "1px solid #aaa",
                    }}
                  />
                ))}
              </div>
          )}
        </div>
      )}
      
    </div>
  )

}