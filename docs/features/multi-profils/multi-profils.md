# Feature : Multi-profils

## Objectif

Permettre de gérer plusieurs profils intermittents dans l'application. Chaque profil possède ses propres données (contrats, formations, enseignements). L'utilisateur peut switcher entre profils via un side panel accessible depuis le header.

---

## UX cible

- **Bouton profil** : icône ronde dans le header (haut à droite), visible sur tous les onglets (pas sur les écrans de détail calcul AJ / détail mois)
- **Side panel** : glisse depuis la droite, affiche la liste des profils (nom + annexe), le profil actif est surligné en vert clair
- **Ajouter un profil** : bouton "+" dans le side panel, ouvre le formulaire profil (avec boutons "Données de test" pour pré-remplir artiste/technicien)
- **Menu actions par profil** : icône trois points verticaux (`ellipsis-vertical`) sur chaque profil, ouvre un menu avec :
  - Modifier → ouvre le formulaire profil en mode édition (tous les champs : annexe, salaire, heures, etc.)
  - Renommer → dialogue avec TextInput pré-rempli
  - Dupliquer → dialogue avec TextInput pré-rempli du nom original, duplique le profil + toutes ses données
  - Supprimer → dialogue de confirmation (action irréversible — supprime le profil et toutes ses données)
- **Sélection** : tap sur un profil → switch le profil actif → ferme le panel
- **Nom du profil** : obligatoire (champ texte dans le formulaire)
- **Pas de limite** de nombre de profils
- **Premier lancement** : l'app force la création d'un premier profil avant d'être utilisable
- **Données de test** : boutons visibles uniquement dans le formulaire de création de profil (plus de banner, plus de section dédiée dans l'accueil)
- **Données scopées** : contrats, formations, enseignements sont isolés par profil

---

## Architecture actuelle (avant)

- 1 seul profil stocké sous `intermittence:profil`
- Contrats, formations, enseignements stockés avec des clés plates (`intermittence:contrats`, etc.)
- 4 contextes indépendants montés à la racine du `_layout.tsx`
- Formulaire profil embarqué dans `app/(tabs)/index.tsx` (~180 lignes de JSX)
- Section "Données de test" dans le dashboard + `DonneesTestContext` + banner mode test

## Architecture cible (après)

- Liste de profils stockée sous `intermittence:profils`
- Données scopées par profil : `intermittence:profil:<id>:contrats`, etc.
- Nouveau `ProfilsContext` qui gère la collection de profils et le profil actif
- Les contextes existants rechargent leurs données quand le profil actif change
- Formulaire profil extrait en composant réutilisable (avec champ nom + mode édition)
- Side panel comme composant indépendant
- Onboarding : création forcée du premier profil avant accès à l'app

---

## Itérations

| # | Titre | Doc |
|---|-------|-----|
| 1 | Modèle de données + ProfilsContext | [iteration-1-modele-donnees.md](iteration-1-modele-donnees.md) |
| 2 | Scoper les contextes existants par profil | [iteration-2-scoper-contextes.md](iteration-2-scoper-contextes.md) |
| 3 | Extraire le formulaire profil + champ nom | [iteration-3-formulaire-profil.md](iteration-3-formulaire-profil.md) |
| 4 | Bouton profil + side panel basique | [iteration-4-bouton-panel.md](iteration-4-bouton-panel.md) |
| 5 | Menu actions (3 points) + édition profil | [iteration-5-menu-actions.md](iteration-5-menu-actions.md) |
| 6 | Onboarding premier lancement | [iteration-6-onboarding.md](iteration-6-onboarding.md) |
| 7 | Données de test + nettoyage | [iteration-7-donnees-test.md](iteration-7-donnees-test.md) |

---

## Impact sur le dashboard (`index.tsx`)

- **Itération 3** : le formulaire inline disparaît, remplacé par `<FormulaireProfil />`
- **Itération 3** : le bouton "Configurer mon profil" disparaît — la création de profil passe par le panel (itération 4) ou l'onboarding (itération 6)
- **Itération 3** : la carte AJ affiche le nom du profil actif en plus de l'annexe/salaire/heures
- **Itération 7** : la section "Données de test" du dashboard est supprimée (remplacée par les boutons dans le formulaire de création)

---

## Décisions prises

- **Suppression de profil** : via menu trois points, avec dialogue de confirmation (action irréversible)
- **Modification de profil** : via menu trois points → "Modifier" → ouvre le formulaire complet (pas seulement le nom)
- **Nom du profil** : obligatoire
- **Limite de profils** : aucune
- **Premier lancement** : forcer la création d'un profil avant de pouvoir utiliser l'app
- **Side panel** : confirmé (on itérera si nécessaire)
- **Actions profil** : menu trois points verticaux (modifier, renommer, dupliquer, supprimer)
- **Données de test** : déplacées dans le formulaire de création de profil, suppression de la banner et du DonneesTestContext
