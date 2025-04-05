// src/components/GanttChart.tsx
import React from 'react';

// --- Types (Optional but recommended with TypeScript) ---
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

// --- Helper Function ---
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const GanttChart: React.FC<GanttChartProps> = ({ people, hourWidth = 60 }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
  const totalMinutesInDay = 24 * 60;
  const timelineWidth = hours.length * hourWidth; // Total width of the timeline area

  return (
    <div className="gantt-chart bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header: Person Name + Timeline Hours */}
      <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        {/* Fixed Column for Names */}
        <div className="w-36 lg:w-48 border-r border-gray-200 px-4 py-2 font-semibold text-sm text-gray-700 flex items-center justify-start sticky left-0 bg-gray-50 z-20">
          Person
        </div>
        {/* Scrollable Timeline Header */}
        <div className="flex-grow overflow-hidden">
          <div className="flex" style={{ width: `${timelineWidth}px` }}>
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex-shrink-0 border-r border-gray-200 text-center text-xs font-medium text-gray-500 py-2"
                style={{ width: `${hourWidth}px` }}
              >
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body: Rows for each person */}
      <div className="relative overflow-x-auto"> {/* Allow horizontal scroll */}
        {people.map((person, index) => (
          <div key={person.id} className={`flex border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
            {/* Fixed Column for Name */}
            <div className="w-36 lg:w-48 border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 flex items-center justify-start sticky left-0 z-10" style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' /* Match row bg */ }}>
              {person.name}
            </div>

            {/* Scrollable Timeline Row */}
            <div className="flex-grow relative h-12"> {/* Fixed height for rows */}
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex">
                {hours.map((hour) => (
                  <div
                    key={`grid-${hour}`}
                    className="flex-shrink-0 border-r border-gray-100"
                    style={{ width: `${hourWidth}px` }}
                  ></div>
                ))}
                 <div className="absolute inset-y-0 left-0 w-full border-t border-transparent"></div> {/* Ensures parent height */}
              </div>

              {/* Event Bars */}
              {person.events.map((event) => {
                const startMinutes = timeToMinutes(event.startTime);
                const endMinutes = timeToMinutes(event.endTime);
                // Ensure end time is after start time for width calculation
                const durationMinutes = Math.max(0, endMinutes - startMinutes);

                // Calculate position and width based on percentage of the day
                const leftPercent = (startMinutes / totalMinutesInDay) * 100;
                const widthPercent = (durationMinutes / totalMinutesInDay) * 100;

                // Or calculate based on fixed pixel width
                const leftPx = (startMinutes / totalMinutesInDay) * timelineWidth;
                const widthPx = (durationMinutes / totalMinutesInDay) * timelineWidth;

                const bgColor = event.color || 'bg-blue-500'; // Default or custom color

                return (
                  <div
                    key={event.id}
                    className={`absolute top-1 bottom-1 rounded flex items-center px-2 text-white text-xs font-medium overflow-hidden whitespace-nowrap ${bgColor}`}
                    style={{
                      left: `${leftPx}px`,
                      width: `${widthPx}px`,
                      minWidth: '10px', // Avoid zero-width bars for very short events
                    }}
                    title={`${person.name}: ${event.name} (${event.startTime} - ${event.endTime})`} // Tooltip
                  >
                    <span className="truncate">{event.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
         {/* Add an empty div at the bottom if needed for scrollbar spacing, etc. */}
         <div className="h-1"></div>
      </div>
    </div>
  );
};

export default GanttChart;