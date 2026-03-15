export function formatDateISO(date: Date): string {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${annee}-${mois}-${jour}`;
}

export function formatDate(date: Date): string {
  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();
  return `${jour}/${mois}/${annee}`;
}

export function parseDate(dateStr: string): Date | undefined {
  const [jour, mois, annee] = dateStr.split("/").map(Number);
  if (!jour || !mois || !annee) return undefined;
  const date = new Date(annee, mois - 1, jour);
  if (
    date.getDate() !== jour ||
    date.getMonth() !== mois - 1 ||
    date.getFullYear() !== annee
  ) {
    return undefined;
  }
  return date;
}
