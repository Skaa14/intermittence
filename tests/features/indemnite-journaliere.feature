Feature: Calcul de l'indemnité journalière (AJ)

  Scenario: Calcul AJ annexe 8 cas standard
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 600    | 18000   | 15/09/2026        |
    Then l'AJ affichée est "62.41"

  Scenario: Calcul AJ annexe 10 cas standard
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 10     | 600    | 18000   | 15/09/2026        |
    Then l'AJ affichée est "65.09"

  Scenario: Plancher annexe 8
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 507    | 5000    | 15/09/2026        |
    Then l'AJ affichée est "38.00"

  Scenario: Plancher annexe 10
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 10     | 507    | 5000    | 15/09/2026        |
    Then l'AJ affichée est "44.00"

  Scenario: Exemple 6 du guide France Travail (annexe 8, 800h, 18000 euros)
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 800    | 18000   | 15/09/2026        |
    Then l'AJ affichée est "64.78"

  Scenario: AJ avec heures au-dessus du seuil NHT annexe 8
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 800    | 14400   | 15/09/2026        |
    Then l'AJ affichée est "63.63"
