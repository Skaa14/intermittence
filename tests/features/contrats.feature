Feature: Gestion des contrats

  Scenario: Liste de contrats vide au démarrage
    Given le contexte des contrats est initialisé
    Then la liste des contrats est vide

  Scenario: Ajout d'un contrat
    Given le contexte des contrats est initialisé
    When j'ajoute un contrat pour "Théâtre du Rond-Point" de 2500 euros brut
    Then la liste contient 1 contrat
    And l'employeur du dernier contrat est "Théâtre du Rond-Point"
    And le salaire brut du dernier contrat est 2500

  Scenario: Suppression d'un contrat
    Given le contexte des contrats est initialisé
    And j'ajoute un contrat pour "Studio Canal" de 3000 euros brut
    When je supprime le dernier contrat
    Then la liste des contrats est vide

  Scenario: Erreur hors du Provider
    Then useContrats lance une erreur si utilisé hors du Provider
