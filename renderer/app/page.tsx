"use client";

import React, { useState } from "react";
import TaskItem from "./components/taskItem";
import type { Task } from "./lib/types";
import { DEFAULT_TASK_SIZE, TASK_COLOR_OPTIONS } from "./lib/constants";
import { isOutside } from "./lib/taskUtils";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const addTask = (x: number, y: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content: "",
      x,
      y,
      width: DEFAULT_TASK_SIZE.width,
      height: DEFAULT_TASK_SIZE.height,
      backgroundColor: TASK_COLOR_OPTIONS[0],
      isEditing: true,
      isSelected: true,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id:string, update:Partial<Task>) => {
    setTasks((prev) => 
      prev.map((t) => (t.id === id ? { ...t, ...update } : t))
    );
  }
  const deleteTask = (id:string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const deselectAll = () => {
    setSelectedTasks([]);
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

  return (
    <div
      className="relative w-full h-screen bg-white overflow-hidden"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      ))}

      {/* {selectedTasks.length > 0 && (
      )} */}
    </div>
  )

}