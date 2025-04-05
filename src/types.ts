export type TimeString = `${number}:${number}`;

export interface Event {
  id: string | number;
  name: string;
  startTime: TimeString;
  endTime: TimeString;
  color?: string;
}

export interface Person {
  id: string | number;
  name: string;
  events: Event[];
}
