Feature: Calcul de l'indemnité journalière (AJ)

  Scenario: Calcul AJ annexe 8 cas standard
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 600    | 18000   | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ affichée est "62.41"

  Scenario: Calcul AJ annexe 10 cas standard
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 10     | 600    | 18000   | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ affichée est "65.09"

  Scenario: Plancher annexe 8
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 507    | 5000    | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ affichée est "38.00"

  Scenario: Plancher annexe 10
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 10     | 507    | 5000    | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ affichée est "44.00"

  Scenario: Exemple 6 du guide France Travail (annexe 8, 800h, 18000 euros)
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 800    | 18000   | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ affichée est "64.78"

  Scenario: AJ avec heures au-dessus du seuil NHT annexe 8
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 800    | 14400   | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ affichée est "63.63"

  Scenario: Carte AJ masquée si droits non ouverts
    Given un profil sans droits ARE est configuré
      | Nom  | Annexe |
      | Test | 8      |
    When l'écran d'accueil est affiché
    Then la carte AJ n'est pas visible
