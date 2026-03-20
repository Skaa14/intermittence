import { render, screen, cleanup } from "@testing-library/react-native";
import { View } from "react-native";
import {
  buildInfoDelaiAttente,
  buildInfoFranchiseCP,
  buildInfoFranchiseSalaire,
  joursDeduits,
} from "../../components/InfoFranchises";
import { calculerIndemnisationMensuelle } from "../../utils/calculerIndemnisationMensuelle";
import { profil } from "../helpers/factories";

afterEach(cleanup);

function renderCalcul(calcul: React.ReactNode) {
  return render(<View testID="calcul">{calcul}</View>);
}

function calculText(calcul: React.ReactNode): string {
  renderCalcul(calcul);
  const el = screen.getByTestId("calcul");
  return el.props.children ? JSON.stringify(el) : "";
}

const profilA8 = profil({ annexe: "8", salaireReference: 18000, heuresTravaillees: 600 });
const profilA10 = profil({ annexe: "10", salaireReference: 25000, heuresTravaillees: 700 });

function moisDuProfil(p: typeof profilA8, index = 0) {
  return calculerIndemnisationMensuelle(p, [])[index];
}

describe("joursDeduits", () => {
  it("singulier pour 0", () => {
    expect(joursDeduits(0)).toBe("0 jour déduit");
  });

  it("singulier pour 1", () => {
    expect(joursDeduits(1)).toBe("1 jour déduit");
  });

  it("pluriel pour 2+", () => {
    expect(joursDeduits(3)).toBe("3 jours déduits");
  });
});

describe("buildInfoDelaiAttente", () => {
  it("affiche le titre et la description", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoDelaiAttente(mois);
    expect(info.titre).toBe("Délai d'attente");
    expect(info.description).toContain("7 jours");
  });

  it("affiche le nombre de jours déduits dans le calcul", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoDelaiAttente(mois);
    renderCalcul(info.calcul);
    expect(screen.getByTestId("calcul")).toHaveTextContent(/7 jours déduits/);
  });

  it("affiche le mois concerné", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoDelaiAttente(mois);
    renderCalcul(info.calcul);
    expect(screen.getByTestId("calcul")).toHaveTextContent(/1er mois/);
  });
});

describe("buildInfoFranchiseCP", () => {
  it("affiche le titre", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoFranchiseCP(mois, profilA8);
    expect(info.titre).toBe("Franchise congés payés");
  });

  it("affiche les heures travaillées et le diviseur annexe 8", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoFranchiseCP(mois, profilA8);
    renderCalcul(info.calcul);
    const el = screen.getByTestId("calcul");
    expect(el).toHaveTextContent(/600/);
    expect(el).toHaveTextContent(/annexe 8/);
  });

  it("utilise le diviseur 10 pour annexe 10", () => {
    const mois = moisDuProfil(profilA10, 0);
    const info = buildInfoFranchiseCP(mois, profilA10);
    renderCalcul(info.calcul);
    expect(screen.getByTestId("calcul")).toHaveTextContent(/annexe 10/);
  });

  it("affiche les jours de référence", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoFranchiseCP(mois, profilA8);
    renderCalcul(info.calcul);
    expect(screen.getByTestId("calcul")).toHaveTextContent(/75\.0/);
  });

  it("affiche le nombre de jours déduits ce mois", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoFranchiseCP(mois, profilA8);
    renderCalcul(info.calcul);
    expect(screen.getByTestId("calcul")).toHaveTextContent(/jours? déduits?/);
  });
});

describe("buildInfoFranchiseSalaire", () => {
  it("affiche le titre", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoFranchiseSalaire(mois, profilA8);
    expect(info.titre).toBe("Franchise salaire");
  });

  it("affiche le SJM calculé", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoFranchiseSalaire(mois, profilA8);
    renderCalcul(info.calcul);
    const sjm = (18000 * 8) / 600;
    expect(screen.getByTestId("calcul")).toHaveTextContent(new RegExp(sjm.toFixed(2)));
  });

  it("affiche le salaire de référence et le SMIC", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoFranchiseSalaire(mois, profilA8);
    renderCalcul(info.calcul);
    const el = screen.getByTestId("calcul");
    expect(el).toHaveTextContent(/18000/);
    expect(el).toHaveTextContent(/1801\.8/);
  });

  it("affiche le nombre de jours déduits ce mois", () => {
    const mois = moisDuProfil(profilA8, 0);
    const info = buildInfoFranchiseSalaire(mois, profilA8);
    renderCalcul(info.calcul);
    expect(screen.getByTestId("calcul")).toHaveTextContent(/jours? déduits?/);
  });

  it("affiche la répartition mensuelle quand franchise > 0", () => {
    const profilHautSalaire = profil({ salaireReference: 42000, heuresTravaillees: 507 });
    const mois = moisDuProfil(profilHautSalaire, 0);
    const info = buildInfoFranchiseSalaire(mois, profilHautSalaire);
    renderCalcul(info.calcul);
    expect(screen.getByTestId("calcul")).toHaveTextContent(/Répartition mensuelle/);
  });
});
