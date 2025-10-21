import { Task } from "./types";

export function isOutside(e: React.MouseEvent, tasks: Task[]){
    const target = e.target as HTMLElement;
    const isInside = target.closest(".taskItem");
    return !isInside;

    // const outside = tasks.every(
    //   (task) => 
    //     x < task.x ||
    //     x > task.x + (task.width || DEFAULT_TASK_SIZE.width) ||
    //     y < task.y ||
    //     y > task.y + (task.height || DEFAULT_TASK_SIZE.height)
    // );

}