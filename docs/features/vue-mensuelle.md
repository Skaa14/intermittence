# Feature : Vue mensuelle

## Objectif

Afficher mois par mois l'indemnité reçue sur la période d'indemnisation, en tenant compte des contrats saisis, des jours travaillés et du délai d'attente.

---

## Contexte technique

### Types existants

```ts
// types/contrat.ts
interface Contrat {
  id: string;
  employeur: string;
  dateDebut: string; // format JJ/MM/AAAA
  dateFin: string;   // format JJ/MM/AAAA
  heures: number;
  salaireBrut: number;
}

// types/profil.ts
type Annexe = "8" | "10";
interface ProfilIntermittent {
  annexe: Annexe;
  dateAnniversaire: string; // format JJ/MM/AAAA
  salaireReference: number;
  heuresTravaillees: number;
}
```

### Utilitaires existants

```ts
// utils/calculerAJ.ts
calculerAJ(annexe: Annexe, salaireReference: number, heuresTravaillees: number): number

// utils/date.ts
parseDate(dateStr: string): Date | undefined   // "JJ/MM/AAAA" → Date
formatDate(date: Date): string                 // Date → "JJ/MM/AAAA"
```

### Contextes React

```ts
// contexts/ContratsContext.tsx  → useContrats() → { contrats: Contrat[] }
// contexts/ProfilContext.tsx    → useProfil()   → { profil: ProfilIntermittent | null }
```

### Fichiers à modifier par étape

- **Étape 1** : `app/(tabs)/contrats.tsx` — formulaire de saisie des contrats
- **Étape 2** : nouveau `utils/calculerMoisIndemnisation.ts` + nouveau `app/(tabs)/vue-mensuelle.tsx` (renommé depuis `simulation.tsx`) + `app/(tabs)/_layout.tsx`
- **Étape 3** : nouveau `app/mois/[index].tsx`

---

## Modèle métier

### Période d'indemnisation
```
[profil.dateAnniversaire, profil.dateAnniversaire + 365j]
```

`dateAnniversaire` = date à laquelle les droits ont été ouverts (date anniversaire de la période N-1). C'est une date passée saisie par l'utilisateur.

### Contrainte sur les contrats

**Un contrat ne peut pas chevaucher deux mois calendaires.** Cette contrainte colle à la réalité des AEM (Attestations Employeur Mensuelles) : chaque AEM couvre un seul mois. Si un engagement réel s'étale sur plusieurs mois, il doit être saisi comme plusieurs contrats distincts (un par mois).

Cette contrainte doit être validée dans le formulaire de saisie de contrat.

### Calcul par mois (identique quel que soit l'état du mois)

```
contratsDuMois    = contrats dont les dates sont dans le mois
salaireDuMois     = Σ salaireBrut de chaque contrat du mois
heuresDuMois      = Σ heures de chaque contrat du mois
joursTravailles   = (heuresDuMois / 8) × 1.4   [annexe 8]
                  = (heuresDuMois / 10) × 1.3  [annexe 10]
joursCalendaires  = nombre de jours dans le mois
delaiAttente      = 7 si premier mois de la période, sinon 0
joursIndemnises   = joursCalendaires − joursTravailles − delaiAttente
areVersee         = AJ × max(0, joursIndemnises)
totalRecu         = salaireDuMois + areVersee
```

> Les franchises (CP et salaire) sont laissées de côté dans un premier temps.

### État d'un mois
- **Passé** : le mois est entièrement avant aujourd'hui
- **En cours** : le mois contient aujourd'hui
- **À venir** : le mois est entièrement après aujourd'hui

---

## Architecture

```
app/
├── (tabs)/
│   └── vue-mensuelle.tsx     ← (ex simulation.tsx) Liste des 12 mois
└── mois/
    └── [index].tsx           ← Détail swipeable d'un mois

utils/
└── calculerMoisIndemnisation.ts

tests/
├── features/
│   └── vue-mensuelle.feature
└── steps/
    └── vue-mensuelle.steps.tsx
```

---

## Plan d'implémentation

### Étape 1 — Validation formulaire contrat
- [ ] Ajouter une validation : dateDebut et dateFin doivent être dans le même mois calendaire
- [ ] Afficher un message d'erreur explicite si ce n'est pas le cas
- [ ] Écrire les tests Gherkin + step definitions

### Étape 2 — Liste des mois
- [ ] Créer `utils/calculerMoisIndemnisation.ts`
  - Retourne : `contratsDuMois`, `salaireDuMois`, `heuresDuMois`, `joursTravailles`, `delaiAttente`, `joursIndemnises`, `areVersee`, `totalRecu`
- [ ] Renommer `app/(tabs)/simulation.tsx` → `app/(tabs)/vue-mensuelle.tsx`
- [ ] Mettre à jour le label dans `app/(tabs)/_layout.tsx` : "Simulation" → "Vue mensuelle"
- [ ] Afficher les 12 mois de la période sous forme de cartes
- [ ] Chaque carte affiche : mois/année, badge état (Passé / En cours / À venir), ARE versée, salaire brut, total reçu
- [ ] Tap sur une carte → naviguer vers `/mois/[index]`
- [ ] Si profil non configuré → message d'invitation à configurer le profil
- [ ] Écrire les tests Gherkin + step definitions

### Étape 3 — Détail d'un mois (`mois/[index].tsx`)
- [ ] `FlatList` horizontal avec `pagingEnabled` sur les 12 mois
- [ ] Scroll automatique vers le mois de l'index passé en paramètre
- [ ] Swipe gauche/droite pour naviguer entre les mois
- [ ] Détail affiché par mois :
  - Liste des contrats du mois (salaire et heures réels, sans prorata)
  - Décomposition du calcul (jours calendaires, jours travaillés, délai d'attente, jours indemnisés)
  - ARE versée, salaire brut, total reçu

---

## À faire plus tard
- Franchises (congés payés et salaire) — formules documentées dans `docs/metier/06-franchises-et-carence.md`
- Plafond mensuel cumul ARE + rémunérations (118% PMSS)
- Renommer le champ "Date anniversaire" du profil en "Date d'ouverture des droits" pour plus de clarté
