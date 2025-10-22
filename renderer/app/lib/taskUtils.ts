import { Task } from "./types";

export function isOutside(e: React.MouseEvent, tasks: Task[]){
    const target = e.target as HTMLElement;
    const insideTask = target.closest(".taskItem");
    const insideToolBar = target.closest(".toolBar")
    return !insideTask && !insideToolBar;
}