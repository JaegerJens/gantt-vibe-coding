"use client";

// src/components/GanttChart.tsx
import { Person } from "@/data/Events";
import React from "react";
import TimelineRow from "./TimeLineRow";
import { DndContext } from "@dnd-kit/core";

const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
const totalMinutesInDay = 24 * 60;

// Define name column width consistently (Tailwind: w-36=9rem, w-48=12rem)
// Using rem or px ensures consistency if you adjust root font-size later
const nameColWidthClass = "w-36 lg:w-48";
const nameColMinWidth = "9rem"; // Or 144px for w-36
const nameColLgMinWidth = "12rem"; // Or 192px for w-48

interface GanttChartProps {
  people: Person[];
  hourWidth?: number; // Width of each hour column in pixels
}

const GanttChart: React.FC<GanttChartProps> = ({ people, hourWidth = 60 }) => {
  const timelineWidth = hours.length * hourWidth; // Total width of the timeline *area*

  return (
    <DndContext>
      {/* NEW: Outer wrapper enables horizontal scrolling for the *entire* grid below */}
      <div className="gantt-chart-container overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        {/* NEW: Inner div that will contain the full grid width */}
        <div
          className="gantt-chart-inner inline-block min-w-full align-top" // Use inline-block or similar so width is driven by content
        >
          {/* Header Row: Stays sticky to the top */}
          <div className="header-row flex bg-gray-50 sticky top-0 z-20 border-b border-gray-300">
            {/* Header: Person Name Column (Sticky Left) */}
            <div
              className={`name-header flex-shrink-0 ${nameColWidthClass} border-r border-gray-300 px-4 py-2 font-semibold text-sm text-gray-700 flex items-center justify-start sticky left-0 z-30 bg-gray-50`} // Higher z-index for top-left corner
              style={{ minWidth: nameColMinWidth }} // Ensure minimum width even if empty
            >
              Person
            </div>
            {/* Header: Timeline Hours (Part of the horizontal scroll) */}
            <div
              className="timeline-header flex-grow flex"
              style={{ width: `${timelineWidth}px` }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="hour-marker flex-shrink-0 border-r border-gray-200 text-center text-xs font-medium text-gray-500 py-2"
                  style={{ width: `${hourWidth}px` }}
                >
                  {`${hour.toString().padStart(2, "0")}:00`}
                </div>
              ))}
            </div>
          </div>
          {/* Body: Rows for each person */}
          <div className="chart-body relative">
            {" "}
            {/* Relative positioning context for event bars */}
            {people.map((person, index) => {
              const rowBgColor = index % 2 === 0 ? "bg-white" : "bg-gray-50/50";
              const stickyBgColor = index % 2 === 0 ? "white" : "#f9fafb"; // Match background for sticky column

              return (
                <div
                  key={person.id}
                  className={`person-row flex border-b border-gray-200 ${rowBgColor}`}
                >
                  {/* Person Name Cell (Sticky Left) */}
                  <div
                    className={`name-cell flex-shrink-0 ${nameColWidthClass} border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 flex items-center justify-start sticky left-0 z-10`} // z-10 is below header
                    style={{
                      backgroundColor: stickyBgColor,
                      minWidth: nameColMinWidth,
                    }}
                  >
                    {person.name}
                  </div>

                  {/* Timeline Row (Scrollable horizontally with header) */}
                  <TimelineRow
                    events={person.events}
                    timelineWidth={timelineWidth}
                    hourWidth={hourWidth}
                    totalMinutesInDay={totalMinutesInDay}
                    personName={person.name}
                  />
                </div> // End Person Row
              );
            })}
          </div>{" "}
          {/* End Chart Body */}
        </div>{" "}
        {/* End Inner Grid Container */}
      </div>{" "}
      {/* End Outer Scroll Container */}
    </DndContext>
  );
};

export default GanttChart;
