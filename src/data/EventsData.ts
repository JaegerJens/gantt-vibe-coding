"use server";

import type { Id, Event, ScheduleData } from "@/types";
import { moveTime } from "@/utils/datetime";
import { findEvent } from "@/utils/scheduler";
import { initialData } from "./InitialData";
import validate from "./validate";

const resources = initialData.resources;
let events = initialData.events;

validate(resources, events);

export const fetchData = async (): Promise<ScheduleData> => ({
  resources,
  events,
});

export const moveEvent = async (
  eventId: Id,
  deltaTime: number,
  personId?: Id,
): Promise<Event[]> => {
  console.log(
    `move event ${eventId} by ${deltaTime} hours to person ${personId}`,
  );
  const updatedEvents = [...events];
  const event = findEvent(updatedEvents, eventId);
  if (!event) return events;
  event.startTime = moveTime(event.startTime, deltaTime);
  event.endTime = moveTime(event.endTime, deltaTime);

  if (personId != null && personId !== event.personId) {
    event.personId = personId;
  }
  console.log("moved event:", event);
  events = updatedEvents;
  return updatedEvents;
};
