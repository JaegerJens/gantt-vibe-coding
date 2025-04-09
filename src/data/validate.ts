import { Person, Event } from "@/types";

const validate = (resources: Person[], events: Event[]) => {
  const knownPersonIds = new Set();
  const knownEventIds = new Set();

  for (const resource of resources) {
    if (knownPersonIds.has(resource.id)) {
      throw new Error(`Duplicate person ID: ${resource.id}`);
    }
    knownPersonIds.add(resource.id);
  }

  for (const event of events) {
    if (knownEventIds.has(event.id)) {
      throw new Error(`Duplicate event ID: ${event.id}`);
    }
    knownEventIds.add(event.id);

    if (!knownPersonIds.has(event.personId)) {
      throw new Error(
        `Unknown person ID: ${event.personId} in event ${event.id}`,
      );
    }
  }
};

export default validate;
