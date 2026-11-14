import type { OpeningSlot } from "./site";

// Horaires des showrooms. Abidjan est à UTC+0 toute l'année (pas d'heure d'été) :
// l'heure locale du showroom se lit directement en UTC, quel que soit le fuseau du visiteur.

export const dayNames = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/** « 08:30 » → « 8 h 30 », « 19:00 » → « 19 h ». */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

/** Semaine du lundi au dimanche, pour le tableau d'horaires. */
export function weekSchedule(schedule: OpeningSlot[]) {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => {
    const slot = schedule.find((s) => s.days.includes(day));
    return {
      day,
      label: dayNames[day].charAt(0).toUpperCase() + dayNames[day].slice(1),
      text: slot ? `${formatTime(slot.opens)} – ${formatTime(slot.closes)}` : "Fermé",
      open: Boolean(slot),
    };
  });
}

export type OpenStatus =
  | { open: true; label: string }
  | { open: false; label: string };

/** Statut à un instant donné (millisecondes epoch), dans l'heure d'Abidjan. */
export function openStatus(schedule: OpeningSlot[], now: number): OpenStatus {
  const date = new Date(now);
  const today = date.getUTCDay();
  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes();

  const todaySlot = schedule.find((s) => s.days.includes(today));
  if (todaySlot && minutes >= toMinutes(todaySlot.opens) && minutes < toMinutes(todaySlot.closes)) {
    return { open: true, label: `Ouvert, ferme à ${formatTime(todaySlot.closes)}` };
  }
  if (todaySlot && minutes < toMinutes(todaySlot.opens)) {
    return { open: false, label: `Fermé, ouvre aujourd'hui à ${formatTime(todaySlot.opens)}` };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const day = (today + offset) % 7;
    const slot = schedule.find((s) => s.days.includes(day));
    if (slot) {
      const when = offset === 1 ? "demain" : dayNames[day];
      return { open: false, label: `Fermé, ouvre ${when} à ${formatTime(slot.opens)}` };
    }
  }
  return { open: false, label: "Fermé" };
}

/** Horaires au format schema.org (données structurées). */
export function openingHoursSpecification(schedule: OpeningSlot[]) {
  const schemaDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return schedule.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days.map((d) => `https://schema.org/${schemaDays[d]}`),
    opens: slot.opens,
    closes: slot.closes,
  }));
}
