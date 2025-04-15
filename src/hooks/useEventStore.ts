import type { Event, Id } from "@/types";
import {
  EventIdentity,
  EventPersonIdentity,
  groupIntoMap,
  removeEntity,
  replaceEntity,
} from "@/utils/array";
import { moveTime } from "@/utils/datetime";
import React from "react";

export interface EventStore {
  getEvent: (eventId: Id) => Event;
  getEventsForPerson: (personId: Id) => Event[];
  modifyEvent: (eventId: Id, deltaTime: number, personId?: Id) => void;
}

function useEventStore(initialEvents: Event[]): EventStore {
  const eventsByPerson = React.useRef(
    groupIntoMap(initialEvents, EventPersonIdentity),
  );
  const eventId2PersonId = React.useRef(
    initialEvents.reduce((map, event) => {
      map.set(event.id, event.personId);
      return map;
    }, new Map<Id, Id>()),
  );

  const getEvent = React.useCallback((eventId: Id) => {
    const currentPersonId = eventId2PersonId.current.get(eventId);
    if (currentPersonId == null) {
      throw new Error(`Event with id ${eventId} not found`);
    }
    const event = eventsByPerson.current
      .get(currentPersonId)
      ?.find((event) => event.id === eventId);
    if (event == null) {
      throw new Error(`Event with id ${eventId} not found`);
    }
    return event;
  }, []);

  const getEventsForPerson = React.useCallback((personId: Id) => {
    if (!eventsByPerson.current.has(personId)) {
      eventsByPerson.current.set(personId, []);
    }
    return eventsByPerson.current.get(personId)!;
  }, []);

  const modifyEvent = React.useCallback(
    (eventId: Id, deltaTime: number, personId?: Id) => {
      const event = getEvent(eventId);
      event.startTime = moveTime(event.startTime, deltaTime);
      event.endTime = moveTime(event.endTime, deltaTime);
      if (personId != null && event.personId !== personId) {
        // remove event from old person
        const oldPersonEvents = getEventsForPerson(event.personId);
        const trimmedOldPersonEvents = removeEntity(
          oldPersonEvents,
          event,
          EventIdentity,
        );
        eventsByPerson.current.set(event.personId, trimmedOldPersonEvents);

        // add event to new person
        event.personId = personId;
        const newPersonEvents = getEventsForPerson(personId);
        newPersonEvents.push(event);
        eventsByPerson.current.set(personId, newPersonEvents);
      } else {
        // update event
        const eventList = getEventsForPerson(event.personId);
        replaceEntity(eventList, event, EventIdentity);
        eventsByPerson.current.set(event.personId, eventList);
      }
      eventId2PersonId.current.set(eventId, event.personId);
    },
    [getEvent, getEventsForPerson],
  );

  return React.useMemo(
    () => ({
      getEvent,
      getEventsForPerson,
      modifyEvent,
    }),
    [getEvent, getEventsForPerson, modifyEvent],
  );
}

export default useEventStore;
