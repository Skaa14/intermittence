Feature: Données de test

  Scenario: Les boutons de test sont visibles en mode création
    Given l'écran d'onboarding est affiché
    Then les boutons de données de test sont visibles

  Scenario: Application du profil artiste
    Given l'écran d'onboarding est affiché
    When j'applique le profil de test "artiste"
    Then le profil est enregistré avec le nom "Artiste — Annexe 10"

  Scenario: Application du profil technicien
    Given l'écran d'onboarding est affiché
    When j'applique le profil de test "technicien"
    Then le profil est enregistré avec le nom "Technicien — Annexe 8"
