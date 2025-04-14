import type { Id, Event } from "@/types";
import React from "react";

export interface EventStore {
  getEventsForPerson: (personId: Id) => Event[];
  getEvent: (eventId: Id) => Event;
  findPersonIdForEvent: (event: Event) => Id;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: Event) => void;
}

const useEventStore = (initialEvents: Event[]): EventStore => {
  console.log("useEventStore");
  const eventsByPerson = React.useRef(new Map<Id, Event[]>());
  
  React.useEffect(() => {
    eventsByPerson.current.clear();
    initialEvents.forEach((event) =>
      eventsByPerson.current.set(event.personId, [
        ...(eventsByPerson.current.get(event.personId) || []),
        event,
      ]),
    );
  }, [initialEvents]);

  const synced = eventsByPerson.current.size === initialEvents.length;
    
  const getEventsForPerson = React.useCallback(
    (personId: Id) => {
      if (synced) {
        console.log(`getEventsForPerson(${personId}) synced`);
        return eventsByPerson.current.get(personId) || [];
      } else {
        console.log(`getEventsForPerson(${personId}) initial`);
        return initialEvents.filter((event) => event.personId === personId);
      }
    },
    [synced, initialEvents, eventsByPerson],
  );

  const getEvent = React.useCallback(
    (eventId: Id): Event => {
      console.log(`getEvent(${eventId})`);
      const allPersonIds = eventsByPerson.current.keys();
      const allEvents = allPersonIds.flatMap(
        (personId) => eventsByPerson.current.get(personId)!,
      );
      const event = allEvents.find((ev) => ev.id === eventId);
      if (event == null) {
        throw new Error(`Event with id ${eventId} not found`);
      }
      return event;
    },
    [eventsByPerson],
  );

  const findPersonIdForEvent = React.useCallback(
    (event: Event): Id => {
      console.log(`findPersonIdForEvent(${event.id})`);
      const personId = eventsByPerson.current
        .keys()
        .find(
          (personId) =>
            eventsByPerson.current
              .get(personId)!
              .some((e) => e.id === event.id) ?? false,
        );
      if (personId == null) {
        throw new Error(`Event with id ${event.id} not found`);
      } else {
        return personId;
      }
    },
    [eventsByPerson],
  );

  const deleteEvent = React.useCallback(
    (event: Event) => {
      console.log(`deleteEvent(${event.id})`);
      const currentPersonId = findPersonIdForEvent(event);
      const eventList = eventsByPerson.current
        .get(currentPersonId)!
        .filter((e) => e.id !== event.id);
      eventsByPerson.current.set(currentPersonId, eventList);
    },
    [eventsByPerson, findPersonIdForEvent],
  );

  const updateEvent = React.useCallback(
    (event: Event) => {
      console.log(`updateEvent(${event.id})`);
      const currentPersonId = findPersonIdForEvent(event);
      if (event.personId === currentPersonId) {
        // same person
        const eventList = eventsByPerson.current.get(currentPersonId)!;
        const index = eventList.findIndex((e) => e.id === event.id);
        eventList[index] = event;
        eventsByPerson.current.set(currentPersonId, eventList);
      } else {
        // move event to another person
        deleteEvent(event);
        const eventList = eventsByPerson.current.get(event.personId);
        if (eventList == null) {
          throw new Error(`Person with id ${event.personId} not found`);
        }
        eventList.push(event);
        eventsByPerson.current.set(event.personId, eventList);
      }
    },
    [eventsByPerson, findPersonIdForEvent, deleteEvent],
  );

  return {
    getEventsForPerson,
    getEvent,
    findPersonIdForEvent,
    updateEvent,
    deleteEvent,
  };
};

export default useEventStore;
