Feature: Heures d'enseignement

  Background:
    Given nous sommes le "15/06/2026"

  Scenario: Ajouter un enseignement via le formulaire
    When j'ouvre le formulaire
    And je sélectionne le type "enseignement"
    And je saisis un enseignement
      | Établissement       | Début      | Fin        | Heures | Salaire |
      | Conservatoire Lyon  | 01/06/2026 | 15/06/2026 | 40     | 1800    |
    Then l'enseignement "Conservatoire Lyon" est visible dans la liste

  Scenario: Les heures d'enseignement comptent pour les 507h sur le dashboard
    Given un profil configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 600    | 18000   | 15/03/2026        |
    And un contrat existe
      | Employeur   | Début      | Fin        | Heures | Salaire |
      | Cie Lumière | 01/04/2026 | 15/04/2026 | 400    | 6000    |
    And un enseignement existe
      | Établissement      | Début      | Fin        | Heures | Salaire |
      | Conservatoire Lyon | 01/02/2026 | 15/02/2026 | 60     | 2000    |
    Then le dashboard affiche "460h / 507h"
    And le texte "dont 60h d'enseignement" est visible

  Scenario: Les heures d'enseignement sont plafonnées à 70h
    Given un profil configuré
      | Nom  | Annexe | Heures | Salaire | Date anniversaire |
      | Test | 8      | 600    | 18000   | 15/03/2026        |
    And un contrat existe
      | Employeur   | Début      | Fin        | Heures | Salaire |
      | Cie Lumière | 01/04/2026 | 15/04/2026 | 400    | 6000    |
    And un enseignement existe
      | Établissement      | Début      | Fin        | Heures | Salaire |
      | Conservatoire Lyon | 01/02/2026 | 15/02/2026 | 90     | 3000    |
    Then le dashboard affiche "470h / 507h"
    And le texte "dont 70h d'enseignement" est visible

  Scenario: Un enseignement passé est grisé
    Given un enseignement existe
      | Établissement      | Début      | Fin        | Heures | Salaire |
      | Conservatoire Lyon | 01/01/2026 | 31/01/2026 | 40     | 1800    |
    And les éléments passés sont affichés
    Then l'enseignement "Conservatoire Lyon" porte le badge "Passé"
