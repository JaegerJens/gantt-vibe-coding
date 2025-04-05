import GanttChart from "@/components/GanttChart"; // Adjust import path if needed
import { fetchData } from "@/data/EventsData";

export default function HomePage() {
  const dataPromise = fetchData();
  return (
    <main className="mx-auto sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Today&apos;s Schedule
      </h1>
      <GanttChart dataPromise={dataPromise} hourWidth={80} />
    </main>
  );
}
