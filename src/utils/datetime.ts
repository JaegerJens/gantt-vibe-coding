import { TimeString } from "@/types";

export const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
export const totalMinutesInDay = 24 * 60;

export const moveTime = (time: TimeString, deltaTime: number): TimeString => {
  const [hours, minutes] = time.split(":").map(Number);
  let newHours = hours + Math.trunc(deltaTime);
  let newMinutes = Math.round(minutes + (deltaTime % 1) * 60);

  if (newMinutes >= 60) {
    newHours += 1;
    newMinutes -= 60;
  }
  if (newMinutes < 0) {
    newHours -= 1;
    newMinutes += 60;
  }
  return `${newHours}:${newMinutes}`;
};

export const timeToMinutes = (time: TimeString): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};