"use client";

import { Event } from "@/types";
import { timeToMinutes } from "@/utils/datetime";
import { useDraggable } from "@dnd-kit/core";

export interface EventBarProps {
  event: Event;
  timelineWidth: number;
  totalMinutesInDay: number;
  personName: string;
}

const EventBar: React.FC<EventBarProps> = ({
  event,
  timelineWidth,
  totalMinutesInDay,
  personName,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  });
  const startMinutes = timeToMinutes(event.startTime);
  const endMinutes = timeToMinutes(event.endTime);
  const durationMinutes = Math.max(0, endMinutes - startMinutes);
  const leftPx = (startMinutes / totalMinutesInDay) * timelineWidth;
  const widthPx = (durationMinutes / totalMinutesInDay) * timelineWidth;
  const style = {
    left: `${leftPx}px`,
    width: `${widthPx}px`,
    minWidth: "1px",
    maxWidth: `calc(100% - ${leftPx}px)`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const bgColor = event.color || "bg-blue-500";

  return (
    <div
      key={event.id}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`event-bar absolute top-1 bottom-1 rounded flex items-center px-2 text-white text-xs font-medium overflow-hidden whitespace-nowrap ${bgColor}`}
      title={`${personName}: ${event.title} (${event.startTime} - ${event.endTime})`}
    >
      <span className="truncate">{event.title}</span>
    </div>
  );
};

export default EventBar;
