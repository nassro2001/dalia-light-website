"use client";

import { useSyncExternalStore } from "react";
import { openStatus, weekSchedule } from "@/lib/hours";
import type { OpeningSlot } from "@/lib/site";

// Statut « ouvert / fermé » et tableau d'horaires, calculés côté navigateur (heure d'Abidjan).
// Rendu serveur : horaires sans statut ni jour surligné (le statut dépend de l'heure de la visite).

const MINUTE = 60_000;

function subscribe(callback: () => void) {
  const id = setInterval(callback, 30_000);
  return () => clearInterval(id);
}
/** Minute courante (stable pendant une minute, pour useSyncExternalStore). */
const getMinute = () => Math.floor(Date.now() / MINUTE);
const getServerMinute = () => null;

function useNowMinute() {
  return useSyncExternalStore(subscribe, getMinute, getServerMinute);
}

export function OpenBadge({ schedule }: { schedule: OpeningSlot[] }) {
  const minute = useNowMinute();
  if (minute === null) return <p className="min-h-6 text-sm text-fg-2" />;
  const status = openStatus(schedule, minute * MINUTE);
  return (
    <p className="flex min-h-6 items-center gap-2 text-sm">
      <span
        aria-hidden="true"
        className={`size-2 rounded-pill ${status.open ? "bg-flamme" : "bg-fg-2"}`}
        style={status.open ? { boxShadow: "0 0 10px 2px rgba(255,184,0,.6)" } : undefined}
      />
      <span className={status.open ? "font-semibold text-fg" : "text-fg-2"}>{status.label}</span>
    </p>
  );
}

export function HoursTable({ schedule }: { schedule: OpeningSlot[] }) {
  const minute = useNowMinute();
  const today = minute === null ? null : new Date(minute * MINUTE).getUTCDay();
  return (
    <dl className="divide-y divide-line border-y border-line text-sm">
      {weekSchedule(schedule).map((row) => {
        const isToday = row.day === today;
        return (
          <div key={row.day} className={`grid grid-cols-2 gap-4 py-2.5 ${isToday ? "font-semibold text-fg" : ""}`}>
            <dt className={isToday ? "" : "text-fg-2"}>
              {row.label}
              {isToday && <span className="sr-only"> (aujourd&apos;hui)</span>}
            </dt>
            <dd className={`tabular-nums ${row.open ? "text-fg" : "text-fg-2"}`}>{row.text}</dd>
          </div>
        );
      })}
    </dl>
  );
}
