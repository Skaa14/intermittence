Feature: Masquage des contrats passés

  Background:
    Given nous sommes le "15/06/2026"

  Scenario: Les contrats passés sont masqués par défaut
    Given ces contrats existent
      | Employeur       | Début      | Fin        | Heures | Salaire |
      | Ancien Théâtre  | 01/01/2026 | 31/01/2026 | 40     | 1500    |
      | Studio Actuel   | 01/06/2026 | 30/06/2026 | 40     | 1500    |
    Then le contrat "Studio Actuel" est visible
    And le contrat "Ancien Théâtre" n'est pas visible

  Scenario: Le bouton d'affichage indique le nombre de contrats passés
    Given ces contrats existent
      | Employeur       | Début      | Fin        | Heures | Salaire |
      | Ancien Théâtre  | 01/01/2026 | 31/01/2026 | 40     | 1500    |
      | Studio Actuel   | 01/06/2026 | 30/06/2026 | 40     | 1500    |
    Then le bouton affiche 1 contrat passé

  Scenario: Afficher les contrats passés
    Given ces contrats existent
      | Employeur       | Début      | Fin        | Heures | Salaire |
      | Ancien Théâtre  | 01/01/2026 | 31/01/2026 | 40     | 1500    |
      | Studio Actuel   | 01/06/2026 | 30/06/2026 | 40     | 1500    |
    When j'appuie sur le bouton d'affichage des contrats passés
    Then le contrat "Ancien Théâtre" est visible
    And le contrat "Ancien Théâtre" porte le badge "Passé"

  Scenario: Masquer les contrats passés après les avoir affichés
    Given ces contrats existent
      | Employeur       | Début      | Fin        | Heures | Salaire |
      | Ancien Théâtre  | 01/01/2026 | 31/01/2026 | 40     | 1500    |
      | Studio Actuel   | 01/06/2026 | 30/06/2026 | 40     | 1500    |
    And les contrats passés sont affichés
    When j'appuie sur le bouton de masquage des contrats passés
    Then le contrat "Ancien Théâtre" n'est pas visible

  Scenario: Message vide quand tous les contrats sont passés et masqués
    Given ces contrats existent
      | Employeur       | Début      | Fin        | Heures | Salaire |
      | Ancien Théâtre  | 01/01/2026 | 31/01/2026 | 40     | 1500    |
    Then le message "Aucun contrat en cours. Utilise le bouton ci-dessus pour afficher les contrats passés." est visible

  Scenario: Message vide quand aucun contrat n'existe
    Given aucun contrat n'existe
    Then le message "Aucun contrat. Ajoute ton premier contrat !" est visible

  Scenario: Pas de bouton quand il n'y a aucun contrat passé
    Given ces contrats existent
      | Employeur     | Début      | Fin        | Heures | Salaire |
      | Studio Actuel | 01/06/2026 | 30/06/2026 | 40     | 1500    |
    Then le bouton d'affichage des contrats passés n'existe pas
