import { Id, Event } from "@/types";
import {
  EventIdentity,
  EventPersonIdentity,
  groupIntoMap,
  removeEntity,
  replaceEntity,
} from "@/utils/array";
import { moveTime } from "@/utils/datetime";

class EventStore {
  private eventsByPerson: Map<string, Event[]>;
  private eventId2PersonId: Map<Id, Id>;

  constructor(events: Event[]) {
    this.eventsByPerson = groupIntoMap(events, EventPersonIdentity);
    this.eventId2PersonId = events.reduce((map, event) => {
      map.set(event.id, event.personId);
      return map;
    }, new Map<Id, Id>());
  }

  private getEvent(eventId: Id): Event {
    const currentPersonId = this.eventId2PersonId.get(eventId);
    if (currentPersonId == null) {
      throw new Error(`Event with id ${eventId} not found`);
    }
    const event = this.eventsByPerson
      .get(currentPersonId)!
      .find((event) => event.id === eventId);
    if (event == null) {
      throw new Error(`Event with id ${eventId} not found`);
    }
    return event;
  }

  getEventsForPerson(personId: Id): Event[] {
    return this.eventsByPerson.get(personId) || [];
  }

  moveEvent(eventId: Id, deltaTime: number, personId?: Id) {
    const event = this.getEvent(eventId);
    event.startTime = moveTime(event.startTime, deltaTime);
    event.endTime = moveTime(event.endTime, deltaTime);
    if (personId != null && event.personId !== personId) {
      // remove event from old person
      const oldPersonEvents = this.eventsByPerson.get(event.personId) || [];
      const trimmedOldPersonEvents = removeEntity(
        oldPersonEvents,
        event,
        EventIdentity,
      );
      this.eventsByPerson.set(event.personId, trimmedOldPersonEvents);

      // add event to new person
      event.personId = personId;
      const newPersonEvents = this.eventsByPerson.get(personId) || [];
      newPersonEvents.push(event);
      this.eventsByPerson.set(personId, newPersonEvents);
    } else {
      // update event
      const eventList = this.eventsByPerson.get(event.personId) || [];
      replaceEntity(eventList, event, EventIdentity);
      this.eventsByPerson.set(event.personId, eventList);
    }
    this.eventId2PersonId.set(eventId, event.personId);
  }
}

export default EventStore;
