export interface Event {
    id: string | number;
    name: string;
    startTime: Date;
    endTime: Date;
    color?: string;
  }
  
  export interface Person {
    id: string | number;
    name: string;
    events: Event[];
  }
  
  // Helper function to create Date objects from HH:MM strings
  const timeStringToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to 0
    return date;
  };
  
  export const sampleGanttData: Person[] = [
    {
      id: 1,
      name: 'Alice Smith',
      events: [
        { id: 'a1', name: 'Morning Standup', startTime: timeStringToDate('09:00'), endTime: timeStringToDate('09:30'), color: 'bg-red-500' },
        { id: 'a2', name: 'Project Planning', startTime: timeStringToDate('10:00'), endTime: timeStringToDate('12:00') },
        { id: 'a3', name: 'Client Call', startTime: timeStringToDate('14:00'), endTime: timeStringToDate('15:00'), color: 'bg-green-600' },
        { id: 'a4', name: 'Code Review', startTime: timeStringToDate('16:30'), endTime: timeStringToDate('17:30'), color: 'bg-purple-500' },
      ],
    },
    {
      id: 2,
      name: 'Bob Johnson',
      events: [
        { id: 'b1', name: 'Team Sync', startTime: timeStringToDate('09:00'), endTime: timeStringToDate('09:15'), color: 'bg-red-500' },
        { id: 'b2', name: 'Development Work', startTime: timeStringToDate('09:30'), endTime: timeStringToDate('12:30'), color: 'bg-orange-500' },
        { id: 'b3', name: 'Lunch Break', startTime: timeStringToDate('12:30'), endTime: timeStringToDate('13:15'), color: 'bg-gray-400' },
        { id: 'b4', name: 'Bug Fixing', startTime: timeStringToDate('14:30'), endTime: timeStringToDate('16:00'), color: 'bg-yellow-500' },
      ],
    },
    {
      id: 3,
      name: 'Charlie Davis',
      events: [
        { id: 'c1', name: 'Design Review', startTime: timeStringToDate('11:00'), endTime: timeStringToDate('12:30'), color: 'bg-indigo-500' },
        { id: 'c2', name: 'User Testing Prep', startTime: timeStringToDate('15:00'), endTime: timeStringToDate('17:00'), color: 'bg-teal-500' },
      ],
    },
    {
      id: 4,
      name: 'Diana Evans (No Events)',
      events: [],
    },
  ];
  