// components/TaskBar.tsx
'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task, DndTaskData } from '@/types/gantt';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

interface TaskBarProps {
  task: Task;
  todayStart: Date;
  timelineId: string;
  isOverlay?: boolean;
}

const TaskBar: React.FC<TaskBarProps> = ({ task, todayStart, timelineId, isOverlay = false }) => {

  // --- Log Props Received ---
  console.log(`--- [TaskBar ${isOverlay ? 'Overlay' : 'Render'}] ---`);
  console.log(`[TaskBar] ID: ${task.id}, Name: ${task.name}`);
  console.log(`[TaskBar] Received Start: ${task.startTime.toISOString()}, End: ${task.endTime.toISOString()}`);
  console.log(`[TaskBar] Received Resource ID: ${task.resourceId}`);

  const startOffsetMs = Math.max(0, task.startTime.getTime() - todayStart.getTime());
  const endOffsetMs = Math.min(MS_IN_DAY, task.endTime.getTime() - todayStart.getTime()); // Clamp to end of today
  const durationMs = Math.max(0, endOffsetMs - startOffsetMs);

  const leftPercent = MS_IN_DAY > 0 ? (startOffsetMs / MS_IN_DAY) * 100 : 0;
  const widthPercent = MS_IN_DAY > 0 ? (durationMs / MS_IN_DAY) * 100 : 0;

  console.log(`[TaskBar] Calculated - Left (%): ${leftPercent}, Width (%): ${widthPercent}`);

  const dndData: DndTaskData = { type: 'task', task: task };
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}`, // Critical: Matches active.id in handlers
    data: dndData,
    disabled: isOverlay,
  });

  // IMPORTANT: transform from useDraggable should ONLY be applied visually during drag.
  // The final position comes from the left/width % calculated from the updated task state.
  const style = {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
    // Apply translation transform ONLY if it's the non-overlay item *being actively dragged*
    transform: CSS.Translate.toString(transform && isDragging && !isOverlay ? transform : { x: 0, y: 0, scaleX: 1, scaleY: 1 }),
    position: 'absolute' as const,
    backgroundColor: task.color && !task.color.startsWith('bg-') ? task.color : undefined,
    // Opacity is handled by className now
    zIndex: isDragging || isOverlay ? 100 : 10, // Ensure dragged/overlay is on top
    cursor: isOverlay ? 'grabbing' : (isDragging ? 'grabbing' : 'grab'), // Indicate grabbable state
    touchAction: 'none', // Recommended by dnd-kit
    // Ensure width doesn't collapse
    minWidth: '10px',
  };
  console.log(`[TaskBar] Style applied:`, style);

  const bgColorClass = task.color && task.color.startsWith('bg-') ? task.color : 'bg-blue-500'; // Default color

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const tooltipText = `${task.name}\n${formatTime(task.startTime)} - ${formatTime(task.endTime)}`;

  return (
    <div
      ref={setNodeRef} // Connects the DOM node to dnd-kit
      style={style} // Applies position, width, and drag transform
      {...listeners} // Attaches pointer/keyboard event listeners from useDraggable
      {...attributes} // Attaches ARIA attributes and roles from useDraggable
      id={`task-${task.id}`} // MUST match the ID used in useDraggable
      // Apply Tailwind classes, including background color and opacity during drag
      className={`h-8 top-1/2 -translate-y-1/2 rounded border border-gray-700 shadow-sm overflow-hidden text-xs p-1 flex items-center text-white mix-blend-difference transition-opacity duration-100 ${bgColorClass} ${isOverlay ? 'shadow-lg ring-2 ring-blue-500 !opacity-100' : ''} ${isDragging && !isOverlay ? '!opacity-30' : 'opacity-100'}`} // Use !important for opacity override during drag if needed
      title={tooltipText}
    >
      <span className="truncate pointer-events-none">{task.name}</span>
    </div>
  );
};

export default TaskBar;