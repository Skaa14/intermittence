# Investigation : écart jours indemnisables app vs France Travail

Date : 17/03/2026

## Contexte

Test avec de vraies données d'un intermittent annexe 10.
Profil : anniversaire 21 août, 591h, 5 374,90 € de SR, AJ nette = 43,58 €.

## Données comparées

| Mois | Contrats (heures, dates) | Jours app | ARE FT | Jours FT | Écart |
|---|---|---|---|---|---|
| Sept (m1) | 18h 150€, 3-24 sept | 26 | 1 002,34 € | 23 | -3 |
| Oct (m2) | 36h 330€ 1-5 oct + 18h 150€ 8-22 oct | 22 | 828,02 € | 19 | -3 |
| Nov (m3) | 18h 150€ 5-26 nov + 72h 705€ 8-11 nov | 19 | 828,02 € | 19 | 0 |
| Déc (m4) | 12h 100€, 3-17 déc | 30 | 1 045,92 € | 24 | -6 |

Jours FT calculés : ARE versée / AJ nette (43,58 €). Tous tombent sur des entiers exacts.

## Calcul actuel de l'app

Formule : `jours non indemnisables = floor(heures_du_mois / 10 × 1.3)`

| Mois | Heures | Work app | Franchise CP | Total déduit app | Total déduit FT | Extra FT |
|---|---|---|---|---|---|---|
| Sept | 18h | 2 | 2 | 4 | 7 | +3 |
| Oct | 54h | 7 | 2 | 9 | 12 | +3 |
| Nov | 90h | 11 | 0 | 11 | 11 | 0 |
| Déc | 12h | 1 | 0 | 1 | 7 | +6 |

Franchise CP de l'app : total = 6 (floor(59.1 × 2.5 / 24)), taux = 2/mois, épuisée au mois 2 (octobre).
Franchise salaire : 0 (SR trop bas, SJM = 90,95 € ≪ 3 × SMIC journalier).

## Ce qui est confirmé

1. **Novembre matche parfaitement** : floor((90/10) × 1.3) = floor(11.7) = 11. Et 30 - 11 = 19 = FT. Donc la formule floor(h/10 × 1.3) est correcte ET il n'y a aucune franchise appliquée ce mois-là.
2. **Le coefficient 1.3 est correct** pour l'annexe 10 (confirmé par le guide p.17 et l'exemple 12).
3. **La franchise salaire est bien 0** pour ce profil (SJM trop bas).

## Ce qui ne colle pas

### Contradiction novembre / décembre

Si les franchises sont à 0 en novembre (mois 3), elles le sont forcément aussi en décembre (mois 4). Or décembre a 6 jours de déduction supplémentaires inexpliqués (7 déduits au total, 1 seul vient du travail par la formule heures).

### Contradiction septembre / novembre

Les contrats "18h sur ~22 jours calendaires" apparaissent deux fois :
- Sept 3-24, 18h → contribue à 5 jours extra par rapport à la formule
- Nov 5-26, 18h → contribue à 0 jour extra

Si France Travail utilisait les jours de travail effectifs AEM (hypothèse explorée), les deux contrats similaires devraient produire un résultat similaire. Ce n'est pas le cas.

## Hypothèses explorées et rejetées

### 1. Franchise CP plus élevée (jours AEM dans la PRA)
Le guide p.14 dit que le total franchise CP utilise les "jours de travail effectifs indiqués sur l'AEM", pas heures/10. Si le total était plus élevé, le taux mensuel pourrait être 3 au lieu de 2.
**Rejeté** : même avec un taux de 3/mois, impossible d'avoir franchise = 0 en novembre et franchise = 6 en décembre.

### 2. Jours de travail effectifs AEM pour le calcul mensuel
Le guide p.14 distingue les "jours effectifs AEM" (pour contrats spectacle) de la formule heures/diviseur (pour PTP/U1). Hypothèse : France Travail utilise les jours AEM pour les déductions mensuelles aussi.
**Partiellement rejeté** : fonctionne pour sept, oct, déc pris individuellement, mais contradiction avec novembre (même type de contrat 18h/22j donne un résultat différent).

### 3. Arrondi par contrat (ceil au lieu de floor)
Tester ceil au lieu de floor, ou arrondir par contrat séparément plutôt que sur le total.
**Rejeté** : aucune combinaison d'arrondi ne réconcilie les 4 mois.

### 4. Franchise salaire non nulle (revenus hors spectacle)
Le guide p.14 dit que "salaires de la période de référence" pour la franchise salaire = total brut tous régimes. Si l'intermittent avait d'autres revenus...
**Rejeté** : avec un SJM de 90,95 €, il faudrait ~100 000 € de salaires totaux pour avoir une franchise salaire positive. Irréaliste.

### 5. Report de franchise (carryover)
Si des mois à forte activité ne peuvent pas consommer la franchise, le reliquat se reporte.
**Rejeté** : les mois ont toujours assez de jours restants pour consommer 2-3 jours de franchise.

## Pistes restantes

1. **Obtenir le détail de paiement France Travail** : l'espace personnel de l'intermittent montre un décompte mensuel avec les jours travaillés retenus, franchises appliquées, et jours indemnisés. C'est la seule source fiable.
2. **Consulter le règlement Unédic** (texte juridique complet, pas le guide simplifié) pour voir si la formule de calcul mensuel des jours non indemnisables utilise d'autres données que heures/diviseur.
3. **Vérifier si certains contrats sont déclarés en cachets** sur l'AEM (1 cachet = 12h mais pourrait avoir un traitement différent pour les jours non indemnisables).

## Note sur l'AJ nette

L'app calcule 43,57 € net, France Travail verse sur la base de 43,58 €. Écart connu de 0,01 € (bug d'arrondi mineur, non lié à cette investigation).
