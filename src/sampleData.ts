// src/sampleData.ts
import { Resource, GanttEvent } from './types';
import { addDays, subDays } from 'date-fns';

const today = new Date();
// Normalize start of today for consistent calculations
today.setHours(0, 0, 0, 0);

export const sampleResources: Resource[] = [
  { id: 'res1', name: 'Resource A' },
  { id: 'res2', name: 'Resource B' },
  { id: 'res3', name: 'Resource C' },
];

export const sampleEvents: GanttEvent[] = [
  {
    id: 'event1',
    resourceId: 'res1',
    name: 'Task 1',
    start: today,
    end: addDays(today, 5),
    color: 'bg-blue-500',
  },
  {
    id: 'event2',
    resourceId: 'res2',
    name: 'Task 2',
    start: addDays(today, 2),
    end: addDays(today, 7),
    color: 'bg-green-500',
  },
  {
    id: 'event3',
    resourceId: 'res1',
    name: 'Task 3',
    start: addDays(today, 8),
    end: addDays(today, 11),
    color: 'bg-blue-500',
  },
    {
    id: 'event4',
    resourceId: 'res3',
    name: 'Task 4',
    start: subDays(today, 2),
    end: addDays(today, 3),
    color: 'bg-purple-500',
  },
];