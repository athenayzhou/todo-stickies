import { Task } from "./types";
import { DRAG_THRESHOLD } from "./constants";

export function isOutside(e: React.MouseEvent, tasks: Task[]){
    const target = e.target as HTMLElement;
    const insideTask = target.closest(".taskItem");
    const insideToolBar = target.closest(".toolBar")
    return !insideTask && !insideToolBar;
}

export function exceedDragThreshold(dx: number, dy: number, threshold = DRAG_THRESHOLD){
    return Math.sqrt(dx * dx + dy * dy) > threshold;
}

export function calculateDelta(start: { x: number, y: number }, current: { x: number, y: number }){
    return { dx: current.x - start.x, dy: current.y - start.y }
}


