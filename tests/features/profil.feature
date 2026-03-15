Feature: Gestion du profil intermittent

  Scenario: Pas de profil au démarrage
    Given le contexte du profil est initialisé
    Then le profil est vide

  Scenario: Mise à jour du profil
    Given le contexte du profil est initialisé
    When je configure mon profil en annexe "8" avec 600 heures et 18000 euros
    Then le profil existe
    And l'annexe du profil est "8"
    And les heures du profil sont 600
    And le salaire de référence du profil est 18000

  Scenario: Modification du profil existant
    Given le contexte du profil est initialisé
    And je configure mon profil en annexe "8" avec 600 heures et 18000 euros
    When je configure mon profil en annexe "10" avec 510 heures et 22000 euros
    Then l'annexe du profil est "10"
    And les heures du profil sont 510
    And le salaire de référence du profil est 22000

  Scenario: Suppression du profil
    Given le contexte du profil est initialisé
    And je configure mon profil en annexe "8" avec 600 heures et 18000 euros
    When je supprime le profil
    Then le profil est vide

  Scenario: Erreur hors du Provider
    Then useProfil lance une erreur si utilisé hors du Provider
