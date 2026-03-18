export interface Enseignement {
  id: string;
  etablissement: string;
  dateDebut: string; // format JJ/MM/AAAA
  dateFin: string;
  heures: number;
  salaireBrut: number;
}
