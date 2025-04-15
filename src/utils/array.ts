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

type Equality<T> = (a: T, b: T) => boolean;

export function areArraysEqual<T>(
  a: T[],
  b: T[],
  equalEntity: Equality<T>,
): boolean {
  if (a.length !== b.length) return false;
  return a.reduce(
    (res, curr) => res && b.some((e) => equalEntity(curr, e)),
    true,
  );
}
