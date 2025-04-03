// src/components/GanttChart.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DragOverlay,
  closestCenter, // Or other collision detection strategy if needed
} from '@dnd-kit/core';
import { restrictToHorizontalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { GanttEvent, Resource, DragData } from '../types';
import { getDaysDifference, addDaysToDate, formatDate } from '../utils/dateUtils';
import { startOfDay, endOfDay, eachDayOfInterval, addDays } from 'date-fns';
import EventBar from './EventBar';

interface GanttChartProps {
  resources: Resource[];
  events: GanttEvent[];
  onEventsChange: (newEvents: GanttEvent[]) => void; // Callback to update events upstream
  startDate?: Date; // Optional: specific start date for timeline
  endDate?: Date;   // Optional: specific end date for timeline
}

// --- Configuration Constants ---
const ROW_HEIGHT = 40; // Height of each resource row in pixels
const DAY_WIDTH = 50;  // Width of each day column in pixels
const SIDEBAR_WIDTH = 150; // Width of the resource list sidebar
const HEADER_HEIGHT = 50; // Height of the timeline header

// --- Main Component ---
const GanttChart: React.FC<GanttChartProps> = ({
  resources,
  events: initialEvents,
  onEventsChange,
  startDate: propStartDate,
  endDate: propEndDate,
}) => {
  const [internalEvents, setInternalEvents] = useState<GanttEvent[]>(initialEvents);
  const [activeDragEvent, setActiveDragEvent] = useState<GanttEvent | null>(null);

  // Determine timeline range
  const { timelineStart, timelineEnd, totalDays } = useMemo(() => {
    if (propStartDate && propEndDate) {
      const start = startOfDay(propStartDate);
      const end = endOfDay(propEndDate);
      return {
        timelineStart: start,
        timelineEnd: end,
        totalDays: getDaysDifference(start, end) + 1, // Inclusive
      };
    }

    // Auto-calculate range based on events if props not provided
    if (internalEvents.length === 0) {
        const today = startOfDay(new Date());
      return {
        timelineStart: today,
        timelineEnd: endOfDay(addDays(today, 30)), // Default to 30 days
        totalDays: 31,
      };
    }

    let minDate = internalEvents[0].start;
    let maxDate = internalEvents[0].end;

    internalEvents.forEach(event => {
      if (event.start < minDate) minDate = event.start;
      if (event.end > maxDate) maxDate = event.end;
    });

    const start = startOfDay(addDays(minDate, -5)); // Add padding
    const end = endOfDay(addDays(maxDate, 5));    // Add padding

    return {
      timelineStart: start,
      timelineEnd: end,
      totalDays: getDaysDifference(start, end) + 1,
    };
  }, [internalEvents, propStartDate, propEndDate]);

  // Generate the array of days for the header
  const timelineDays = useMemo(() => {
    return eachDayOfInterval({ start: timelineStart, end: timelineEnd });
  }, [timelineStart, timelineEnd]);

  // --- Drag and Drop Setup ---
  const sensors = useSensors(
    useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before starting a drag
        // Prevents accidental drags when clicking
        activationConstraint: {
          distance: 10,
        },
    }),
    useSensor(TouchSensor, {
        // Press delay of 250ms, with tolerance of 5px of movement
        activationConstraint: {
          delay: 250,
          tolerance: 5,
        },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined;
    if (data?.type === 'event') {
      setActiveDragEvent(data.event);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveDragEvent(null); // Clear the active drag item
    const { active, delta } = event;
    const data = active.data.current as DragData | undefined;

    if (data?.type === 'event' && delta.x !== 0) {
        const draggedEvent = data.event;
        const daysMoved = Math.round(delta.x / DAY_WIDTH); // Calculate how many days to shift

        if (daysMoved === 0) return; // No change if move is too small

        const newEvents = internalEvents.map(ev => {
            if (ev.id === draggedEvent.id) {
                const currentDuration = getDaysDifference(ev.start, ev.end);
                const newStart = addDaysToDate(ev.start, daysMoved);
                // Ensure end date moves with start date, preserving duration
                const newEnd = addDaysToDate(newStart, currentDuration);

                // Optional: Add boundary checks if needed (e.g., cannot move before timelineStart)
                // if (newStart < timelineStart) { ... handle boundary ... }

                return { ...ev, start: newStart, end: newEnd };
            }
            return ev;
        });
        setInternalEvents(newEvents);
        onEventsChange(newEvents); // Notify parent component
    }
  }, [internalEvents, onEventsChange, DAY_WIDTH]);

  // --- Rendering Calculations ---
  const getEventPosition = useCallback((event: GanttEvent) => {
    const startOffsetDays = getDaysDifference(timelineStart, event.start);
    const durationDays = getDaysDifference(event.start, event.end);

    // Clamp duration to be at least 1 day visually
    const width = Math.max(durationDays, 1) * DAY_WIDTH;
    const left = startOffsetDays * DAY_WIDTH;

    // Handle events partially or fully outside the timeline view
    // This basic example doesn't fully clip, but calculates position based on timelineStart
    if (event.end < timelineStart || event.start > timelineEnd) {
        return { left: -9999, width: 0 }; // Effectively hide it
    }

    // Adjust if event starts before timeline
    const adjustedLeft = Math.max(left, 0);
    let adjustedWidth = width;

    // Adjust width if event starts before timeline
    if (left < 0) {
        adjustedWidth = (startOffsetDays + durationDays) * DAY_WIDTH;
    }
    // Adjust width if event ends after timeline
    if ( (left + width) > (totalDays * DAY_WIDTH) ) {
        adjustedWidth = (totalDays - startOffsetDays) * DAY_WIDTH;
    }


    return {
      left: adjustedLeft,
      width: Math.max(adjustedWidth, DAY_WIDTH / 2) // Ensure minimum visual width
    };
  }, [timelineStart, timelineEnd, totalDays, DAY_WIDTH]);

  const totalTimelineWidth = totalDays * DAY_WIDTH;
  const totalHeight = HEADER_HEIGHT + resources.length * ROW_HEIGHT;

  return (
    <DndContext
        sensors={sensors}
        collisionDetection={closestCenter} // Basic strategy, adjust if needed
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // Only allow horizontal movement
        modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
    >
      <div className="flex w-full overflow-x-auto relative border border-gray-300 bg-white">
        {/* --- Sidebar (Resource List) --- */}
        <div
          className="sticky left-0 z-20 border-r border-gray-300 bg-gray-100"
          style={{ width: `${SIDEBAR_WIDTH}px`, height: `${totalHeight}px` }}
        >
          {/* Sidebar Header */}
          <div
            className="flex items-center justify-center font-semibold border-b border-gray-300 text-sm text-gray-700"
            style={{ height: `${HEADER_HEIGHT}px` }}
          >
            Resources
          </div>
          {/* Resource Names */}
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center pl-3 border-b border-gray-200 text-sm text-gray-800 truncate"
              style={{ height: `${ROW_HEIGHT}px` }}
              title={resource.name}
            >
              {resource.name}
            </div>
          ))}
        </div>

        {/* --- Timeline Area --- */}
        <div className="relative" style={{ minWidth: `${totalTimelineWidth}px` }}>
          {/* Timeline Header */}
          <div
            className="sticky top-0 z-10 flex bg-gray-100 border-b border-gray-300"
            style={{ height: `${HEADER_HEIGHT}px`, width: `${totalTimelineWidth}px` }}
          >
            {timelineDays.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center border-r border-gray-200 text-xs font-medium text-gray-600"
                style={{ minWidth: `${DAY_WIDTH}px`, width: `${DAY_WIDTH}px` }}
              >
                <span>{formatDate(day, 'MMM d')}</span>
                {/* Optional: Add day of week */}
                {/* <span className="text-gray-500">{formatDate(day, 'EEE')}</span> */}
              </div>
            ))}
          </div>

          {/* Timeline Grid and Events */}
          <div className="relative" style={{ height: `${resources.length * ROW_HEIGHT}px`, width: `${totalTimelineWidth}px` }}>
            {/* Horizontal Grid Lines */}
            {resources.map((_, index) => (
              <div
                key={`h-line-${index}`}
                className="absolute left-0 right-0 border-b border-gray-200"
                style={{ top: `${(index + 1) * ROW_HEIGHT}px`, zIndex: 0 }}
              />
            ))}
            {/* Vertical Grid Lines */}
            {timelineDays.map((_, index) => (
              <div
                key={`v-line-${index}`}
                className="absolute top-0 bottom-0 border-r border-gray-200"
                style={{ left: `${(index + 1) * DAY_WIDTH}px`, zIndex: 0 }}
              />
            ))}

            {/* Event Bars per Resource */}
            {resources.map((resource, resourceIndex) => (
              <div
                key={resource.id}
                className="absolute"
                style={{
                    top: `${resourceIndex * ROW_HEIGHT}px`,
                    height: `${ROW_HEIGHT}px`,
                    width: '100%' // Takes full timeline width for positioning context
                }}
              >
                {internalEvents
                  .filter(event => event.resourceId === resource.id)
                  .map((event) => {
                    const { left, width } = getEventPosition(event);
                     // Don't render if completely outside calculated view
                     if (width <= 0) return null;

                     // Render only if NOT currently being dragged via DragOverlay
                     if (activeDragEvent?.id === event.id) return null;

                    return (
                      <EventBar
                        key={event.id}
                        event={event}
                        left={left}
                        width={width}
                        rowHeight={ROW_HEIGHT}
                      />
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* Drag Overlay: Renders a copy of the event while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeDragEvent ? (
            // Find the resource index for positioning the overlay correctly
            (()=>{ // IIFE to calculate position cleanly
                const resourceIndex = resources.findIndex(r => r.id === activeDragEvent.resourceId);
                const { left, width } = getEventPosition(activeDragEvent);
                 if (width <= 0 || resourceIndex < 0) return null; // Don't render overlay if event is outside or resource not found

                // We need to offset the overlay position based on the scroll container
                // This is a simplification. A robust solution might need `getBoundingClientRect`
                // of the timeline grid area if the chart itself scrolls within the page.
                // For now, assume parent scroll handles positioning correctly relative to viewport.
                const top = HEADER_HEIGHT + resourceIndex * ROW_HEIGHT;

                return (
                    <div style={{
                        // Position relative to the DndContext container
                        position: 'absolute',
                        top: `${top}px`,
                        left: `${SIDEBAR_WIDTH}px`, // Account for sidebar width
                    }}>
                         <EventBar
                            event={activeDragEvent}
                            left={left}
                            width={width}
                            rowHeight={ROW_HEIGHT}
                            isSelected={true} // Style as selected/dragging
                          />
                    </div>
                );
            })()
        ) : null}
      </DragOverlay>

    </DndContext>
  );
};

export default GanttChart;