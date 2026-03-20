# Itération 3 — Extraire le formulaire profil + champ nom

## Objectif

Sortir le formulaire profil de `app/(tabs)/index.tsx` dans un composant réutilisable, ajouter le champ `nom`, et supporter le mode édition complète. Prépare les itérations 4 et 5 qui réutiliseront ce formulaire.

---

## Modifications

### 1. Créer `components/FormulaireProfil.tsx`

Extraire les lignes ~306-482 de `app/(tabs)/index.tsx` (le bloc `{formulaireOuvert && (...)}`).

**Props** :

```ts
interface FormulaireProfilProps {
  profilInitial?: ProfilIntermittent;
  onValider: (profil: Omit<ProfilIntermittent, "id">) => void;
  onAnnuler: () => void;
}
```

- Si `profilInitial` est fourni → mode édition (pré-remplir les champs)
- Sinon → mode création (champs vides / valeurs par défaut)
- Ajouter un `TextInput` pour le `nom` du profil en haut du formulaire (obligatoire)
- Tous les champs sont éditables : nom, annexe, date anniversaire, salaire référence, heures travaillées, taux CSG, Alsace-Moselle

**Styles** : créer `styles/components/formulaire-profil.styles.ts` (extraire les styles correspondants depuis `styles/tabs/index.styles.ts`).

### 2. Simplifier `app/(tabs)/index.tsx`

- Remplacer le formulaire inline par `<FormulaireProfil />`
- La logique d'ouverture/fermeture (`formulaireOuvert`) reste dans l'écran
- Le `onValider` appelle `modifierProfil` du `ProfilsContext`
- Les state locaux du formulaire (`annexe`, `dateAnniversaire`, etc.) migrent dans le composant
- Le bouton "Configurer mon profil" (`btn-configurer-profil`) reste pour l'instant — il sera retiré à l'itération 6 (onboarding)

### 3. Adapter la carte AJ sur le dashboard

La carte AJ affiche maintenant le **nom du profil actif** en plus des infos existantes :

```
Annexe 8 — 600h — 18000 € — Anniversaire : 15/03/2026
```
devient :
```
Jean (Technicien) — Annexe 8 — 600h — 18000 € — Anniversaire : 15/03/2026
```

### 4. Créer le fichier de styles

**Fichier** : `styles/components/formulaire-profil.styles.ts`

Déplacer depuis `styles/tabs/index.styles.ts` tous les styles liés au formulaire : `label`, `input`, `row`, `annexeBtn`, `annexeBtnActive`, `annexeBtnText`, `annexeBtnTextActive`, `checkboxRow`, `checkbox`, `checkboxActive`, `checkboxCheck`, `checkboxLabel`, `btnAnnuler`, `btnAnnulerText`, `btnValider`, `btnValiderText`, `dateText`, `datePlaceholder`.

---

## Points d'attention

- Le composant ne dépend d'aucun contexte directement — il reçoit tout via props
- Les tests step definitions qui interagissent avec le formulaire (testID `btn-annexe-8`, `input-salaire-reference`, etc.) continuent de fonctionner puisque les testID sont préservés
- Le champ `nom` est obligatoire : le bouton "Valider" est désactivé si le nom est vide
