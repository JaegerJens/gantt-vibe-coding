"use client";

import React from "react";
import TimelineRow from "./TimeLineRow";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { hours } from "@/utils/datetime";
import { moveEvent } from "@/data/EventsData";
import { Id, ScheduleData } from "@/types";
import TimelineHeader from "./TimeLineHeader";
import EventStore from "@/data/EventStore";

// Define name column width consistently (Tailwind: w-36=9rem, w-48=12rem)
// Using rem or px ensures consistency if you adjust root font-size later
const nameColWidthClass = "w-36 lg:w-48";
const nameColMinWidth = "9rem"; // Or 144px for w-36

const extractTargetPersonId = (dndEvent: DragEndEvent): Id | undefined =>
  Array.isArray(dndEvent.collisions) && dndEvent.collisions.length > 0
    ? (dndEvent.collisions[0].id as string)
    : undefined;

interface GanttChartProps {
  hourWidth?: number; // Width of each hour column in pixels
  dataPromise: Promise<ScheduleData>;
}

const GanttChart: React.FC<GanttChartProps> = ({
  dataPromise,
  hourWidth = 60,
}) => {
  const { resources, events: initialEvents } = React.use(dataPromise);
  const eventStore = React.useRef(new EventStore(initialEvents));
  const timelineWidth = React.useMemo(
    () => hours.length * hourWidth,
    [hourWidth],
  ); // Total width of the timeline *area*

  const onDragEnd = React.useCallback(
    async (dndEvent: DragEndEvent): Promise<void> => {
      if (typeof dndEvent.active.id != "string") {
        throw new Error(
          `Event id not supported ${JSON.stringify(dndEvent.active)}`,
        );
      }
      const eventId = dndEvent.active.id;
      const deltaTime: number = dndEvent.delta.x / hourWidth;
      const targetPersonId = extractTargetPersonId(dndEvent);
      eventStore.current.moveEvent(eventId, deltaTime, targetPersonId);
      await moveEvent(dndEvent.active.id, deltaTime, targetPersonId);
    },
    [hourWidth],
  );

  const id = React.useId();
  return (
    <DndContext id={id} onDragEnd={onDragEnd}>
      <div className="gantt-chart-container overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <div
          className="gantt-chart-inner inline-block min-w-full align-top" // Use inline-block or similar so width is driven by content
        >
          <div className="header-row flex bg-gray-50 sticky top-0 z-20 border-b border-gray-300">
            <div
              className={`name-header flex-shrink-0 ${nameColWidthClass} border-r border-gray-300 px-4 py-2 font-semibold text-sm text-gray-700 flex items-center justify-start sticky left-0 z-30 bg-gray-50`} // Higher z-index for top-left corner
              style={{ minWidth: nameColMinWidth }} // Ensure minimum width even if empty
            >
              Person
            </div>
            <TimelineHeader
              timelineWidth={timelineWidth}
              hourWidth={hourWidth}
            />
          </div>
          <div className="chart-body relative">
            {resources.map((person, index) => {
              const rowBgColor = index % 2 === 0 ? "bg-white" : "bg-gray-50/50";
              const stickyBgColor = index % 2 === 0 ? "white" : "#f9fafb"; // Match background for sticky column
              const eventsForPerson = eventStore.current.getEventsForPerson(
                person.id,
              );

              return (
                <div
                  key={person.id}
                  className={`person-row flex border-b border-gray-200 ${rowBgColor}`}
                >
                  <div
                    className={`name-cell flex-shrink-0 ${nameColWidthClass} border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 flex items-center justify-start sticky left-0 z-10`} // z-10 is below header
                    style={{
                      backgroundColor: stickyBgColor,
                      minWidth: nameColMinWidth,
                    }}
                  >
                    {person.name}
                  </div>

                  <TimelineRow
                    key={person.id}
                    events={eventsForPerson}
                    timelineWidth={timelineWidth}
                    hourWidth={hourWidth}
                    person={person}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default GanttChart;
