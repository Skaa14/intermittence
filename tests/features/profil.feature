Feature: Gestion du profil intermittent

  Scenario: Pas de profil au démarrage
    Given l'écran d'accueil est affiché
    Then le bouton de configuration du profil est visible

  Scenario: Configuration du profil
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Jean | 8      | 600    | 18000   | 15/09/2026        |
    Then l'indemnité journalière estimée est affichée

  Scenario: Le nom du profil est affiché dans la carte AJ
    Given l'écran d'accueil est affiché
    When je configure mon profil
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Jean | 8      | 600    | 18000   | 15/09/2026        |
    Then la carte AJ contient "Jean (Technicien)"

  Scenario: Modification du profil existant
    Given l'écran d'accueil est affiché
    And je configure mon profil
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Jean | 8      | 600    | 18000   | 15/09/2026        |
    When je reconfigure mon profil
      | Nom   | Annexe | Heures | Salaire | Date anniversaire |
      | Marie | 10     | 510    | 22000   | 01/10/2026        |
    Then l'annexe affichée est "10"

  Scenario: Le bouton Valider est désactivé si le nom est vide
    Given l'écran d'accueil est affiché
    When j'ouvre le formulaire profil
    Then le bouton Valider est désactivé

  Scenario: Erreur hors du Provider
    Then useProfils lance une erreur si utilisé hors du Provider
