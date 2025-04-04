// components/GanttChart.tsx
'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'; // Added useEffect
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Resource, Task, DndTaskData } from '@/types/gantt';
import TaskBar from './TaskBar';

// ... (Helper functions: getStartOfDay, getEndOfDay, MS_IN_HOUR, MS_IN_DAY remain the same) ...
const getStartOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfDay = (date: Date): Date => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
};

const MS_IN_HOUR = 60 * 60 * 1000;
const MS_IN_DAY = 24 * MS_IN_HOUR;


interface GanttChartProps {
  initialResources: Resource[];
  initialTasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({ initialResources, initialTasks }) => {
  const [resources] = useState<Resource[]>(initialResources);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const todayStart = useMemo(() => getStartOfDay(new Date()), []);
  const todayEnd = useMemo(() => getEndOfDay(new Date()), []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current as DndTaskData | undefined;
    if (activeData?.type === 'task') {
      const currentTask = tasks.find(t => t.id === activeData.task.id);
      setActiveTask(currentTask || activeData.task);
      console.log("[DragStart] Task:", currentTask?.name || activeData.task.name, "ID:", active.id);
    } else {
      console.warn("[DragStart] Event without task data:", event);
    }
  };

 const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over, delta } = event;

    console.log("--- [DragEnd] START ---");
    console.log("[DragEnd] Active ID:", active.id, "Over ID:", over?.id, "Delta X:", delta?.x);

    const activeData = active.data.current as DndTaskData | undefined;
    if (!over || !activeData || activeData.type !== 'task') {
        console.log("[DragEnd] Ignored: No drop target or invalid active data.");
        console.log("--- [DragEnd] END (ignored) ---");
        return;
    }

    const draggedTaskId = active.id.toString().replace('task-', '');
    const dropZoneId = over.id.toString();

    // Get original resource ID *before* potential update
    const taskBeforeUpdate = tasks.find(t => t.id === draggedTaskId);
    const originalResourceId = taskBeforeUpdate?.resourceId;

    if (!dropZoneId.startsWith('timeline-')) {
        console.log("[DragEnd] Ignored: Dropped outside a valid timeline area:", dropZoneId);
        console.log("--- [DragEnd] END (invalid drop zone) ---");
        return;
    }
    const targetResourceId = dropZoneId.replace('timeline-', '');

    // Check for actual movement (either horizontal or change in resource row)
     if (delta.x === 0 && targetResourceId === originalResourceId) {
       console.log("[DragEnd] Ignored: No horizontal movement within the same resource row.");
       console.log("--- [DragEnd] END (no move) ---");
       return;
    }


    // --- Calculation ---
    const timelineElement = document.getElementById(dropZoneId);
    if (!timelineElement) {
        console.error("[DragEnd] CRITICAL: Could not find target timeline element:", dropZoneId);
        console.log("--- [DragEnd] END (error) ---");
        return;
    }
    const timelineRect = timelineElement.getBoundingClientRect();
    console.log("[DragEnd] Target Timeline Rect:", timelineRect);


    const originalTaskElement = document.getElementById(active.id as string);
    if (!originalTaskElement) {
        console.error("[DragEnd] CRITICAL: Could not find original task element in DOM:", active.id);
        // Attempt to proceed using state data for duration, but position will be less accurate.
         console.log("--- [DragEnd] END (error - missing task element) ---");
         // Decide if you want a fallback calculation here or just abort. Aborting is safer.
        return;
    }
    const originalTaskRect = originalTaskElement.getBoundingClientRect();
    const taskWidthPx = originalTaskRect.width;
    console.log("[DragEnd] Original Task Rect:", originalTaskRect, "Width (px):", taskWidthPx);

    // Find the original timeline element to calculate relative start pos
    const originalTimelineElement = taskBeforeUpdate ? document.getElementById(`timeline-${originalResourceId}`) : null;
     if (!originalTimelineElement) {
         console.error("[DragEnd] CRITICAL: Could not find ORIGINAL timeline element:", `timeline-${originalResourceId}`);
         console.log("--- [DragEnd] END (error - missing original timeline) ---");
         return;
     }
     const originalTimelineRect = originalTimelineElement.getBoundingClientRect();
     const originalLeftPx = originalTaskRect.left - originalTimelineRect.left; // Task start relative to *original* timeline
     console.log("[DragEnd] Original Left (px, relative to original timeline):", originalLeftPx);


    // Calculate the final intended left position relative to the *target* timeline
    const timelineOffsetDiff = originalTimelineRect.left - timelineRect.left; // Horizontal difference between timelines (usually 0)
    let newLeftPx = originalLeftPx + delta.x + timelineOffsetDiff;
    console.log("[DragEnd] Calculated New Left (px, relative to target timeline):", newLeftPx);

    // Clamp position within the target timeline bounds
    if (timelineRect.width <= 0) {
        console.error("[DragEnd] Target timeline width is zero or negative. Aborting.");
        console.log("--- [DragEnd] END (error - zero width) ---");
        return;
    }
    newLeftPx = Math.max(0, Math.min(newLeftPx, timelineRect.width - taskWidthPx));
    console.log("[DragEnd] Clamped New Left (px):", newLeftPx);

    const positionFraction = newLeftPx / timelineRect.width;
    console.log("[DragEnd] Position Fraction:", positionFraction);

