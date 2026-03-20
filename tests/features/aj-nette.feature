Feature: Calcul de l'AJ nette (cotisations sociales)

  Scenario: AJ brute au plancher annexe 8 (cotisation retraite seule)
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 507    | 5000    | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ brute affichée est "38.00"
    And l'AJ nette affichée est "37.27"

  Scenario: AJ brute entre 31.96 et 60 euros (retraite complémentaire seule)
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 10     | 507    | 5000    | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ brute affichée est "44.00"
    And l'AJ nette affichée est "43.09"

  Scenario: AJ brute au-dessus de 60 euros (toutes cotisations, CSG standard)
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 800    | 18000   | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'AJ brute affichée est "64.78"
    And l'AJ nette affichée est "58.78"

  Scenario: AJ nette avec CSG réduit
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire | CSG    |
      | Test | 8      | 800    | 18000   | 15/09/2026        | reduit |
    When l'écran d'accueil est affiché
    Then l'AJ brute affichée est "64.78"
    And l'AJ nette affichée est "60.33"

  Scenario: AJ nette avec régime Alsace-Moselle
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire | Alsace-Moselle |
      | Test | 8      | 800    | 18000   | 15/09/2026        | oui            |
    When l'écran d'accueil est affiché
    Then l'AJ brute affichée est "64.78"
    And l'AJ nette affichée est "57.81"
