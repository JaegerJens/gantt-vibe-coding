// src/app/page.tsx (or wherever you use the component)

interface Event {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    color?: string; // Optional color property
  }
  
  interface Person {
    id: number;
    name: string;
    events: Event[];
  }
  

export const sampleGanttData: Person[] = [
    {
      id: 1,
      name: 'Alice Smith',
      events: [
        { id: 'a1', name: 'Morning Standup', startTime: '09:00', endTime: '09:30', color: 'bg-red-500' },
        { id: 'a2', name: 'Project Planning', startTime: '10:00', endTime: '12:00' }, // Uses default blue
        { id: 'a3', name: 'Client Call', startTime: '14:00', endTime: '15:00', color: 'bg-green-600' },
        { id: 'a4', name: 'Code Review', startTime: '16:30', endTime: '17:30', color: 'bg-purple-500' },
      ],
    },
    {
      id: 2,
      name: 'Bob Johnson',
      events: [
        { id: 'b1', name: 'Team Sync', startTime: '09:00', endTime: '09:15', color: 'bg-red-500' },
        { id: 'b2', name: 'Development Work', startTime: '09:30', endTime: '12:30', color: 'bg-orange-500' },
        { id: 'b3', name: 'Lunch Break', startTime: '12:30', endTime: '13:15', color: 'bg-gray-400' },
        { id: 'b4', name: 'Bug Fixing', startTime: '14:30', endTime: '16:00', color: 'bg-yellow-500' },
      ],
    },
    {
      id: 3,
      name: 'Charlie Davis',
      events: [
        { id: 'c1', name: 'Design Review', startTime: '11:00', endTime: '12:30', color: 'bg-indigo-500' },
        { id: 'c2', name: 'User Testing Prep', startTime: '15:00', endTime: '17:00', color: 'bg-teal-500' },
      ],
    },
     {
      id: 4,
      name: 'Diana Evans (No Events)',
      events: [],
    },
  ];