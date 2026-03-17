Feature: Navigation vers le détail du calcul AJ

  Scenario: Le bouton de détail apparaît quand un profil est configuré
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 600    | 18000   | 15/09/2026        |
    Then le bouton "Voir le détail du calcul" est visible

  Scenario: Le bouton de détail navigue vers la page de détail
    Given l'écran d'accueil est affiché
    And je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 600    | 18000   | 15/09/2026        |
    When j'appuie sur le bouton de détail du calcul
    Then la navigation vers "/detail-calcul-aj" est déclenchée

  Scenario: Le bouton de détail n'apparaît pas sans profil
    Given l'écran d'accueil est affiché
    Then le bouton "Voir le détail du calcul" n'est pas visible