    const totalTimelineMs = MS_IN_DAY;
    const newStartTimeOffsetMs = positionFraction * totalTimelineMs;
    const newStartTime = new Date(todayStart.getTime() + newStartTimeOffsetMs);

    // Snap to grid
    const snapMinutes = 15;
    const snapMs = snapMinutes * 60 * 1000;
    const snappedStartTimeMs = Math.round(newStartTime.getTime() / snapMs) * snapMs;
    const finalNewStartTime = new Date(snappedStartTimeMs);
    console.log("[DragEnd] Calculated New Start Time:", finalNewStartTime.toISOString());


    // --- State Update ---
    setTasks(currentTasks => {
        console.log("--- [setTasks] START ---");
        const taskToUpdate = currentTasks.find(task => task.id === draggedTaskId);

        if (!taskToUpdate) {
            console.error("[setTasks] CRITICAL: Task to update not found in current state:", draggedTaskId);
            return currentTasks; // Return unchanged state
        }
        console.log("[setTasks] Task found:", taskToUpdate.name, "Current Start:", taskToUpdate.startTime.toISOString());

        const durationMs = taskToUpdate.endTime.getTime() - taskToUpdate.startTime.getTime();
        if (durationMs < 0) {
             console.warn("[setTasks] Task duration is negative:", durationMs);
             // Potentially reset or clamp duration here if needed
        }
        const newEndTime = new Date(finalNewStartTime.getTime() + durationMs);
        console.log(`[setTasks] Updating task ${taskToUpdate.id}. New Start: ${finalNewStartTime.toISOString()}, New End: ${newEndTime.toISOString()}, New Resource: ${targetResourceId}`);

        const updatedTasks = currentTasks.map(task => {
            if (task.id === draggedTaskId) {
                // Create a *new object*
                return {
                    ...task,
                    startTime: finalNewStartTime,
                    endTime: newEndTime,
                    resourceId: targetResourceId,
                };
            }
            return task; // Return other tasks unmodified
        });
        console.log("--- [setTasks] RETURNING NEW STATE ---");
        return updatedTasks;
    });
    console.log("--- [DragEnd] END (update dispatched) ---");

  }, [todayStart, tasks]); // Added tasks back dependency - essential for finding taskBeforeUpdate

  // Effect to log state *after* potential update and re-render
  useEffect(() => {
     console.log("--- [Effect] Tasks state updated:", tasks.map(t => ({id: t.id, name: t.name, start: t.startTime.toISOString(), resource: t.resourceId })));
  }, [tasks]);


  // --- Rendering ---
  const hourMarkers = Array.from({ length: 24 }, (_, i) => i);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
    >
      <div className="flex flex-col border border-gray-300 font-sans text-sm">
        {/* Header Row */}
        <div className="flex sticky top-0 z-20 bg-gray-100 border-b border-gray-300">
          {/* ... header content ... */}
          <div className="w-36 flex-shrink-0 border-r border-gray-300 p-2 font-semibold text-center text-gray-700">
            Resource
          </div>
          <div className="flex-grow grid grid-cols-24 relative">
            {hourMarkers.map((hour) => ( <div key={hour} className="border-l border-gray-200 text-center p-2 text-xs text-gray-500"> {`${hour.toString().padStart(2, '0')}:00`} </div> ))}
            {hourMarkers.slice(1).map((hour) => ( <div key={`line-${hour}`} className="absolute top-0 bottom-0 border-l border-dashed border-gray-200 pointer-events-none" style={{ left: `${(hour / 24) * 100}%` }} /> ))}
          </div>
        </div>

        {/* Resource Rows */}
        <div className="flex-grow overflow-x-auto">
            {resources.map((resource) => {
                // Filter tasks for this resource *using the current tasks state*
                const resourceTasks = tasks.filter(task => task.resourceId === resource.id && task.endTime > todayStart && task.startTime < todayEnd);
                const timelineId = `timeline-${resource.id}`;
                const { setNodeRef: setTimelineDroppableRef, isOver } = useDroppable({
                    id: timelineId,
                    data: { type: 'timeline', resourceId: resource.id },
                });

                // Log which tasks are being rendered for this resource
                // console.log(`[Render] Resource ${resource.id} rendering tasks:`, resourceTasks.map(t => t.id));

                return (
                    <div key={resource.id} className="flex border-b border-gray-200 min-h-[60px]">
                        <div className="w-36 flex-shrink-0 border-r border-gray-300 p-2 flex items-center justify-start font-medium text-gray-600 bg-gray-50">
                            {resource.name}
                        </div>
                        <div
                            ref={setTimelineDroppableRef}
                            id={timelineId}
                            className={`flex-grow relative bg-white grid grid-cols-24 transition-colors duration-150 ease-in-out ${isOver ? 'bg-green-50' : ''}`}
                            style={{ minWidth: '800px' }}
                        >
                            {/* Background grid */}
                            {hourMarkers.map((hour) => ( <div key={hour} className="border-l border-gray-100 h-full pointer-events-none"></div> ))}

                            {/* Render TaskBar components */}
                            {resourceTasks.map((task) => (
                                <TaskBar
                                    key={task.id} // Stable key is crucial
                                    task={task} // Pass the task object from the current state
                                    todayStart={todayStart}
                                    timelineId={timelineId}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null} style={{ zIndex: 150 }}>
            {activeTask ? ( <TaskBar task={activeTask} todayStart={todayStart} timelineId="" isOverlay={true} /> ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default GanttChart;