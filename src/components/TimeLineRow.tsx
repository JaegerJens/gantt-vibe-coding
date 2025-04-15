"use client";

import React from "react";
import { Event, Person } from "@/types";
import EventBar from "./EventBar";
import { useDroppable } from "@dnd-kit/core";
import { hours, totalMinutesInDay } from "@/utils/datetime";
import { areArraysEqual } from "@/utils/array";
import { areEventsEqual } from "@/utils/scheduler";

interface TimelineRowProps {
  events: Event[];
  timelineWidth: number;
  hourWidth: number;
  person: Person;
}

const areTimelinePropsEqual = (
  prev: Readonly<TimelineRowProps>,
  next: Readonly<TimelineRowProps>,
): boolean =>
  prev.person.id === next.person.id &&
  areArraysEqual(prev.events, next.events, areEventsEqual) &&
  prev.timelineWidth === next.timelineWidth &&
  prev.hourWidth === next.hourWidth;

const TimelineRow = React.memo(function TimelineRow({
  events,
  timelineWidth,
  hourWidth,
  person,
}) {
  const { setNodeRef } = useDroppable({
    id: person.id,
  });

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
            personName={person.name}
            totalMinutesInDay={totalMinutesInDay}
          />
        ))}
      </div>
    </div>
  );
}, areTimelinePropsEqual);

export default TimelineRow;
