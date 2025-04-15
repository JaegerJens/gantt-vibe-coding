import { Id, Event } from "@/types";

export const findEvent = (events: Event[], eventId: Id): Event | undefined =>
  events.find((e) => e.id === eventId);

export const findEventsForPerson = (events: Event[], personId: Id): Event[] =>
  events.filter((e) => e.personId === personId);

export const areEventsEqual = (a: Event, b: Event): boolean =>
  a.id === b.id &&
  a.title === b.title &&
  a.personId === b.personId &&
  a.startTime === b.startTime &&
  a.endTime === b.endTime &&
  a.color === b.color;
