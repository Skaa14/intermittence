Feature: Simulation de l'ouverture de droits

  Scenario: La section simulation n'apparaît pas sous 507h
    Given ces contrats existent
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Studio Alpha | 01/03/2026 | 31/03/2026 | 200    | 6000    |
    And un profil annexe "8" est configuré
    When l'écran d'accueil est affiché
    Then la section simulation n'est pas visible

  Scenario: La section simulation apparaît quand 507h atteint avec profil
    Given ces contrats existent
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Prod Janvier | 05/01/2026 | 20/01/2026 | 300    | 9000    |
      | Festival Mai | 01/05/2026 | 15/05/2026 | 250    | 7500    |
    And un profil annexe "8" est configuré
    When l'écran d'accueil est affiché
    Then la section simulation est visible
    And le chip "Festival Mai — 15/05/2026" est visible

  Scenario: Sélectionner un contrat affiche les résultats de simulation
    Given ces contrats existent
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Prod Janvier | 05/01/2026 | 20/01/2026 | 300    | 9000    |
      | Festival Mai | 01/05/2026 | 15/05/2026 | 250    | 7500    |
    And un profil annexe "8" est configuré
    When l'écran d'accueil est affiché
    And je sélectionne le chip "Festival Mai — 15/05/2026"
    Then les résultats de simulation sont affichés

  Scenario: Message si pas de profil
    Given ces contrats existent
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Prod Janvier | 05/01/2026 | 20/01/2026 | 300    | 9000    |
      | Festival Mai | 01/05/2026 | 15/05/2026 | 250    | 7500    |
    And aucun profil n'est configuré
    When l'écran d'accueil est affiché
    Then un message invite à configurer le profil pour simuler
