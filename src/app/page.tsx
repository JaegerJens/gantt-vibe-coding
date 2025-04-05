import GanttChart from "@/components/GanttChart"; // Adjust import path if needed
import { fetchData } from "@/data/EventsData";
import { Suspense } from "react";

export default function HomePage() {
  const dataPromise = fetchData();
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Today&apos;s Schedule
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <GanttChart dataPromise={dataPromise} hourWidth={80} />{" "}
      </Suspense>
      {/* Adjust hourWidth as needed */}
      <div className="mt-8 text-sm text-gray-600">
        <p>
          This Gantt chart shows scheduled events for different team members
          throughout the day.
        </p>
        <p>Hover over an event bar to see details.</p>
      </div>
    </main>
  );
}
