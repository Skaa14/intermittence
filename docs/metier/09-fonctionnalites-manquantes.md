# Fonctionnalités manquantes — Audit doc métier vs app

Audit réalisé le 17/03/2026 en comparant les fiches `docs/metier/` et le guide France Travail avec le code actuel (`utils/`, `contexts/`, `app/`).

---

## 1. ~~Persistance des données~~ ✅ Implémenté

Contrats et profil sont persistés via `AsyncStorage` avec hydratation au démarrage.

**Fichiers** : `utils/storage.ts`, `contexts/ContratsContext.tsx`, `contexts/ProfilContext.tsx`

---

## 2. ~~Seuil de non-indemnisation~~ ✅ Implémenté

Quand les jours de travail bruts (heures/8 annexe 8, heures/10 annexe 10) atteignent ou dépassent le seuil (26 j annexe 8, 27 j annexe 10), `joursIndemnises` est forcé à 0 et un message explicatif s'affiche dans le détail du mois.

**Fichiers** : `utils/reglementation.ts` (constantes), `utils/calculerIndemnisationMensuelle.ts` (logique), `app/mois/[moisIndex].tsx` (affichage)

---

## 3. AJ nette (cotisations sociales)

**Règle** (fiche `04-indemnite-journaliere.md`, section "AJ nette") :

L'AJ brute subit des prélèvements selon trois tranches :

| AJ brute | Cotisations |
|---|---|
| ≤ 31,96 € | Aucune |
| > 31,96 € et ≤ 60 € | Retraite complémentaire : 0,93% du SJM |
| > 60 € | Retraite complémentaire (0,93% du SJM) + CSG (6,2% ou 3,8%) + CRDS (0,5%) |

Cas particulier : régime local Alsace-Moselle → cotisation supplémentaire de 1,50%.

**Exemple** : AJ brute = 64,76 €, SJM = 180 €
- Retraite complémentaire = 180 × 0,93% = 1,67 €
- CSG = 64,76 × 6,2% = 4,02 €
- CRDS = 64,76 × 0,5% = 0,32 €
- AJ nette ≈ 64,76 − 1,67 − 4,02 − 0,32 ≈ 58,75 €

**État actuel** : `calculerAJ.ts` renvoie uniquement l'AJ brute. Aucun calcul net n'existe.

**Impact** : l'utilisateur voit un montant plus élevé que ce qu'il touchera réellement. Sur 12 mois, l'écart peut représenter plusieurs centaines d'euros.

---

## 4. Filtrage des contrats sur la période de référence (507h)

**Règle** (fiche `07-507-heures.md`, section "Période de référence") :

Les 507 heures doivent être justifiées sur les **12 mois précédant la fin du dernier contrat** (FCT). Les contrats en dehors de cette fenêtre ne comptent pas.

**État actuel** : le dashboard (`app/(tabs)/index.tsx`, ligne 39) additionne les heures de **tous** les contrats enregistrés, sans filtre de date. La fiche elle-même le note : *"Il faudra à terme filtrer les contrats sur la bonne période de 12 mois"* (`07-507-heures.md`, ligne 52).

**Exemple** : un intermittent a 300h sur des contrats de 2024 et 250h en 2025. Le dashboard affiche 550h (seuil atteint), mais si la FCT est en décembre 2025, seules les 250h de la fenêtre janvier-décembre 2025 comptent → seuil non atteint.

**Fichier concerné** : `app/(tabs)/index.tsx` (barre de progression 507h)

---

## 5. Cachets (1 cachet = 12 heures)

**Règle** (fiche `07-507-heures.md`, section "Cachets") :

> Un cachet = 12 heures, quelle que soit la qualification donnée par l'employeur.

Les artistes (annexe 10) raisonnent généralement en cachets, pas en heures. Le formulaire contrat ne propose que la saisie en heures.

**Plafonds mensuels** :

| Annexe 8 | Annexe 10 |
|---|---|
| 208h (250h multi-employeurs) | 28 cachets (= 336h) |

