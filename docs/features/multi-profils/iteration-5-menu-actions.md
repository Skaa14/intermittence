# Itération 5 — Menu actions (3 points) + édition profil

## Objectif

Ajouter le menu contextuel sur chaque profil dans le side panel : modifier, renommer, dupliquer, supprimer.

---

## Modifications

### 1. Ajouter l'icône 3 points sur chaque profil

**Fichier** : `components/PanneauProfils.tsx`

- Icône `ellipsis-vertical` (Ionicons) à droite de chaque item profil
- Au tap → affiche un menu d'actions

### 2. Menu d'actions

Le menu peut être un simple overlay positionné à côté de l'icône, ou un composant tiers (`react-native-popup-menu`) si ça simplifie.

**Actions** :

#### Modifier
- Ouvre `FormulaireProfil` en mode édition (`profilInitial` = profil sélectionné) dans le panel
- Tous les champs sont éditables (nom, annexe, salaire, heures, date anniversaire, taux CSG, Alsace-Moselle)
- `onValider` → `modifierProfil(id, nouveauProfil)`
- `onAnnuler` → retour à la liste

#### Renommer
- Dialogue simple avec TextInput pré-rempli du nom actuel
- `Alert.prompt` sur iOS (natif), custom modal sur Android (`Alert.prompt` n'existe pas sur Android)
- Valider → `modifierProfil(id, { ...profil, nom: nouveauNom })`

#### Dupliquer
- Dialogue avec TextInput pré-rempli du nom original (ex: "Jean (copie)")
- Crée un nouveau profil avec les mêmes champs + copie les données scopées (contrats, formations, enseignements)
- `dupliquerProfil(id, nouveauNom)`

#### Supprimer
- Dialogue de confirmation : "Supprimer ce profil et toutes ses données ? Cette action est irréversible."
- `Alert.alert` avec boutons Annuler / Supprimer
- `supprimerProfil(id)`
- Si c'est le profil actif → le contexte switch automatiquement vers un autre profil restant
- Si c'est le dernier profil → géré en itération 6 (onboarding)

---

## Points d'attention

- Le menu doit se fermer quand on tape en dehors
- Sur Android, les dialogues de renommage et duplication nécessitent un composant custom (Modal + TextInput) puisque `Alert.prompt` n'existe pas
- Tester le cas "dupliquer un profil puis vérifier que les contrats sont bien copiés et indépendants"
- Tester le cas "supprimer le profil actif → le profil actif change"
