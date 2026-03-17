Feature: Saisie en cachets

  Background:
    Given nous sommes le "15/06/2026"
    And le profil est en annexe 10

  Scenario: Le toggle heures/cachets est visible pour annexe 10
    Given le formulaire de saisie est ouvert
    Then le toggle heures/cachets est visible

  Scenario: Le toggle heures/cachets est masqué pour annexe 8
    Given le profil est en annexe 8
    And le formulaire de saisie est ouvert
    Then le toggle heures/cachets est masqué

  Scenario: Le mode cachets initialise la valeur à 1
    Given le formulaire de saisie est ouvert
    When je sélectionne le mode "cachets"
    Then le champ heures contient "1"

  Scenario: Le placeholder revient à heures quand on resélectionne heures
    Given le formulaire de saisie est ouvert
    And je sélectionne le mode "cachets"
    When je sélectionne le mode "heures"
    Then le placeholder du champ est "Heures"

  Scenario: Ajout d'un contrat en cachets pluriel
    Given l'écran contrats est affiché
    When j'ajoute un contrat en cachets
      | Employeur | Début      | Fin        | Heures | Salaire | Type    |
      | Tournage  | 01/06/2026 | 30/06/2026 | 3      | 2000    | cachets |
    Then le contrat "Tournage" affiche "3 cachets"

  Scenario: Ajout d'un contrat avec un seul cachet singulier
    Given l'écran contrats est affiché
    When j'ajoute un contrat en cachets
      | Employeur | Début      | Fin        | Heures | Salaire | Type    |
      | Plateau   | 01/06/2026 | 30/06/2026 | 1      | 800     | cachets |
    Then le contrat "Plateau" affiche "1 cachet"

  Scenario: Ajout d'un contrat en heures affiche en heures
    Given l'écran contrats est affiché
    When j'ajoute un contrat en heures
      | Employeur | Début      | Fin        | Heures | Salaire |
      | Studio    | 01/06/2026 | 30/06/2026 | 40     | 1500    |
    Then le contrat "Studio" affiche "40 h"

  Scenario: Les boutons -/+ modifient le nombre de cachets
    Given le formulaire de saisie est ouvert
    And je sélectionne le mode "cachets"
    When j'appuie sur "+"
    Then le champ heures contient "2"
    When j'appuie sur "-"
    Then le champ heures contient "1"

  Scenario: Le bouton - ne descend pas en dessous de 1
    Given le formulaire de saisie est ouvert
    And je sélectionne le mode "cachets"
    When j'appuie sur "-"
    Then le champ heures contient "1"

  Scenario: Édition d'un contrat en cachets pré-remplit le mode cachets
    Given un contrat en cachets existe
      | Employeur | Début      | Fin        | Heures | Salaire | Type    |
      | Tournage  | 01/06/2026 | 30/06/2026 | 3      | 2000    | cachets |
    When je lance l'édition du contrat "Tournage"
    Then le mode "cachets" est actif
    And le champ heures contient "3"
