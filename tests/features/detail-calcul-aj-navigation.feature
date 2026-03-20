Feature: Navigation vers le détail du calcul AJ

  Scenario: Le bouton de détail apparaît quand un profil est configuré
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 600    | 18000   | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then le bouton "Voir le détail du calcul" est visible

  Scenario: Le bouton de détail navigue vers la page de détail
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 600    | 18000   | 15/09/2026        |
    When l'écran d'accueil est affiché
    And j'appuie sur le bouton de détail du calcul
    Then la navigation vers "/detail-calcul-aj" est déclenchée
