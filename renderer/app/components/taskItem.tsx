import React, { useState, useRef, useEffect } from "react";
import type { Task } from "../lib/types";
import { ACTIVE_COLOR_PRIMARY, DEFAULT_TASK_SIZE, INACTIVE_COLOR } from "../lib/constants";
import { exceedDragThreshold, calculateDelta } from "../lib/taskUtils";
import ResizeIcon from "./resizeIcon";

type TaskItemProps = {
  task: Task;
  updateTask: (id: string, update: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export type TaskItemHandle = {
  getLatest: () => { x: number; y: number; width: number; height: number }
}

// export default function TaskItem({
//   task,
//   updateTask,
//   deleteTask
// } : TaskItemProps) {

const TaskItem = React.forwardRef<TaskItemHandle, TaskItemProps>(({
  task, updateTask, deleteTask
}, ref) => {
  const [position, setPosition] = useState({ x: task.x, y: task.y });
  const [size, setSize] = useState({ width: task.width || DEFAULT_TASK_SIZE.width, height: task.height || DEFAULT_TASK_SIZE.height });
  const [isHovering, setIsHovering] = useState(false);

  const isSelectedRef = useRef(task.isSelected);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const resizeStart = useRef<{ x: number; y: number } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if(textareaRef.current){
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length,length);
      textareaRef.current.focus();
    }
  },[]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if(task.isEditing) return;
    dragStart.current = { x:e.clientX, y:e.clientY };
    isDraggingRef.current = false;
    isResizingRef.current = false;
    e.stopPropagation();
  };

  const startResize = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    resizeStart.current = { x: e.clientX, y: e.clientY };
    isResizingRef.current = true;
    updateTask(task.id, { isSelected: true })
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (resizeStart.current && isResizingRef.current) {
      const { dx, dy } = calculateDelta(resizeStart.current, { x: e.clientX, y: e.clientY })
      setSize(prev => ({
        width: Math.max(DEFAULT_TASK_SIZE.width, prev.width + dx),
        height: Math.max(DEFAULT_TASK_SIZE.height, prev.height + dy),
      }));
      resizeStart.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!dragStart.current) return;
    const { dx, dy } = calculateDelta(dragStart.current, { x: e.clientX, y: e.clientY })
    if (!isDraggingRef.current && exceedDragThreshold(dx,dy)) {
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

  React.useImperativeHandle(ref, () => ({
    getLatest: () => ({
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height
    })
  }));

  return(
    <div
      className={`
        taskItem
        absolute pl-5 pr-4 pt-6 pb-9 rounded-lg shadow cursor-pointer select-none
        ${isDraggingRef.current ? "dragging opacity-80" : ""} 
        ${isResizingRef.current ? "resizing" : ""} 
        `}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: task.backgroundColor,
        zIndex: task.layer,
        borderWidth: task.isSelected ? 2 : 0,
        borderColor: task.isSelected ? INACTIVE_COLOR : "#F3F4F6", //hex equiv to tailwind gray-100
        boxShadow: isHovering ? "0 0 0 1px #F3F4F6" : undefined,
      }}
      onMouseDown={startDrag}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDoubleClick = {()=> updateTask(task.id, { isEditing: true, isSelected:true })}
    >
      {task.isEditing ? (
        <textarea
          ref={textareaRef}
          className="task-textarea w-full h-full bg-transparent focus:outline-none text-base resize-none"
          style={{
            fontSize: "inherit",
            overflow: "auto",
            whiteSpace: "pre-wrap"
          }}
          value={task.content}
          onChange={(e) => updateTask(task.id, {content: e.target.value })}
          onBlur={handleBlur}
          // onKeyDown={(e) => {
          //   if(e.key === 'Enter'){
          //     e.preventDefault();
          //     handleBlur();
          //   }
          // }}
        />
      ) : (
        <div
          className="w-full h-full whitespace-pre-wrap"
          style={{
            overflow: "auto",
            lineHeight: "1.5"
          }}
        >
          {task.content}
        </div>
      )}
      {isHovering && (
        <div className="absolute bottom-1 right-1 flex">
          <ResizeIcon className="resizeHandle cursor-se-resize" onMouseDown={startResize} />
          </div>
      )}
    </div>
  )
})

export default TaskItem;