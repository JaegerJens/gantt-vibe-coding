export type TimeString = `${number}:${number}`;

export type Id = string;

export interface Event {
  id: Id;
  title: string;
  startTime: TimeString;
  endTime: TimeString;
  color?: string;
  personId: Id;
}

export interface Person {
  id: Id;
  name: string;
}

export interface ScheduleData {
  resources: Person[];
  events: Event[];
}
