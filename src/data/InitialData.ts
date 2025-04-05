import { Event, Person, ScheduleData } from "@/types";

export const resources: Person[] = [
  {
    id: "p1",
    name: "Alice Smith",
  },
  {
    id: "p2",
    name: "Bob Johnson",
  },
  {
    id: "p3",
    name: "Charlie Davis",
  },
  {
    id: "p4",
    name: "Diana Evans",
  },
];

export const events: Event[] = [
  {
    id: "a1",
    title: "Morning Standup",
    startTime: "09:00",
    endTime: "09:30",
    color: "bg-red-500",
    personId: "p1",
  },
  {
    id: "a2",
    title: "Project Planning",
    startTime: "10:00",
    endTime: "12:00",
    personId: "p1",
  },
  {
    id: "a3",
    title: "Client Call",
    startTime: "14:00",
    endTime: "15:00",
    color: "bg-green-600",
    personId: "p1",
  },
  {
    id: "a4",
    title: "Code Review",
    startTime: "16:30",
    endTime: "17:30",
    color: "bg-purple-500",
    personId: "p1",
  },
  {
    id: "b1",
    title: "Team Sync",
    startTime: "09:00",
    endTime: "09:15",
    color: "bg-red-500",
    personId: "p2",
  },
  {
    id: "b2",
    title: "Development Work",
    startTime: "09:30",
    endTime: "12:30",
    color: "bg-orange-500",
    personId: "p2",
  },
  {
    id: "b3",
    title: "Lunch Break",
    startTime: "12:30",
    endTime: "13:15",
    color: "bg-gray-400",
    personId: "p2",
  },
  {
    id: "b4",
    title: "Bug Fixing",
    startTime: "14:30",
    endTime: "16:00",
    color: "bg-yellow-500",
    personId: "p2",
  },
  {
    id: "c1",
    title: "Design Review",
    startTime: "11:00",
    endTime: "12:30",
    color: "bg-indigo-500",
    personId: "p3",
  },
  {
    id: "c2",
    title: "User Testing Prep",
    startTime: "15:00",
    endTime: "17:00",
    color: "bg-teal-500",
    personId: "p3",
  },
];

export const initialData: ScheduleData = {
  resources,
  events,
};
