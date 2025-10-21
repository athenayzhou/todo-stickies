export type Task = {
    id: string;
    content: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    backgroundColor: string;
    isEditing: boolean;
    isSelected: boolean;
    // only?: boolean;
  };