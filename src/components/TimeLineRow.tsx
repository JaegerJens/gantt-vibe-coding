"use client";

// src/components/TimelineRow.tsx
import React from "react";
import { Event } from "@/types";
import EventBar from "./EventBar";
import { useDroppable } from "@dnd-kit/core";
import { totalMinutesInDay } from "@/utils/datetime";

interface TimelineRowProps {
  events: Event[];
  timelineWidth: number;
  hourWidth: number;
  personName: string;
}

const TimelineRow: React.FC<TimelineRowProps> = ({
  events,
  timelineWidth,
  hourWidth,
  personName,
}) => {
  const { setNodeRef } = useDroppable({
    id: `droppable ${personName}`,
  });
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

  return (
    <div
      className="timeline-row flex-grow relative h-12"
      style={{ width: `${timelineWidth}px` }}
    >
      {/* Background Grid Lines */}
      <div className="grid-lines absolute inset-0 flex">
        {hours.map((hour) => (
          <div
            key={`grid-${hour}`}
            className="hour-line flex-shrink-0 border-r border-gray-100 h-full"
            style={{ width: `${hourWidth}px` }}
          ></div>
        ))}
      </div>

      {/* Event Bars */}
      <div ref={setNodeRef} className="event-bars absolute inset-0">
        {events.map((event) => (
          <EventBar
            key={event.id}
            event={event}
            timelineWidth={timelineWidth}
            personName={personName}
            totalMinutesInDay={totalMinutesInDay}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineRow;
