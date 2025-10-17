"use client";

import React, { useState } from "react";
import TaskItem from "./components/taskItem";
import type { Task } from "./types/task";
import { togglePriority } from "./utils/taskUtils";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const taskDimensions = { width: 250, height: 50, padding: 10 };

  const priorityStyles: Record<Task["priority"], React.CSSProperties> = {
    low: { backgroundColor: "#d4f7d4" },
    medium: { backgroundColor: "#ffe599" },
    high: { backgroundColor: "#f7d4d4" }
  };

  const addTask = (x:number, y:number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content: "",
      x,
      y,
      isEditing: true,
      priority: "low",
      completed: false,
      height: taskDimensions.height,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id:string, update:Partial<Task>) => 
    setTasks((prev) => 
      prev.map((task) => (task.id === id ? { ...task, ...update } : task))
    );

  const handleDrag = (id:string, dx:number, dy:number) => {
    const task = tasks.find((t) => t.id === id);
    if(task) updateTask(id, {x: task.x + dx, y: task.y + dy});
  };

  const deleteTask = (id:string) =>
    setTasks((prev) => prev.filter((task) => task.id !== id));

  const handleSinglePress = (id:string) => {};
  const handleDoublePress = (id:string) => {
    // const task = tasks.find((t) => t.id === id);
    // if(task) updateTask(id, {priority: togglePriority(task.priority)})
  }
  const handleLongPress = (id:string) => {

  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const outside = tasks.every(
      (task) => 
        x < task.x ||
        x > task.x + taskDimensions.width + taskDimensions.padding ||
        y < task.y ||
        y > task.y + (task.height + taskDimensions.padding || taskDimensions.height + taskDimensions.padding)
    );
    if(outside) addTask(x,y)

    const clickedTask = tasks.find(
      (task) =>
        x >= task.x &&
        x <= task.x + taskDimensions.width &&
        y >= task.y &&
        y <= task.y + (task.height || taskDimensions.height)
    );
    // if(clickedTask){
    //   updateTask(clickedTask.id, {isEditing:true});
    //   setEditingId(clickedTask.id)
    // }

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
          taskDimensions={taskDimensions}
          priorityStyles={priorityStyles}
          handleSinglePress={handleSinglePress}
          handleDoublePress={handleDoublePress}
          handleLongPress={handleLongPress}
          handleDrag={handleDrag}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  )

}