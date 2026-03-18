const MOIS_COURTS = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

export function formatDateCourt(date: Date): string {
  return `${date.getDate()} ${MOIS_COURTS[date.getMonth()]}`;
}

export function formatRangeCourt(debut: Date, fin: Date): string {
  return `${formatDateCourt(debut)} → ${formatDateCourt(fin)}`;
}
