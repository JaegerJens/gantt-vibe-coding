// types/gantt.ts
export interface Resource {
    id: string;
    name: string;
  }
  
  export interface Task {
    id: string; // Unique task ID
    resourceId: string; // ID of the resource it belongs to
    name: string;
    startTime: Date;
    endTime: Date;
    color?: string; // Optional color for the task bar
  }
  
  // Type for the data passed around during drag operations
  export interface DndTaskData {
    type: 'task';
    task: Task;
  }
  