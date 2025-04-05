"use client";

import React from "react";
import { hours } from "@/utils/datetime";

export interface TimelineHeaderProps {
  timelineWidth: number;
  hourWidth: number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  timelineWidth,
  hourWidth,
}) => (
  <div
    className="timeline-header flex-grow flex"
    style={{ width: `${timelineWidth}px` }}
  >
    {hours.map((hour) => (
      <div
        key={`grid-${hour}`}
        className="hour-marker flex-shrink-0 border-r border-gray-200 text-center text-xs font-medium text-gray-500 py-2"
        style={{ width: `${hourWidth}px` }}
      >
        {`${hour.toString().padStart(2, "0")}:00`}
      </div>
    ))}
  </div>
);

export default TimelineHeader;
