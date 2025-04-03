// src/types.ts
export interface Resource {
    id: string;
    name: string;
  }
  
  export interface GanttEvent {
    id: string;
    resourceId: string;
    name: string;
    start: Date;
    end: Date;
    color?: string; // Optional color for the event bar
  }
  
  // Type for the data passed during drag operations
  export interface DragData {
    type: 'event';
    event: GanttEvent;
  }