import { Event, Person, ScheduleData, TimeString } from "@/types";

const parameter = {
  startHour: 5,
  endHour: 23,
  resourceCount: 10,
  averageEventCountPerResource: 5,
};

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomTime = (): TimeString => {
  const hour = getRandomInt(parameter.startHour, parameter.endHour);
  const minute = getRandomInt(0, 3) * 15; // 0, 15, 30, 45
  return `${hour}:${minute}`;
};

// Generates a plausible end time based on a start time
const generateEndTime = (startTime: string): TimeString => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const durationMinutes = getRandomInt(2, 8) * 15; // 30 mins to 2 hours

  let endMinute = startMinute + durationMinutes;
  let endHour = startHour + Math.floor(endMinute / 60);
  endMinute %= 60;

  // Ensure end time doesn't exceed 18:00
  if (endHour >= parameter.endHour) {
    endHour = parameter.endHour;
    endMinute = 0;
    // If start time was already 18:00, make duration minimal
    if (startHour >= parameter.endHour) {
      endHour = parameter.endHour;
      endMinute = 15; // Or some small fixed duration
    }
  }

  // Avoid start and end times being the same if duration was minimal and clipped
  if (endHour === startHour && endMinute === startMinute) {
    endMinute += 15;
    if (endMinute >= 60) {
      endHour += 1;
      endMinute = 0;
    }
    // Recalculate clipping just in case
    if (endHour >= parameter.endHour) {
      endHour = parameter.endHour;
      endMinute = 0;
    }
  }

  return `${endHour}:${endMinute}`;
};

// Predefined lists for variety
const possibleTitles: string[] = [
  "Planning Session",
  "Development Task",
  "Code Review",
  "Team Sync",
  "Client Meeting",
  "Bug Fixing",
  "Documentation",
  "Testing Phase",
  "Design Discussion",
  "Standup",
  "Project Update",
  "Research",
  "Deployment Prep",
  "Feature Work",
  "Urgent Fix",
  "Training",
];

const possibleColors: string[] = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-slate-500",
  "bg-gray-400",
];

const firstNames: string[] = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Emily",
  "Frank",
  "Grace",
  "Henry",
  "Isabella",
  "Jack",
  "Katie",
  "Liam",
  "Mia",
  "Noah",
  "Olivia",
  "Peter",
  "Quinn",
  "Ryan",
  "Sophia",
  "Thomas",
];
const lastNames: string[] = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];

// --- Generate Resources (Persons) ---
const generateResources = (count: number): Person[] => {
  const resources: Person[] = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
    resources.push({
      id: `p${i}`,
      // You could use a library like faker.js for more realistic names
      name: `${firstName} ${lastName}`,
    });
  }
  return resources;
};

// --- Generate Events ---
const generateEvents = (persons: Person[]): Event[] => {
  const events: Event[] = [];
  let eventCounter = 1;
  persons.forEach((person) => {
    const numberOfEvents = getRandomInt(
      parameter.averageEventCountPerResource - 2,
      parameter.averageEventCountPerResource + 2,
    );
    for (let i = 0; i < numberOfEvents; i++) {
      const startTime = getRandomTime();
      const endTime = generateEndTime(startTime);
      events.push({
        id: `e${eventCounter++}`,
        title: possibleTitles[getRandomInt(0, possibleTitles.length - 1)],
        startTime,
        endTime,
        color: possibleColors[getRandomInt(0, possibleColors.length - 1)],
        personId: person.id,
      });
    }
  });
  // Basic overlap avoidance/sorting (optional, depends on how you use the data)
  // This simple sort helps visualize but doesn't prevent overlaps fully
  events.sort((a, b) => {
    if (a.personId < b.personId) return -1;
    if (a.personId > b.personId) return 1;
    if (a.startTime < b.startTime) return -1;
    if (a.startTime > b.startTime) return 1;
    return 0;
  });
  return events;
};

// --- Export Generated Data ---
export const resources: Person[] = generateResources(parameter.resourceCount);
export const events: Event[] = generateEvents(resources);

export const initialData: ScheduleData = {
  resources,
  events,
};
