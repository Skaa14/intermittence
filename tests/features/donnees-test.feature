Feature: Données de test

  Scenario: Les boutons de démo sont visibles
    Given l'écran d'accueil est affiché
    Then les boutons de données de test sont visibles

  Scenario: Chargement du profil artiste
    Given l'écran d'accueil est affiché
    When je charge les données de test "artiste"
    Then l'indemnité journalière estimée est affichée

  Scenario: Chargement du profil technicien
    Given l'écran d'accueil est affiché
    When je charge les données de test "technicien"
    Then l'indemnité journalière estimée est affichée
