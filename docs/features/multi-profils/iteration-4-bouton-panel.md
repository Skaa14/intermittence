# Itération 4 — Bouton profil + side panel basique

## Objectif

Ajouter le bouton profil dans le header et le side panel qui permet de voir la liste des profils, en sélectionner un, et en ajouter un nouveau.

---

## Modifications

### 1. Créer `components/BoutonProfil.tsx`

- Bouton rond (cercle ~36px)
- Affiche l'initiale du nom du profil actif (ou icône `person-circle-outline` si pas de profil)
- `onPress` → callback passé en prop

**Styles** : `styles/components/bouton-profil.styles.ts`

### 2. Créer `components/PanneauProfils.tsx`

**Comportement** :
- Slide depuis la droite avec animation (`Animated` de React Native)
- Overlay semi-transparent sur le reste de l'écran (tap → ferme le panel)
- Largeur : ~75% de l'écran (ou 300px max)

**Contenu** :
- **Titre** : "Mes profils"
- **Liste des profils** : chaque item affiche :
  - Nom du profil
  - "Annexe 8" ou "Annexe 10"
  - Surbrillance vert clair si c'est le profil actif
- **Bouton "Ajouter un profil"** (icône +) → ouvre `FormulaireProfil` en mode création (transition interne au panel : la liste est remplacée par le formulaire)
- **Tap sur un profil** → `changerProfilActif(id)` → ferme le panel

Le menu 3 points n'est PAS inclus dans cette itération.

**Props** :

```ts
interface PanneauProfilsProps {
  visible: boolean;
  onFermer: () => void;
}
```

**Styles** : `styles/components/panneau-profils.styles.ts`

### 3. Intégrer dans le layout des tabs

**Fichier** : `app/(tabs)/_layout.tsx`

- State `panneauOuvert` dans le composant `TabsLayout`
- `headerRight: () => <BoutonProfil onPress={() => setPanneauOuvert(true)} />`
- Rendre `<PanneauProfils visible={panneauOuvert} onFermer={() => setPanneauOuvert(false)} />`

### 4. Ne PAS afficher sur les écrans de détail

Les écrans `mois/[moisIndex]` et `detail-calcul-aj` ont leur propre `Stack.Screen` dans `app/_layout.tsx`. Ils ne passent pas par le tab layout, donc le bouton n'apparaît pas — rien à faire.

---

## Points d'attention

- Le panel se superpose au contenu, il ne pousse pas la page
- Gérer le back button Android (ferme le panel si ouvert)
- L'animation doit être fluide (~300ms, easeOut)
- Couleur de surbrillance du profil actif : ajouter un token dans `theme/colors.ts` (ex : `profilActif`)
- Quand l'utilisateur ajoute un profil via le formulaire dans le panel : `onValider` → `ajouterProfil` → revient à la liste des profils
- `onAnnuler` dans le formulaire → revient à la liste
- Vérifier le rendu sur iOS et Android (padding du header, safe area)
