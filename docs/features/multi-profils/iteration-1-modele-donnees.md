# Itération 1 — Modèle de données + ProfilsContext

## Objectif

Poser les bases de données pour supporter plusieurs profils. Créer le `ProfilsContext` sans toucher aux contextes existants (contrats, formations, enseignements). L'app continue de fonctionner comme avant.

---

## Modifications

### 1. Ajouter `id` et `nom` au type `ProfilIntermittent`

**Fichier** : `types/profil.ts`

```ts
export interface ProfilIntermittent {
  id: string;
  nom: string;
  annexe: Annexe;
  dateAnniversaire: string;
  salaireReference: number;
  heuresTravaillees: number;
  tauxCSG: TauxCSG;
  alsaceMoselle: boolean;
}
```

### 2. Ajouter les clés dynamiques au storage

**Fichier** : `utils/storage.ts`

Nouvelles clés :
- `intermittence:profils` → `ProfilIntermittent[]` (liste de tous les profils)
- `intermittence:profilActifId` → `string` (id du profil sélectionné)
- `intermittence:profil:<id>:contrats` → `Contrat[]`
- `intermittence:profil:<id>:formations` → `Formation[]`
- `intermittence:profil:<id>:enseignements` → `Enseignement[]`

Ajouter un mécanisme de clés paramétrées :

```ts
function cleProfilData(profilId: string, type: "contrats" | "formations" | "enseignements"): string {
  return `intermittence:profil:${profilId}:${type}`;
}
```

Les anciennes clés plates (`intermittence:contrats`, etc.) restent fonctionnelles pour l'instant — elles seront remplacées en itération 2.

### 3. Nouveau `ProfilsContext`

**Fichier** : `contexts/ProfilsContext.tsx`

```ts
interface ProfilsContextType {
  profils: ProfilIntermittent[];
  profilActifId: string | null;
  profilActif: ProfilIntermittent | null; // dérivé
  chargementTermine: boolean;
  ajouterProfil: (profil: Omit<ProfilIntermittent, "id">) => void;
  modifierProfil: (id: string, profil: Omit<ProfilIntermittent, "id">) => void;
  supprimerProfil: (id: string) => void;
  dupliquerProfil: (id: string, nouveauNom: string) => void;
  changerProfilActif: (id: string) => void;
}
```

- Au montage : charge `profils` et `profilActifId` depuis le storage
- `profilActif` = `profils.find(p => p.id === profilActifId) ?? null`
- `supprimerProfil` : supprime le profil de la liste + ses clés scopées (contrats, formations, enseignements). Si c'est le profil actif, switch vers un autre profil restant
- `dupliquerProfil` : crée un nouveau profil avec un nouvel `id`, le `nom` fourni, et copie les mêmes champs. Copie aussi les données scopées dans les nouvelles clés storage
- Chaque mutation persiste dans le storage

### 4. Monter `ProfilsProvider` dans le layout

**Fichier** : `app/_layout.tsx`

Ajouter `ProfilsProvider` **au-dessus** des autres providers (contrats, formations, enseignements en dépendront en itération 2).

L'ancien `ProfilProvider` reste en place pour l'instant — il sera retiré quand les écrans auront migré.

---

## Ce qu'on ne fait PAS dans cette itération

- On ne modifie pas `ContratsContext`, `FormationsContext`, `EnseignementsContext`
- On ne touche pas à l'UI
- L'ancien `ProfilContext` reste fonctionnel

---

## Points d'attention

- Générer les `id` de profil avec `crypto.randomUUID()`
- L'ordre des providers dans `_layout.tsx` : `ProfilsProvider` doit être parent des autres contextes
- Tests unitaires : tester le `ProfilsContext` isolément (ajout, modification, suppression, duplication, changement de profil actif)
