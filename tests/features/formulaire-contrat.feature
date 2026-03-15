Feature: Formulaire de saisie d'un contrat

  Scenario: Ouverture du formulaire
    Given l'écran contrats est affiché
    When j'appuie sur "Nouveau contrat"
    Then le formulaire de saisie est visible

  Scenario: Sélection des dates via le picker
    Given le formulaire de saisie est ouvert
    When je sélectionne la date début "2026-03-01"
    And je sélectionne la date fin "2026-03-15"
    Then la date début affichée est "01/03/2026"
    And la date fin affichée est "15/03/2026"

  Scenario: Date début après date fin réinitialise date fin
    Given le formulaire de saisie est ouvert
    And je sélectionne la date fin "2026-03-10"
    When je sélectionne la date début "2026-03-20"
    Then la date fin est réinitialisée

  Scenario: Date fin avant date début réinitialise date début
    Given le formulaire de saisie est ouvert
    And je sélectionne la date début "2026-03-20"
    When je sélectionne la date fin "2026-03-10"
    Then la date début est réinitialisée

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
    When je remplis le formulaire avec des données valides
    And j'appuie sur "Ajouter"
    Then le contrat apparaît dans la liste

  Scenario: Annulation de la suppression conserve le contrat
    Given un contrat existe dans la liste
    When j'appuie sur supprimer
    And j'annule la confirmation
    Then le contrat est toujours dans la liste

  Scenario: Confirmation de la suppression retire le contrat
    Given un contrat existe dans la liste
    When j'appuie sur supprimer
    And je confirme la suppression
    Then le contrat n'est plus dans la liste

  Scenario: Suppression web avec confirmation retire le contrat
    Given un contrat existe dans la liste sur le web
    When j'appuie sur supprimer sur le web
    And je confirme via window.confirm
    Then le contrat n'est plus dans la liste

  Scenario: Suppression web avec annulation conserve le contrat
    Given un contrat existe dans la liste sur le web
    When j'appuie sur supprimer sur le web
    And j'annule via window.confirm
    Then le contrat est toujours dans la liste
