"use server";

import type { Id, Event, PersonWithEvents } from "@/types";
import { moveTime } from "@/utils/datetime";
import { findEvent } from "@/utils/scheduler";

const sampleGanttData: PersonWithEvents[] = [
  {
    id: "p1",
    name: "Alice Smith",
    events: [
      {
        id: "a1",
        name: "Morning Standup",
        startTime: "09:00",
        endTime: "09:30",
        color: "bg-red-500",
      },
      {
        id: "a2",
        name: "Project Planning",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "a3",
        name: "Client Call",
        startTime: "14:00",
        endTime: "15:00",
        color: "bg-green-600",
      },
      {
        id: "a4",
        name: "Code Review",
        startTime: "16:30",
        endTime: "17:30",
        color: "bg-purple-500",
      },
    ],
  },
  {
    id: "p2",
    name: "Bob Johnson",
    events: [
      {
        id: "b1",
        name: "Team Sync",
        startTime: "09:00",
        endTime: "09:15",
        color: "bg-red-500",
      },
      {
        id: "b2",
        name: "Development Work",
        startTime: "09:30",
        endTime: "12:30",
        color: "bg-orange-500",
      },
      {
        id: "b3",
        name: "Lunch Break",
        startTime: "12:30",
        endTime: "13:15",
        color: "bg-gray-400",
      },
      {
        id: "b4",
        name: "Bug Fixing",
        startTime: "14:30",
        endTime: "16:00",
        color: "bg-yellow-500",
      },
    ],
  },
  {
    id: "p3",
    name: "Charlie Davis",
    events: [
      {
        id: "c1",
        name: "Design Review",
        startTime: "11:00",
        endTime: "12:30",
        color: "bg-indigo-500",
      },
      {
        id: "c2",
        name: "User Testing Prep",
        startTime: "15:00",
        endTime: "17:00",
        color: "bg-teal-500",
      },
    ],
  },
  {
    id: "p4",
    name: "Diana Evans (No Events)",
    events: [],
  },
];

export const fetchData = async (): Promise<PersonWithEvents[]> =>
  sampleGanttData;

export const moveEventTime = async (
  eventId: Id,
  deltaTime: number,
): Promise<Event | undefined> => {
  const event = findEvent(sampleGanttData, eventId);
  if (!event) return;
  event.startTime = moveTime(event.startTime, deltaTime);
  event.endTime = moveTime(event.endTime, deltaTime);
  return event;
};
