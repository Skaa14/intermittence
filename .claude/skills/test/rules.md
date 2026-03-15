# Règles de test

- Toujours vérifier que le spy/mock a bien été appelé avant de manipuler ses résultats
- Utiliser `act()` pour tout changement d'état (setState, hooks)
- `queryByText` pour vérifier l'absence (retourne `null`), `getByText` pour la présence (throw si absent)
- Extraire les helpers récurrents en fonctions dans le fichier steps (ex: `renderScreen`, `ouvrirFormulaire`, `selectDate`, `ajouterUnContrat`)
- Les scénarios Gherkin sont en français, les noms de fonctions helpers en français aussi
- Pas de commentaires dans le code de test (comme dans le reste du projet)
