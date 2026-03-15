# Franchises et Carence — Intermittents du spectacle

## 1. Délai d'attente (carence fixe)

- **7 jours calendaires** à chaque ouverture de droits ou réexamen
- Exception : pas de délai d'attente si la réadmission intervient dans les 12 mois suivant la précédente ouverture

## 2. Différé spécifique

S'applique quand des indemnités supra-légales de rupture ont été versées :

```
Différé spécifique (jours) = (indemnités versées - indemnités légales) / SJM
```

- **Plafonné à 75 jours**
- Étalé sur la période d'indemnisation

## 3. Franchise Congés Payés

- **2.5 jours de congés par 24 jours travaillés** (déclarés sur les AEM)
- **Plafonnée à 30 jours** maximum
- Distribuée à raison de **2 jours/mois** si total ≤ 24 jours, **3 jours/mois** si > 24 jours

## 4. Franchise Salaire

```
Franchise Salaire (jours) = [(SR / SMIC_mensuel) × (SJM / (3 × SMIC_journalier))] - 27
```

Où :
- **SR** = Salaire de référence de la période d'affiliation
- **SMIC_mensuel** ≈ 1 801.80 € brut (2025)
- **SJM** = Salaire Journalier Moyen (voir ci-dessous)
- **SMIC_journalier** ≈ 59.13 € (2025)
- Résultat arrondi à l'entier supérieur
- **Non plafonnée**
- Si résultat ≤ 0, pas de franchise salaire
- Distribuée sur les **8 premiers mois** de l'indemnisation

## 5. Salaire Journalier Moyen (SJM)

Utilisé pour les franchises (pas directement dans la formule AJ) :

```
Annexe 8 : SJM = (SR × 8) / NHT
Annexe 10 : SJM = (SR × 10) / NHT
```

Le diviseur correspond à la durée d'une journée de travail :
- **8h** pour les techniciens (annexe 8)
- **10h** pour les artistes (annexe 10)

## 6. Calcul des jours indemnisés par mois

```
Jours indemnisables = jours calendaires du mois
                    - jours travaillés (convertis depuis les heures)
                    - franchise congés payés du mois
                    - franchise salaire du mois
                    - délai d'attente (si applicable, 1er mois)
```

**Conversion heures → jours non indemnisables :**
- Annexe 8 : `(heures du mois / 8) × 1.4`
- Annexe 10 : `(heures du mois / 10) × 1.3`

**Paiement mensuel = AJ × jours indemnisés du mois**

## 7. Seuil de non-indemnisation

Aucune indemnisation n'est due lorsqu'un seuil de jours de travail est atteint dans le mois :

| | Annexe 8 | Annexe 10 |
|---|---|---|
| Seuil | 26 jours de travail | 27 jours de travail |
| Jours de travail | Heures mensuelles / 8 | Heures mensuelles / 10 |

## 8. Plafond mensuel de cumul ARE + rémunérations

Le montant total (ARE à verser + rémunérations brutes du mois) ne doit pas dépasser **118% du PMSS** (Plafond Mensuel de la Sécurité Sociale).

- Si rémunérations seules > plafond : aucune indemnisation
- Si cumul < plafond : ARE non modifiée
- Si cumul > plafond : ARE recalculée = plafond - rémunérations brutes mensuelles

## Sources

- [Intermittent-application.fr — Délai d'attente et franchises](https://www.intermittent-application.fr/reglementation/delai_et_franchises)
- [MesCachets — Simulateur franchise](https://www.mescachets.com/simulation-differe-indemnisation-intermittent)
- [Être Intermittent — Guide complet Annexes 8 et 10](https://www.etreintermittent.com/comprendre-les-secrets-des-annexes-8-et-10-le-guide-complet-pour-les-intermittents-du-spectacle/)
- [Unédic — L'indemnisation des intermittents](https://www.unedic.org/publications/lindemnisation-des-intermittents-du-spectacle-par-lassurance-chomage)
- Guide Intermittent France Travail (PDF dans `docs/metier/GUIDE-INTERMITTENT.pdf`)
