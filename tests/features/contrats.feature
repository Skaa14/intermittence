Feature: Gestion des contrats

  Background:
    Given nous sommes le "01/01/2026"

  Scenario: Aucun contrat au démarrage
    Given l'écran contrats est affiché
    Then le message "Aucun contrat ni formation. Ajoute ton premier contrat !" est visible

  Scenario: Ajout d'un contrat
    Given l'écran contrats est affiché
    When j'ajoute ce contrat
      | Employeur             | Début      | Fin        | Heures | Salaire |
      | Théâtre du Rond-Point | 01/03/2026 | 15/03/2026 | 80     | 2500    |
    Then le contrat "Théâtre du Rond-Point" est visible dans la liste

  Scenario: Suppression d'un contrat
    Given l'écran contrats est affiché
    And j'ajoute ce contrat
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Studio Canal | 01/01/2026 | 31/01/2026 | 120    | 3000    |
    When je supprime le contrat "Studio Canal"
    Then le message "Aucun contrat ni formation. Ajoute ton premier contrat !" est visible
