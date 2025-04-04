// app/page.tsx
import GanttChart from '@/components/GanttChart'; // Adjust path
import { Resource, Task } from '@/types/gantt'; // Adjust path

// Sample Data for Today
const today = new Date();
const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

const sampleResources: Resource[] = [
  { id: 'res-1', name: 'Developer A' },
  { id: 'res-2', name: 'Developer B' },
  { id: 'res-3', name: 'QA Engineer' },
];

const sampleTasks: Task[] = [
  {
    id: 'task-1',
    resourceId: 'res-1',
    name: 'Implement Feature X',
    startTime: new Date(startOfDay.getTime() + 9 * 60 * 60 * 1000), // 9:00 AM
    endTime: new Date(startOfDay.getTime() + 12 * 60 * 60 * 1000),  // 12:00 PM
    color: 'bg-blue-500', // Use Tailwind background color classes
  },
  {
    id: 'task-2',
    resourceId: 'res-1',
    name: 'Code Review',
    startTime: new Date(startOfDay.getTime() + 14 * 60 * 60 * 1000), // 2:00 PM
    endTime: new Date(startOfDay.getTime() + 15 * 60 * 60 * 1000),  // 3:00 PM
    color: 'bg-green-500',
  },
  {
    id: 'task-3',
    resourceId: 'res-2',
    name: 'Design Mockups',
    startTime: new Date(startOfDay.getTime() + 10 * 60 * 60 * 1000), // 10:00 AM
    endTime: new Date(startOfDay.getTime() + 13.5 * 60 * 60 * 1000), // 1:30 PM
    color: 'bg-purple-500',
  },
   {
    id: 'task-4',
    resourceId: 'res-3',
    name: 'Test Feature Y',
    startTime: new Date(startOfDay.getTime() + 13 * 60 * 60 * 1000), // 1:00 PM
    endTime: new Date(startOfDay.getTime() + 16 * 60 * 60 * 1000),  // 4:00 PM
    color: 'bg-orange-500',
  },
   { // Task starting yesterday, ending today
    id: 'task-5',
    resourceId: 'res-2',
    name: 'Planning Session',
    startTime: new Date(startOfDay.getTime() - 2 * 60 * 60 * 1000), // Yesterday 10 PM
    endTime: new Date(startOfDay.getTime() + 1 * 60 * 60 * 1000),  // Today 1 AM
    color: 'bg-yellow-500',
  },
];

export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Gantt Chart</h1>
      <GanttChart initialResources={sampleResources} initialTasks={sampleTasks} />
    </main>
  );
}