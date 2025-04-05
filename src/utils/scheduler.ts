import { Id, PersonWithEvents, Event } from "@/types";

export const findEvent = (data: PersonWithEvents[], eventId: Id): Event | undefined => data.flatMap(p => p.events).find(e => e.id === eventId);
