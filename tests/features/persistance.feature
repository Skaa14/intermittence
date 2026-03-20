Feature: Persistance des données

  Scenario: Les contrats et le profil sont restaurés au redémarrage
    Given je charge les données de test "technicien" sur l'écran d'accueil
    When l'application redémarre
    Then l'indemnité journalière estimée est affichée
    And le dashboard affiche des contrats

  Scenario: Le profil configuré manuellement est restauré au redémarrage
    Given je configure un profil sur l'écran d'accueil
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 10     | 700    | 18000   | 01/01/2026        |
    When l'application redémarre
    Then l'indemnité journalière estimée est affichée

  Scenario: La réinitialisation supprime les données persistées
    Given je charge les données de test "artiste" sur l'écran d'accueil
    When le storage est vidé et l'application redémarre
    Then aucun profil n'est configuré
    And le dashboard affiche "0" contrats
