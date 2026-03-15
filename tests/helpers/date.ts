export const ddmmyyyyToIso = (ddmmyyyy: string): string => {
  const [jour, mois, annee] = ddmmyyyy.split("/");
  return `${annee}-${mois}-${jour}`;
};
