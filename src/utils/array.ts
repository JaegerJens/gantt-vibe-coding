import { Id, Event, Person } from "@/types";

type Identity<T extends object> = (entity: T) => Id;

export const EventIdentity: Identity<Event> = (e) => e.id;
export const EventPersonIdentity: Identity<Event> = (e) => e.personId;
export const PersonIdentity: Identity<Person> = (p) => p.id;

export function removeEntity<T extends object>(
  list: T[],
  entity: T,
  id: Identity<T>,
): T[] {
  const entityId = id(entity);
  return list.filter((e) => id(e) !== entityId);
}

export function replaceEntity<T extends object>(
  list: T[],
  entity: T,
  id: Identity<T>,
): T[] {
  const entityId = id(entity);
  return list.map((e) => (id(e) === entityId ? entity : e));
}

export function groupIntoMap<T extends object>(
  list: T[],
  id: Identity<T>,
): Map<Id, T[]> {
  const map = new Map<Id, T[]>();
  list.forEach((e) => {
    const key = id(e);
    const list = map.get(key) || [];
    list.push(e);
    map.set(key, list);
  });
  return map;
}
