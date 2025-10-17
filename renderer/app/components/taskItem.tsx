import React, { useState, useRef } from "react";
import type { Task } from "../types/task";

type TaskItemProps = {
    task: Task;
    taskDimensions: { width: number; height: number; padding: number; };
    priorityStyles: Record<Task["priority"], React.CSSProperties>;
    handleSinglePress: (id: string) => void;
    handleDoublePress: (id: string) => void;
    handleLongPress: (id: string) => void;
    handleDrag: (id: string, dx: number, dy: number) => void;
    updateTask: (id: string, update: Partial<Task>) => void;
    deleteTask: (id: string) => void;
}

export default function TaskItem({
  task,
  taskDimensions,
  priorityStyles,
  handleSinglePress,
  handleDoublePress,
  handleLongPress,
  handleDrag,
  updateTask,
  deleteTask
} : TaskItemProps) {

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if(!task.isEditing){
      dragStart.current = { x:e.clientX, y:e.clientY };
      setIsDragging(true);
      //handleSinglePress(task.id);
    }
  }
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if(isDragging && dragStart.current){
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      handleDrag(task.id, dx, dy);
      dragStart.current = { x:e.clientX, y:e.clientY };
    }
  };
  const onMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  }

  const backgroundStyle = task.completed
    ? { backgroundColor: "#d3d3d3" }
    // : priorityStyles[task.priority];
    : { backgroundColor: "#d3d3d3" }

  const handleBlur = () => {
    if(!task.content.trim()) deleteTask(task.id);
    else updateTask(task.id, { isEditing: false });
  };

  return(
    <div
      style={{
        position: "absolute",
        top: task.y,
        left: task.x,
        width: taskDimensions.width,
        padding: taskDimensions.padding,
        borderRadius: 4,
        border: "1px solid #ddd",
        backgroundColor: backgroundStyle.backgroundColor,
        cursor: task.isEditing ? "text" : "grab",
        userSelect: "none",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDoubleClick={() => handleDoublePress(task.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        // handleLongPress(task.id);
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
            width:"100%",
            borderBottom: "1px, solid #ccc",
            fontSize: 16,
            padding: 2,
          }}
        />
      ) : (
        <p 
          onDoubleClick = {()=> updateTask(task.id, { isEditing: true })}
        >
          {task.content}
        </p>
      )}
    </div>
  )

}