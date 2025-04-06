"use client";

import GanttChart from "@/components/GanttChart";
import Zoom from "@/components/Zoom";
import { ScheduleData } from "@/types";
import React from "react";

interface PlanningProps {
  dataPromise: Promise<ScheduleData>;
}

const Planning: React.FC<PlanningProps> = ({ dataPromise }) => {
  const [hourWidth, setHourWidth] = React.useState(80);
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Today&apos;s Schedule
      </h1>
      <Zoom size={hourWidth} onChange={setHourWidth} />
      <GanttChart dataPromise={dataPromise} hourWidth={hourWidth} />
    </>
  );
};

export default Planning;
