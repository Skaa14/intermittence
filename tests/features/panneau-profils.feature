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
