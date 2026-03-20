# Itération 7 — Données de test + nettoyage

## Objectif

Déplacer les données de test dans le formulaire de création de profil, supprimer la banner mode test et le `DonneesTestContext`.

---

## Modifications

### 1. Ajouter les boutons de test dans `FormulaireProfil`

**Fichier** : `components/FormulaireProfil.tsx`

Visibles uniquement en mode création (`profilInitial` absent) :
- Deux boutons en haut du formulaire : "Artiste (Anx. 10)" / "Technicien (Anx. 8)"
- Au tap → pré-remplit tous les champs du formulaire avec les données de test (nom, annexe, salaire référence, heures, date anniversaire, taux CSG, Alsace-Moselle)
- L'utilisateur peut modifier les valeurs avant de valider
- Le profil créé est un profil normal (pas de flag spécial)

Les fonctions `creerProfilArtiste()` / `creerProfilTechnicien()` de `utils/donneesTest.ts` sont réutilisées pour pré-remplir.

### 2. Pré-remplir aussi les données associées

Quand l'utilisateur valide un profil pré-rempli depuis les données de test, il faut aussi injecter les contrats/formations/enseignements de test dans le profil créé.

Approche : le `onValider` reçoit un champ supplémentaire indiquant si des données de test ont été chargées :

```ts
onValider: (profil: Omit<ProfilIntermittent, "id">, donneesTest?: "artiste" | "technicien") => void;
```

L'appelant (side panel ou onboarding) se charge d'appeler `reinitialiserContrats`, `reinitialiserFormations`, `reinitialiserEnseignements` avec les données de test correspondantes.

### 3. Supprimer `DonneesTestContext`

**Fichiers à supprimer** :
- `contexts/DonneesTestContext.tsx`

**Fichiers à nettoyer** :
- `app/_layout.tsx` : retirer `DonneesTestProvider`, `useDonneesTest`, `BannerModeTest`
- `app/(tabs)/index.tsx` : retirer l'import `useDonneesTest`, la section "Données de test" (carte avec boutons Artiste/Technicien)

**Clés storage à retirer** :
- `intermittence:modeTest`
- `intermittence:nomProfil`

Mettre à jour `utils/storage.ts` pour retirer ces clés du dictionnaire `CLES`.

### 4. Conserver `utils/donneesTest.ts`

Les fonctions de génération de données restent (`creerProfilArtiste`, `creerContratsArtiste`, etc.) — elles sont maintenant consommées par `FormulaireProfil` au lieu du contexte.

---

## Points d'attention

- Les boutons de test ne sont PAS visibles en mode édition (quand on modifie un profil existant)
- Le profil créé depuis les données de test est un profil normal, visible dans le side panel comme les autres
- Les tests qui dépendaient de `DonneesTestContext` ou de la banner devront être mis à jour
- Supprimer les styles de la banner dans `styles/root-layout.styles.ts`
