# Plafond mensuel ARE + salaire

## Règle

Le cumul `salaire brut du mois + ARE versée` ne peut pas dépasser **1,18 × PMSS mensuel**.

- **PMSS 2025** : 3 864 € → plafond = 3 864 × 1,18 = **4 559,52 €**
- Le PMSS est révisé chaque année au 1er janvier (source : arrêté ministériel)

## Calcul

| Situation | ARE versée |
|---|---|
| Salaire ≥ plafond | 0 € |
| Salaire + ARE brute > plafond | plafond − salaire (arrondi à l'entier) |
| Salaire + ARE brute ≤ plafond | ARE brute |

## Exemple officiel 12 (Guide France Travail p.16)

Profil : annexe 8, 800h, salaire de référence 18 000 €
Mois de mai : contrat 80h à 4 000 €

- AJ ≈ 64,76 €/j (voir exemple 6)
- jours calendaires = 31, jours travaillés = floor((80/8)×1,4) = 14, franchiseCP = 2
- joursIndemnisés = 31 − 14 − 2 = 15
- ARE brute = round(64,76 × 15) = 971 €
- Cumul = 4 000 + 971 = 4 971 € > 4 559,52 €
- ARE versée = round(4 559,52 − 4 000) = **560 €**
- Total reçu = 4 000 + 560 = **4 560 €**
