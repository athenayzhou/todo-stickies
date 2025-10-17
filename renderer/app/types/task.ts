export type Task = {
    id: string;
    content: string;
    x: number;
    y: number;
    isEditing: boolean;
    priority: "low" | "medium" | "high";
    completed: boolean;
    height?: number
  };