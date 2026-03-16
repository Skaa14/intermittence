Feature: Gestion du profil intermittent

  Scenario: Pas de profil au démarrage
    Given l'écran d'accueil est affiché
    Then le bouton de configuration du profil est visible

  Scenario: Configuration du profil
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 600    | 18000   | 15/09/2026        |
    Then l'indemnité journalière estimée est affichée

  Scenario: Modification du profil existant
    Given l'écran d'accueil est affiché
    And je configure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 600    | 18000   | 15/09/2026        |
    When je reconfigure mon profil
      | Annexe | Heures | Salaire | Date anniversaire |
      | 10     | 510    | 22000   | 01/10/2026        |
    Then l'annexe affichée est "10"

  Scenario: Erreur hors du Provider
    Then useProfil lance une erreur si utilisé hors du Provider
