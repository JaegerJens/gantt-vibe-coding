export type TimeString = `${number}:${number}`;

export type Id = string;

export interface Event {
  id: Id;
  name: string;
  startTime: TimeString;
  endTime: TimeString;
  color?: string;
}

export interface Person {
  id: Id;
  name: string;
}

export interface PersonWithEvents extends Person {
  events: Event[];
}
