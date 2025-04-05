// src/components/GanttChart.tsx
import React from 'react';

// --- Types (Remain the same) ---
interface Event {
  id: string | number;
  name: string;
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string;   // Format: "HH:MM" (24-hour)
  color?: string;      // Optional custom color
}

interface Person {
  id: string | number;
  name: string;
  events: Event[];
}

interface GanttChartProps {
  people: Person[];
  hourWidth?: number; // Width of each hour column in pixels
}

// --- Helper Function (Remains the same) ---
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const GanttChart: React.FC<GanttChartProps> = ({ people, hourWidth = 60 }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
  const totalMinutesInDay = 24 * 60;
  const timelineWidth = hours.length * hourWidth; // Total width of the timeline *area*

  // Define name column width consistently (Tailwind: w-36=9rem, w-48=12rem)
  // Using rem or px ensures consistency if you adjust root font-size later
  const nameColWidthClass = "w-36 lg:w-48";
  const nameColMinWidth = '9rem'; // Or 144px for w-36
  const nameColLgMinWidth = '12rem'; // Or 192px for w-48

  return (
    // NEW: Outer wrapper enables horizontal scrolling for the *entire* grid below
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
          <div className="timeline-header flex-grow flex" style={{ width: `${timelineWidth}px` }}>
            {hours.map((hour) => (
              <div
                key={hour}
                className="hour-marker flex-shrink-0 border-r border-gray-200 text-center text-xs font-medium text-gray-500 py-2"
                style={{ width: `${hourWidth}px` }}
              >
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
            ))}
          </div>
        </div>

        {/* Body: Rows for each person */}
        <div className="chart-body relative"> {/* Relative positioning context for event bars */}
          {people.map((person, index) => {
            const rowBgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';
            const stickyBgColor = index % 2 === 0 ? 'white' : '#f9fafb'; // Match background for sticky column

            return (
              <div key={person.id} className={`person-row flex border-b border-gray-200 ${rowBgColor}`}>
                {/* Person Name Cell (Sticky Left) */}
                <div
                  className={`name-cell flex-shrink-0 ${nameColWidthClass} border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 flex items-center justify-start sticky left-0 z-10`} // z-10 is below header
                  style={{ backgroundColor: stickyBgColor, minWidth: nameColMinWidth }}
                >
                  {person.name}
                </div>

                {/* Timeline Row (Scrollable horizontally with header) */}
                <div
                  className="timeline-row flex-grow relative h-12" // Fixed height for rows
                  style={{ width: `${timelineWidth}px` }} // Ensure it takes up the calculated timeline width
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
                  <div className="event-bars absolute inset-0"> {/* Container for absolutely positioned events */}
                    {person.events.map((event) => {
                      const startMinutes = timeToMinutes(event.startTime);
                      const endMinutes = timeToMinutes(event.endTime);
                      const durationMinutes = Math.max(0, endMinutes - startMinutes);

                      const leftPx = (startMinutes / totalMinutesInDay) * timelineWidth;
                      const widthPx = (durationMinutes / totalMinutesInDay) * timelineWidth;

                      const bgColor = event.color || 'bg-blue-500';

                      return (
                        <div
                          key={event.id}
                          className={`event-bar absolute top-1 bottom-1 rounded flex items-center px-2 text-white text-xs font-medium overflow-hidden whitespace-nowrap ${bgColor}`}
                          style={{
                            left: `${leftPx}px`,
                            width: `${widthPx}px`,
                            minWidth: '1px', // Allow very small bars
                            maxWidth: `calc(100% - ${leftPx}px)` // Prevent overflow visually
                          }}
                          title={`${person.name}: ${event.name} (${event.startTime} - ${event.endTime})`}
                        >
                          <span className="truncate">{event.name}</span>
                        </div>
                      );
                    })}
                  </div> {/* End Event Bars Container */}
                </div> {/* End Timeline Row */}
              </div> // End Person Row
            );
          })}
        </div> {/* End Chart Body */}
      </div> {/* End Inner Grid Container */}
    </div> // End Outer Scroll Container
  );
};

export default GanttChart;