**Solution** : ajouter un champ `type: "heures" | "cachets"` dans l'interface `Contrat`. Si cachet sélectionné, convertir automatiquement en heures (× 12) pour les calculs tout en affichant en cachets dans l'UI.

**Fichier concerné** : `types/contrat.ts`, `app/(tabs)/contrats.tsx`

---

## 6. Clause de rattrapage (338-506h)

**Règle** (fiche `05-date-anniversaire.md`, section "Clause de rattrapage") :

Si à la date anniversaire l'intermittent justifie de **338 à 506 heures** (au lieu des 507 requises), une prolongation de **6 mois maximum** peut être accordée sous conditions :
- 5 ans d'ancienneté dans les 10 ans précédant la FCT
- Ne pas remplir les conditions ARE tous régimes
- En faire la demande sous 30 jours

Pendant la clause de rattrapage :
- Même AJ que le droit précédent
- Franchises CP et salaire : **forfait de 2 jours chacune par mois** (non reportables)

**État actuel** : l'app ne modélise que la période standard de 12 mois. Aucune notion de clause de rattrapage.

**Impact** : cas fréquent chez les intermittents qui "loupent" de peu le seuil. L'app pourrait au minimum **alerter** quand le total est entre 338 et 506h pour informer de l'existence de cette clause.

---

## 7. Différé spécifique (indemnités supra-légales)

**Règle** (fiche `06-franchises-et-carence.md`, section 2) :

```
Différé spécifique (jours) = (indemnités versées − indemnités légales) / SJM
```

- Plafonné à 75 jours
- S'applique quand des indemnités de rupture supra-légales ont été versées
- Étalé sur la période d'indemnisation

**État actuel** : non implémenté. Le modèle `ProfilIntermittent` ne contient pas de champ pour ces indemnités.

**Impact** : rare pour les intermittents (CDD, pas de licenciement classique), mais existe dans le cadre de certaines ruptures.

**Priorité** : basse — concerne peu d'intermittents.

---

## 8. Heures assimilées

**Règle** (fiche `07-507-heures.md`, section "Heures assimilées") :

Certaines périodes hors contrat comptent pour les 507h :
- Congé maternité/adoption : **5h par jour** (indemnisé sécu)
- Accident du travail prolongé : **5h par jour**
- Arrêt maladie ALD hors contrat : **5h par jour**
- Formation non rémunérée par l'assurance chômage : dans la limite de **338h**
- PTP (Projet de Transition Pro) : 1h PTP = 1h annexe

**État actuel** : le formulaire contrat ne permet que de saisir des contrats de travail. Aucun moyen de déclarer des périodes assimilées.

**Impact** : peut faire basculer un intermittent de "seuil non atteint" à "droits ouverts".

---

## 9. Heures d'enseignement (plafond)

**Règle** (fiche `07-507-heures.md`, section "Heures d'enseignement") :

- Limitées à **70h** (120h si 50 ans et plus)
- Doivent être dispensées dans un établissement agréé
- **Non prises en compte** dans le calcul du SR et du NHT pour la formule AJ

**État actuel** : pas de distinction entre heures d'enseignement et heures de travail classique. Un intermittent qui saisit 120h d'enseignement verrait ces heures comptées dans le SR/NHT de l'AJ, ce qui est incorrect.

**Priorité** : moyenne — concerne les intermittents qui enseignent en parallèle (assez courant).

---

## Priorisation suggérée

| Priorité | Feature | Justification |
|---|---|---|
| ~~1~~ | ~~Persistance des données~~ ✅ | Implémenté |
| ~~2~~ | ~~Seuil de non-indemnisation~~ ✅ | Implémenté |
| 3 | Filtrage 507h sur période de référence | Fausse la barre de progression du dashboard |
| 4 | AJ nette | Information concrète pour l'utilisateur |
| 5 | Cachets | Confort UX majeur pour les artistes |
| 6 | Clause de rattrapage | Information utile, cas fréquent |
| 7 | Heures d'enseignement | Correctif de calcul pour un sous-ensemble d'utilisateurs |
| 8 | Heures assimilées | Complétude métier |
| 9 | Différé spécifique | Cas rare |
