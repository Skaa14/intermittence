Feature: Filtrage des contrats sur la période de référence (507h)

  Scenario: Seuls les contrats dans la fenêtre de 12 mois comptent
    Given ces contrats existent
      | Employeur       | Début      | Fin        | Heures | Salaire |
      | Ancien Théâtre  | 01/01/2025 | 31/01/2025 | 300    | 9000    |
      | Studio Récent   | 01/06/2026 | 30/06/2026 | 250    | 7500    |
    When l'écran d'accueil est affiché
    Then la barre de progression affiche "250h / 507h"
    And la période de référence est affichée

  Scenario: Tous les contrats dans la fenêtre sont comptés
    Given ces contrats existent
      | Employeur        | Début      | Fin        | Heures | Salaire |
      | Prod Janvier     | 05/01/2026 | 20/01/2026 | 200    | 6000    |
      | Tournée Mars     | 01/03/2026 | 15/03/2026 | 150    | 4500    |
      | Festival Juin    | 01/06/2026 | 15/06/2026 | 200    | 6000    |
    When l'écran d'accueil est affiché
    Then la barre de progression affiche "550h / 507h"
    And le message "Seuil atteint" est visible

  Scenario: Aucun contrat enregistré
    Given aucun contrat n'est enregistré
    When l'écran d'accueil est affiché
    Then la barre de progression affiche "0h / 507h"
    And la période de référence n'est pas affichée
