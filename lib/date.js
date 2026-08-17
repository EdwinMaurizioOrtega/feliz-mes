// Helpers de fecha para el conteo de "mesversarios" (día 14 de cada mes).

const DAY_MS = 86400000;

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Cuenta sólo los meses cumplidos: del 1 al 13 todavía no cuenta el mes en curso.
export function monthsBetween(start, today) {
  let m = (today.getFullYear() - start.getFullYear()) * 12 + today.getMonth() - start.getMonth();
  if (today.getDate() < start.getDate()) m -= 1;
  return Math.max(0, m);
}

export function isAnniversaryDay(start, today) {
  return today.getDate() === start.getDate();
}

export function nextAnniversary(start, today) {
  const next = startOfDay(new Date(today.getFullYear(), today.getMonth(), start.getDate()));
  if (next <= startOfDay(today)) next.setMonth(next.getMonth() + 1);
  return next;
}

export function daysUntil(target, today) {
  return Math.round((startOfDay(target) - startOfDay(today)) / DAY_MS);
}

export function formatDuration(months) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} año${years > 1 ? 's' : ''}`);
  if (rest > 0) parts.push(`${rest} mes${rest > 1 ? 'es' : ''}`);
  return parts.join(' ');
}
