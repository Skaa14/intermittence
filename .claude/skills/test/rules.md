# Règles de test

- Toujours vérifier que le spy/mock a bien été appelé avant de manipuler ses résultats
- Utiliser `act()` pour tout changement d'état (setState, hooks)
- `queryByText` pour vérifier l'absence (retourne `null`), `getByText` pour la présence (throw si absent)
- Extraire les helpers récurrents en fonctions dans le fichier steps (ex: `renderScreen`, `ouvrirFormulaire`, `selectDate`, `ajouterUnContrat`)
- Les scénarios Gherkin sont en français, les noms de fonctions helpers en français aussi
- Pas de commentaires dans le code de test (comme dans le reste du projet)
- Les valeurs de test (noms d'employeurs, montants, dates, etc.) doivent venir du Gherkin, jamais en dur dans les step definitions. Utiliser des regex avec captures (`/^le contrat "(.*)" est visible$/`) pour que les steps soient paramétrées.
- **Tests UI pour les écrans** : render le screen + fireEvent, jamais de tests renderHook. On teste le comportement tel que l'utilisateur le voit.
- **Tests unitaires pour la logique métier** : les fonctions pures de `utils/` (calculs, filtrage, formatage) se testent directement en `tests/unit/*.test.ts`, sans rendu React.
- **Toujours des datatables** pour les données de contrats dans les scénarios Gherkin. Ne pas passer les champs en paramètres inline dans les steps.
- **Toujours préférer `getByTestId`** pour cibler les éléments dans les step definitions (ex: `screen.getByTestId("input-date-debut")`). `getByText` / `getByPlaceholderText` sont fragiles car le texte peut changer. N'utiliser les queries par texte que pour vérifier un contenu dynamique capturé depuis le Gherkin.
