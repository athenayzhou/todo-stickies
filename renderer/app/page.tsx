"use client";

import React, { useState, useRef } from "react";
import ToolBar from "./components/toolBar";
import TaskItem, { TaskItemHandle } from "./components/taskItem";
import type { Task } from "./lib/types";
import { DEFAULT_TASK_SIZE, DEFAULT_COLOR_OPTIONS } from "./lib/constants";
import { isOutside } from "./lib/taskUtils";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const taskRefs = useRef<{ [id:string]: TaskItemHandle }>({})
  const [toolBarPos, setToolBarPos] = useState<{ x: number, y: number } | null>(null)

  const addTask = (x: number, y: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content: "",
      x,
      y,
      width: DEFAULT_TASK_SIZE.width,
      height: DEFAULT_TASK_SIZE.height,
      backgroundColor: DEFAULT_COLOR_OPTIONS[0],
      isEditing: true,
      isSelected: true,
    };
    setTasks((prev) => [...prev, newTask]);
    setToolBarPos({ x: x + DEFAULT_TASK_SIZE.width + 10, y })
  };

  const updateTask = (id:string, update:Partial<Task>) => {
    setTasks((prev) => 
      prev.map((t) => {
        if(t.id === id) return { ...t, ...update };
        if (update.isEditing) return { ...t, isSelected: false };
      return t;
    })
    )
  }
  const deleteTask = (id:string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const deselectAll = () => {
    setTasks((prev) => prev.map((t) => ({...t, isSelected: false})))
  }
  const handleClick = (e: React.MouseEvent) => {
    if(isOutside(e, tasks)){
      deselectAll();
    }
  }
  const handleDoubleClick = (e: React.MouseEvent) => {
    if(isOutside(e, tasks)){
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      addTask(e.clientX - rect.left, e.clientY - rect.top);
    }
  };


  const colorChangeSelected = (color: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.isSelected ? { ...t, backgroundColor: color } : t))
    );
  };
  const duplicateSelected = () => {
    const now = Date.now();
    const duplicates = selectedTasks.map((task, index) => {
      const latest = taskRefs.current[task.id]?.getLatest() ?? task;
      return {
        ...task,
        id: now + "_" + index,
        x: latest.x + 20,
        y: latest.y + 20,
        width: latest.width,
        height: latest.height,
        isSelected:true,
      }
    });
    setTasks(prev => [...prev, ...duplicates]);
  };

  const deleteSelected = () => {
    setTasks((prev) => prev.filter((t) => !t.isSelected));
  }

  const selectedTasks = tasks.filter((t) => t.isSelected);

  return (
    <div
      className="canvas relative w-full h-screen bg-white overflow-hidden"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          ref={el => {
            if(el) taskRefs.current[task.id] = el;
            else delete taskRefs.current[task.id];
          }}
          task={task}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      ))}

      {selectedTasks.length > 0 && toolBarPos && (
        <ToolBar
          x={toolBarPos.x}
          y={toolBarPos.y}
          onMove={(newPos) => setToolBarPos(newPos)}
          currentColor={selectedTasks[0].backgroundColor}
          onColorChange={colorChangeSelected}
          onDuplicate={duplicateSelected}
          onDelete={deleteSelected}
        />
      )}

    </div>
  )
}
