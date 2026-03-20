Feature: Panneau de sélection de profils

  Scenario: Le bouton profil affiche l'initiale du profil actif
    Given un profil actif avec le nom "Marie"
    Then le bouton profil affiche "M"

  Scenario: Le bouton profil affiche une icône quand il n'y a pas de profil
    Given aucun profil n'existe
    Then le bouton profil affiche l'icône par défaut

  Scenario: Ouverture du panneau de profils
    Given un profil actif avec le nom "Marie"
    When j'appuie sur le bouton profil
    Then le panneau de profils est visible
    And le titre "Mes profils" est affiché

  Scenario: La liste des profils est affichée
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
      | Pierre | 10     |
    When j'appuie sur le bouton profil
    Then je vois le profil "Marie" avec "Annexe 8"
    And je vois le profil "Pierre" avec "Annexe 10"

  Scenario: Le profil actif est surligné
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
      | Pierre | 10     |
    When j'appuie sur le bouton profil
    Then le profil "Marie" est marqué comme actif

  Scenario: Sélection d'un autre profil
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
      | Pierre | 10     |
    When j'appuie sur le bouton profil
    And je sélectionne le profil "Pierre"
    Then le panneau se ferme
    And le bouton profil affiche "P"

  Scenario: Fermeture du panneau en tapant sur l'overlay
    Given un profil actif avec le nom "Marie"
    When j'appuie sur le bouton profil
    And je tape sur l'overlay
    Then le panneau se ferme

  Scenario: Ajout d'un profil via le formulaire dans le panneau
    Given un profil actif avec le nom "Marie"
    When j'appuie sur le bouton profil
    And j'appuie sur le bouton ajouter un profil
    Then le formulaire de création est affiché

  Scenario: Le menu actions s'ouvre au tap sur les 3 points
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
      | Pierre | 10     |
    When j'appuie sur le menu 3 points du profil "Marie"
    Then le menu actions est visible avec les options "Modifier" "Renommer" "Dupliquer" "Supprimer"

  Scenario: Le menu se ferme au tap sur l'overlay du menu
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
    When j'appuie sur le menu 3 points du profil "Marie"
    And je tape sur l'overlay du menu
    Then le menu actions n'est plus visible

  Scenario: Modifier un profil via le menu actions
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
    When j'appuie sur le menu 3 points du profil "Marie"
    And je choisis "Modifier" dans le menu
    Then le formulaire d'édition est affiché avec le nom "Marie"

  Scenario: Renommer un profil via le menu actions
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
    When j'appuie sur le menu 3 points du profil "Marie"
    And je choisis "Renommer" dans le menu
    Then le dialogue de renommage s'affiche avec "Marie"

  Scenario: Dupliquer un profil via le menu actions
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
    When j'appuie sur le menu 3 points du profil "Marie"
    And je choisis "Dupliquer" dans le menu
    Then le dialogue de duplication s'affiche avec "Marie (copie)"

  Scenario: Supprimer un profil via le menu actions
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
      | Pierre | 10     |
    When j'appuie sur le menu 3 points du profil "Pierre"
    And je choisis "Supprimer" dans le menu
    Then une alerte de confirmation s'affiche pour "Pierre"

  Scenario: Confirmer la suppression d'un profil
    Given les profils suivants existent
      | Nom    | Annexe |
      | Marie  | 8      |
      | Pierre | 10     |
    When j'appuie sur le menu 3 points du profil "Pierre"
    And je choisis "Supprimer" dans le menu
    And je confirme la suppression
    Then le profil "Pierre" n'est plus dans la liste
