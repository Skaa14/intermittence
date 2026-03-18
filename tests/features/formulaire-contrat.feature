Feature: Formulaire de saisie d'un contrat

  Background:
    Given nous sommes le "01/01/2026"

  Scenario: Ouverture du formulaire
    Given l'écran contrats est affiché
    When j'appuie sur "Nouveau contrat"
    Then le formulaire de saisie est visible

  Scenario: Sélection des dates via le calendrier
    Given le formulaire de saisie est ouvert
    When je sélectionne la période "2026-03-01" → "2026-03-15"
    Then la période affichée est "1 mars → 15 mars"

  Scenario: Soumission avec champs manquants ne crée pas de contrat
    Given le formulaire de saisie est ouvert
    When j'appuie sur "Ajouter" sans remplir le formulaire
    Then aucun contrat n'est ajouté

  Scenario: Soumission avec champs manquants affiche les erreurs visuelles
    Given le formulaire de saisie est ouvert
    When j'appuie sur "Ajouter" sans remplir le formulaire
    Then tous les champs ont une bordure rouge

  Scenario: La bordure rouge disparaît quand on corrige un champ
    Given le formulaire de saisie est ouvert
    And j'appuie sur "Ajouter" sans remplir le formulaire
    When je remplis le champ "Employeur"
    Then le champ "Employeur" n'a plus de bordure rouge

  Scenario: Ajout d'un contrat complet via le formulaire
    Given le formulaire de saisie est ouvert
    When je remplis le formulaire avec les données suivantes
      | Employeur      | Début      | Fin        | Heures | Salaire |
      | Opéra de Paris | 01/03/2026 | 15/03/2026 | 80     | 2500    |
    And j'appuie sur "Ajouter"
    Then le contrat "Opéra de Paris" apparaît dans la liste

  Scenario: Annulation de la suppression conserve le contrat
    Given un contrat existe dans la liste
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Studio Canal | 01/03/2026 | 15/03/2026 | 40     | 1500    |
    When j'appuie sur supprimer
    And j'annule la confirmation
    Then le contrat "Studio Canal" est toujours dans la liste

  Scenario: Confirmation de la suppression retire le contrat
    Given un contrat existe dans la liste
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Studio Canal | 01/03/2026 | 15/03/2026 | 40     | 1500    |
    When j'appuie sur supprimer
    And je confirme la suppression
    Then le contrat "Studio Canal" n'est plus dans la liste

  Scenario: Suppression web avec confirmation retire le contrat
    Given un contrat existe dans la liste sur le web
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Studio Canal | 01/03/2026 | 15/03/2026 | 40     | 1500    |
    When j'appuie sur supprimer sur le web
    And je confirme via window.confirm
    Then le contrat "Studio Canal" n'est plus dans la liste

  Scenario: Suppression web avec annulation conserve le contrat
    Given un contrat existe dans la liste sur le web
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Studio Canal | 01/03/2026 | 15/03/2026 | 40     | 1500    |
    When j'appuie sur supprimer sur le web
    And j'annule via window.confirm
    Then le contrat "Studio Canal" est toujours dans la liste
