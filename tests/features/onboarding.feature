Feature: Onboarding premier lancement

  Scenario: L'écran d'onboarding affiche le formulaire sans bouton Annuler
    Given l'écran d'onboarding est affiché
    Then le message de bienvenue est affiché
    And le formulaire de profil est visible
    And le bouton Annuler n'est pas visible

  Scenario: Créer un profil depuis l'onboarding
    Given l'écran d'onboarding est affiché
    When je remplis le formulaire d'onboarding
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Jean | 8      | 600    | 18000   | 15/09/2026        |
    Then le profil est enregistré
