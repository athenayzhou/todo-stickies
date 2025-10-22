import React, { useState, useRef, useEffect } from "react";
import type { Task } from "../lib/types";
import { DEFAULT_TASK_SIZE, DRAG_THRESHOLD } from "../lib/constants";

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

  const isSelectedRef = useRef(task.isSelected);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const resizeStart = useRef<{ x: number; y: number } | null>(null);

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if(task.isEditing) return;
    dragStart.current = { x:e.clientX, y:e.clientY };
    isDraggingRef.current = false;
    isResizingRef.current = false;
    e.stopPropagation();
  };
  
  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    resizeStart.current = { x: e.clientX, y: e.clientY };
    isResizingRef.current = true;
    updateTask(task.id, { isSelected: true })
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (resizeStart.current && isResizingRef.current) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      setSize(prev => ({
        width: Math.max(DEFAULT_TASK_SIZE.width, prev.width + dx),
        height: Math.max(DEFAULT_TASK_SIZE.height, prev.height + dy),
      }));
      resizeStart.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (!isDraggingRef.current && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
      isDraggingRef.current = true;
      if(!isSelectedRef.current){
        updateTask(task.id, { isSelected:true });
        isSelectedRef.current = true;
      }
    }
    if (isDraggingRef.current) {
      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (dragStart.current && !isDraggingRef.current && !isResizingRef.current) {
      updateTask(task.id, { isSelected: !isSelectedRef.current });
    }
    if (isDraggingRef.current || isResizingRef.current) {
      updateTask(task.id, {
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
      });
    }
    isDraggingRef.current = false;
    isResizingRef.current = false;
    dragStart.current = null;
    resizeStart.current = null;
  };

  useEffect(() => {
    isSelectedRef.current = task.isSelected;
  }, [task.isSelected]);

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
      onMouseDown={startDrag}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
          <div className="resizeHandle" onMouseDown={startResize} />
          </div>
      )}
    </div>
  )
}