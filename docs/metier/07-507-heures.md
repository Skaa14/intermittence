# Règle des 507 heures — Intermittents du spectacle

## Condition d'ouverture des droits

Pour ouvrir ou renouveler ses droits à l'ARE, un intermittent doit justifier d'au moins **507 heures travaillées** sur les **12 mois** précédant la fin du dernier contrat retenu.

Cela s'applique aussi bien à l'annexe 8 (techniciens) qu'à l'annexe 10 (artistes).

> Note historique : avant l'accord de 2016, l'annexe 10 avait une période de référence de 10 mois. C'est désormais 12 mois pour les deux annexes.

## Période de référence

La période de 12 mois est comptée **à rebours** depuis la **date de fin du dernier contrat** pris en compte pour l'ouverture des droits.

## Clause de rattrapage

Si l'intermittent a entre **338 et 506 heures**, une clause de rattrapage peut s'appliquer sous conditions, permettant une prolongation des droits.

## Décompte des heures

### Cachets
Un cachet = **12 heures**, quelle que soit la qualification donnée par l'employeur.

### Plafonds mensuels
| | Annexe 8 | Annexe 10 |
|---|---|---|
| Plafond heures/mois | 208h (250h si multi-employeurs, 260h sur dérogation DREETS) | 28 cachets |

### Heures d'enseignement
- Limitées à **70h** (120h si 50 ans et plus)
- Doivent être dispensées dans un établissement agréé
- **Non prises en compte** dans le calcul du SR et du NHT pour la formule de l'AJ

### Heures assimilées (périodes hors contrat)
- Congé maternité / adoption (indemnisé sécu) : **5h par jour**
- Accident du travail prolongé après le contrat : **5h par jour**
- Arrêt maladie ALD (hors contrat) : **5h par jour** (si au moins une ouverture de droit A8/A10 antérieure)
- Formation non rémunérée par l'assurance chômage : dans la limite de **338h** (enseignement + formation cumulés)
- Projet de Transition Professionnelle (PTP) : 1h PTP = 1h annexe, la fin du PTP est assimilée à une FCT

### Allongement de la période de référence
- Les périodes de **maladie** entre deux contrats (indemnisées sécu) **neutralisent** et allongent la période de 365 jours
- En **réadmission** : affiliation majorée de 42h par période de 30 jours au-delà du 365e jour (ex : 549h sur 395 jours)
- Limité à la FCT ayant servi à ouvrir le droit précédent (pas de réutilisation d'heures)

## Données nécessaires dans l'app

Pour vérifier cette condition, l'app a besoin de :
1. La liste des contrats avec **dates** et **heures**
2. La **date de fin du dernier contrat** (pour délimiter la période de 12 mois)

L'app calcule déjà le total des heures sur le dashboard. Il faudra à terme filtrer les contrats sur la bonne période de 12 mois.

## Sources

- [Être Intermittent — Guide complet Annexes 8 et 10](https://www.etreintermittent.com/comprendre-les-secrets-des-annexes-8-et-10-le-guide-complet-pour-les-intermittents-du-spectacle/)
- [ARTCENA — Règles d'indemnisation Annexes VIII et X](https://www.artcena.fr/precis-juridique/droit-du-travail/assurance-chomage/principales-regles-dindemnisation-au-titre-des-annexes-viii-et-x-de-la-convention-dassurance-chomage)
- Guide Intermittent France Travail (PDF dans `docs/metier/GUIDE-INTERMITTENT.pdf`)
