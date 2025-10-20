"use client";

import React, { useState } from "react";
import TaskItem from "./components/taskItem";
import type { Task } from "./lib/types";
import { DEFAULT_TASK_SIZE } from "./lib/constants";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (x: number, y: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content: "",
      x,
      y,
      width: DEFAULT_TASK_SIZE.width,
      height: DEFAULT_TASK_SIZE.height,
      isEditing: true,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id:string, update:Partial<Task>) => 
    setTasks((prev) => 
      prev.map((task) => (task.id === id ? { ...task, ...update } : task))
    );

  // const handleDrag = (id:string, dx:number, dy:number) => {
  //   const task = tasks.find((t) => t.id === id);
  //   if(task) updateTask(id, {x: task.x + dx, y: task.y + dy});
  // };

  const deleteTask = (id:string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const outside = tasks.every(
      (task) => 
        x < task.x ||
        x > task.x + (task.width || DEFAULT_TASK_SIZE.width) ||
        y < task.y ||
        y > task.y + (task.height || DEFAULT_TASK_SIZE.height)
    );
    if(outside) addTask(x,y)

  };

  return (
    <div
      className="relative w-full h-screen bg-white overflow-hidden"
      onDoubleClick={handleCanvasClick}
      onClick={(e)=> e.stopPropagation()}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          // handleDrag={handleDrag}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  )

}