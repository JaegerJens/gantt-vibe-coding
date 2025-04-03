// src/components/EventBar.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GanttEvent, DragData } from '../types';

interface EventBarProps {
  event: GanttEvent;
  left: number; // Left offset in pixels
  width: number; // Width in pixels
  rowHeight: number; // To center vertically if needed
  isSelected?: boolean; // Optional: for styling during drag
}

const EventBar: React.FC<EventBarProps> = ({
  event,
  left,
  width,
  rowHeight,
  isSelected = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: {
        type: 'event',
        event: event,
    } as DragData, // Pass event data for drag handlers
  });

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${left}px`,
    width: `${width}px`,
    height: `${rowHeight * 0.6}px`, // Make bar slightly smaller than row height
    top: `${rowHeight * 0.2}px`, // Center vertically
    // Use transform for smooth dragging, but only apply when dragging
    // We handle the final position update via state changes on drag end
    transform: CSS.Translate.toString(transform),
    // Make sure dragging element appears on top
    zIndex: isDragging || isSelected ? 10 : 1,
    opacity: isDragging ? 0.8 : 1, // Make it slightly transparent when dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        ${event.color || 'bg-blue-500'}
        rounded px-2 py-0 text-white text-xs overflow-hidden
        cursor-move border border-black/30 shadow-sm
        flex items-center
        ${isSelected ? 'ring-2 ring-offset-1 ring-yellow-500' : ''}
      `}
      title={`${event.name} (${event.start.toLocaleDateString()} - ${event.end.toLocaleDateString()})`}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {event.name}
      </span>
    </div>
  );
};

export default EventBar;