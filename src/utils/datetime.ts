import { TimeString } from "@/data/Events";

export const moveTime = (time: TimeString, deltaTime: number): TimeString => {
  const [hours, minutes] = time.split(":").map(Number);
  const deltaHours =  deltaTime >= 0 ? Math.floor(deltaTime) : Math.ceil(deltaTime);
  let newHours = hours + deltaHours;
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