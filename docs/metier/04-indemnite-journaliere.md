# Calcul de l'Indemnité Journalière (AJ) — Intermittents du spectacle

## Données nécessaires

Pour calculer l'AJ, il faut :

- **SR** (Salaire de Référence) : somme des salaires bruts sur la période de référence (12 mois précédant la fin du dernier contrat)
- **NHT** (Nombre d'Heures Travaillées) : total des heures sur la même période
- **Annexe** : 8 (techniciens/ouvriers) ou 10 (artistes)
- **AJ_min** : constante de base revalorisée périodiquement (31,96 € depuis le 1er juillet 2023)

## Formule : AJ = A + B + C

### Annexe 8 (Techniciens)

```
A = AJ_min × [0.42 × min(SR, 14400) + 0.05 × max(SR - 14400, 0)] / 5000
B = AJ_min × [0.26 × min(NHT, 720) + 0.08 × max(NHT - 720, 0)] / 507
C = AJ_min × 0.40
```

### Annexe 10 (Artistes)

```
A = AJ_min × [0.36 × min(SR, 13700) + 0.05 × max(SR - 13700, 0)] / 5000
B = AJ_min × [0.26 × min(NHT, 690) + 0.08 × max(NHT - 690, 0)] / 507
C = AJ_min × 0.70
```

## Arrondis

Chaque composante A, B et C est **tronquée au centime** (partie entière inférieure) avant d'être sommée. C'est la convention utilisée par France Travail dans ses exemples de calcul (Guide Intermittent, exemple 6).

Les cotisations sociales (retraite complémentaire, CSG, CRDS) sont également tronquées au centime avant déduction de l'AJ brute.

### Limitation connue : précision de l'AJ nette

Un écart de ~0.01 € peut exister entre l'AJ nette calculée par l'app et celle affichée par France Travail. La règle d'arrondi exacte utilisée par France Travail pour les cotisations n'est pas documentée dans le guide officiel. L'exemple 6 du guide confirme la troncature pour les composantes A, B, C, mais ne précise pas la méthode pour les cotisations. Des points de données supplémentaires (avec détail brut + cotisations) permettraient de résoudre cet écart.

## Plancher et plafond

| Paramètre | Annexe 8 | Annexe 10 |
|---|---|---|
| AJ minimum (plancher) | 38 €/jour brut | 44 €/jour brut |
| AJ maximum (plafond) | 174,80 €/jour brut | 174,80 €/jour brut |
| Seuil SR (coude formule) | 14 400 € | 13 700 € |
| Seuil NHT (coude formule) | 720 h | 690 h |

Si A+B+C < plancher → on applique le plancher.
Si A+B+C > plafond → on applique le plafond.

## AJ nette

Trois tranches de cotisations sociales :

| AJ brute | Cotisations retenues |
|---|---|
| ≤ 31,96 € | Aucune cotisation. AJ nette = AJ brute |
| > 31,96 € et ≤ 60 € | Retraite complémentaire : 0,93% du SJM |
| > 60 € | Retraite complémentaire (0,93% du SJM) + CSG (6,2% ou 3,8% selon barème fiscal) + CRDS (0,5%) |

Régime local Alsace-Moselle : cotisation supplémentaire de 1,50%.

## Sources

- [Être Intermittent — Calcul du taux d'indemnisation](https://www.etreintermittent.com/comprendre-et-calculer-le-taux-dindemnisation-dun-intermittent-du-spectacle/)
- [ARTCENA — Calcul et versement de l'allocation](https://www.artcena.fr/guide/droits-et-pratiques/embaucher-et-travailler/le-regime-dassurance-chomage-des-intermittents-du-spectacle/le-calcul-et-le-versement-de-lallocation)
- [France Travail — Montant des allocations Culture et Spectacle](https://cultureetspectacle.francetravail.fr/je-me-fais-accompagner/montant-de-l-allocation)
- [Unédic — Dossier de synthèse Intermittents du spectacle (PDF)](https://www.unedic.org/storage/uploads/2023/07/24/Dossier20de20synthC3A8se20Intermittents20du20spectacle_uid_64be8b31b1a34.pdf)
- Guide Intermittent France Travail (PDF dans `docs/metier/GUIDE-INTERMITTENT.pdf`)
