# Itération 2 — Scoper les contextes existants par profil

## Objectif

Faire en sorte que les données (contrats, formations, enseignements) soient isolées par profil. Quand l'utilisateur change de profil actif, chaque contexte recharge ses données depuis les clés scopées.

---

## Modifications

### 1. Adapter `ContratsContext`

**Fichier** : `contexts/ContratsContext.tsx`

- Importer `useProfils` depuis `ProfilsContext`
- Lire `profilActifId`
- Au montage et quand `profilActifId` change :
  - Vider le state local (`setContrats([])`)
  - Recharger depuis `intermittence:profil:<id>:contrats`
- Persister avec la clé scopée (`cleProfilData(profilActifId, "contrats")`)
- Si `profilActifId` est `null` → state vide, pas de chargement

### 2. Adapter `FormationsContext`

**Fichier** : `contexts/FormationsContext.tsx`

Même logique que `ContratsContext` avec `cleProfilData(profilActifId, "formations")`.

### 3. Adapter `EnseignementsContext`

**Fichier** : `contexts/EnseignementsContext.tsx`

Même logique avec `cleProfilData(profilActifId, "enseignements")`.

### 4. Retirer l'ancien `ProfilContext`

**Fichiers** :
- Supprimer `contexts/ProfilContext.tsx`
- `app/_layout.tsx` : retirer `ProfilProvider` de la chaîne de providers
- `app/(tabs)/index.tsx` : remplacer `useProfil()` par `useProfils()` — lire `profilActif` au lieu de `profil`, appeler `modifierProfil` au lieu de `mettreAJourProfil`
- Adapter tous les imports `useProfil` dans les écrans et tests

---

## Points d'attention

- C'est le changement le plus risqué : effet de bord sur tous les écrans qui consomment les contextes
- Bien tester le rechargement : créer 2 profils avec des contrats différents, switcher, vérifier que les bonnes données s'affichent
- Le `useEffect` de rechargement doit gérer le cas où `profilActifId` passe de `null` à une valeur (premier profil créé)
- Les `reinitialiserContrats` / `reinitialiserFormations` / `reinitialiserEnseignements` doivent aussi persister avec la clé scopée
- Pas de migration des anciennes clés plates : l'app n'est pas en prod et n'a pas d'utilisateurs, la perte de données n'est pas un problème. Les anciennes clés sont simplement ignorées
