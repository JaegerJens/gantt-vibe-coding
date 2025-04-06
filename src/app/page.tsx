import { fetchData } from "@/data/EventsData";
import React from "react";
import Planning from "./Planning";

export default function HomePage() {
  const dataPromise = fetchData();

  return (
    <main className="mx-auto sm:p-6 lg:p-8">
      <Planning dataPromise={dataPromise} />
    </main>
  );
}
