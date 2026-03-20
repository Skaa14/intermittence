Feature: Gestion du profil intermittent

  Scenario: Configuration du profil
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Jean | 8      | 600    | 18000   | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then l'indemnité journalière estimée est affichée

  Scenario: Le nom du profil est affiché dans la carte AJ
    Given un profil est configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Jean | 8      | 600    | 18000   | 15/09/2026        |
    When l'écran d'accueil est affiché
    Then la carte AJ contient "Jean (Technicien)"

  Scenario: Le bouton Valider est désactivé si le nom est vide dans l'onboarding
    Given l'écran d'onboarding est affiché
    When je vide le champ nom
    Then le bouton Valider est désactivé

  Scenario: Erreur hors du Provider
    Then useProfils lance une erreur si utilisé hors du Provider
