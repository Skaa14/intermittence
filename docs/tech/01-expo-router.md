# Expo Router — Navigation par fichiers

## Le principe
Expo Router fonctionne comme Next.js : la structure des fichiers dans `app/` définit les routes.

## Structure
- `app/_layout.tsx` → Layout racine, enveloppe toute l'app (ici un Stack)
- `app/(tabs)/_layout.tsx` → Définit la barre d'onglets en bas
- `app/(tabs)/index.tsx` → Route `/` (onglet par défaut)
- `app/(tabs)/contrats.tsx` → Route `/contrats`

## Concepts clés

### Layout (`_layout.tsx`)
Un layout définit COMMENT les écrans s'affichent. Il ne s'affiche pas lui-même, il enveloppe ses enfants :
- **Stack** : les écrans s'empilent (comme les réglages du téléphone)
- **Tabs** : barre d'onglets en bas

### Groupe `(parenthèses)`
Un dossier entre parenthèses comme `(tabs)/` est un **groupe de routes**. Il ne crée pas de segment dans l'URL — c'est juste pour organiser les fichiers et leur donner un layout commun.

### File-based routing
Le nom du fichier = la route. Pas besoin de configurer un router manuellement.
`contrats.tsx` → accessible via `/contrats`.
