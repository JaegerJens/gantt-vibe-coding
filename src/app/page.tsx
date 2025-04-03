'use client'

// src/App.tsx
import React, { useState } from 'react';
import GanttChart from '../components/GanttChart';
import { sampleResources, sampleEvents } from '../sampleData';
import { GanttEvent } from './types'; // Import the type

function App() {
  // Manage the events state here so changes persist
  const [events, setEvents] = useState<GanttEvent[]>(sampleEvents);

  const handleEventsChange = (updatedEvents: GanttEvent[]) => {
    console.log("Events updated:", updatedEvents);
    setEvents(updatedEvents);
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">React Gantt Chart</h1>
      <div className="w-full h-[600px] overflow-hidden border border-gray-400"> {/* Added container for better scroll demo */}
        <GanttChart
          resources={sampleResources}
          events={events}
          onEventsChange={handleEventsChange}
          // Optional: Define specific start/end dates
          // startDate={new Date(2023, 10, 1)} // Example: Nov 1, 2023
          // endDate={new Date(2023, 11, 31)}   // Example: Dec 31, 2023
        />
      </div>
       {/* Optional: Display raw event data for debugging */}
       {/* <pre className="mt-4 p-2 bg-gray-100 text-xs overflow-auto max-h-60">
         {JSON.stringify(events, (key, value) => {
           if (key === 'start' || key === 'end') {
             return new Date(value).toISOString().split('T')[0]; // Format dates for readability
           }
           return value;
         }, 2)}
       </pre> */}
    </div>
  );
}

export default App;