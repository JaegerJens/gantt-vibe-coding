import { Id, Event } from "@/types";

export const findEvent = (events: Event[], eventId: Id): Event | undefined =>
  events.find((e) => e.id === eventId);

export const findEventsForPerson = (events: Event[], personId: Id): Event[] =>
  events.filter((e) => e.personId === personId);
