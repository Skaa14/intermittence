# Itération 6 — Onboarding premier lancement

## Objectif

Forcer la création d'un premier profil avant de pouvoir utiliser l'app. Gérer aussi le cas où l'utilisateur supprime son dernier profil.

---

## Modifications

### 1. Écran d'onboarding

Si `profils` est vide au chargement (ou après suppression du dernier profil), l'app affiche le `FormulaireProfil` en plein écran. Aucun onglet n'est accessible tant qu'un profil n'existe pas.

**Implémentation** : dans `app/(tabs)/_layout.tsx` (ou `app/_layout.tsx`), conditionner le rendu sur `profils.length > 0` :

```tsx
if (chargementTermine && profils.length === 0) {
  return <FormulaireProfilOnboarding />;
}
```

Le formulaire d'onboarding utilise `FormulaireProfil` avec un wrapper plein écran (pas dans le side panel).

### 2. Retirer le bouton "Configurer mon profil" du dashboard

**Fichier** : `app/(tabs)/index.tsx`

Le bloc `{!profil && !formulaireOuvert && (<Pressable testID="btn-configurer-profil" ...>)}` n'a plus de raison d'être : si l'utilisateur arrive sur le dashboard, c'est qu'il a déjà un profil.

Retirer ce bloc et la logique associée.

### 3. Suppression du dernier profil

Quand l'utilisateur supprime son dernier profil depuis le side panel (itération 5), `profils` devient vide → l'app retombe sur l'écran d'onboarding automatiquement (le conditionnel du point 1 s'active).

### 4. Back button Android

Sur l'écran d'onboarding, le back button Android ne fait rien (on ne peut pas quitter l'onboarding sans créer un profil).

---

## Points d'attention

- Attendre que `chargementTermine` soit `true` avant de décider d'afficher l'onboarding (sinon flash pendant le chargement async)
- Le formulaire d'onboarding est en mode création uniquement (pas de `profilInitial`)
- Les données de test ne sont pas encore dans le formulaire (itération 7) — l'utilisateur doit remplir manuellement pour l'instant
- Tester le cycle complet : premier lancement → créer profil → supprimer profil → retour onboarding → recréer profil
