Feature: Modification d'un contrat

  Background:
    Given nous sommes le "15/06/2026"

  Scenario: Modifier l'employeur d'un contrat
    Given un contrat existant :
      | Employeur           | Début      | Fin        | Heures | Salaire |
      | Théâtre du Châtelet | 01/07/2026 | 15/07/2026 | 80     | 2000    |
    When je modifie le contrat avec l'employeur "Opéra de Paris"
    Then les contrats visibles sont :
      | Employeur      | Début      | Fin        | Heures | Salaire |
      | Opéra de Paris | 01/07/2026 | 15/07/2026 | 80     | 2000    |

  Scenario: Modifier le salaire d'un contrat
    Given un contrat existant :
      | Employeur       | Début      | Fin        | Heures | Salaire |
      | Studio Harcourt | 01/07/2026 | 15/07/2026 | 80     | 1500    |
    When je modifie le contrat avec un salaire de 2500 euros brut
    Then les contrats visibles sont :
      | Employeur       | Début      | Fin        | Heures | Salaire |
      | Studio Harcourt | 01/07/2026 | 15/07/2026 | 80     | 2500    |

  Scenario: Un contrat modifié avec des dates passées devient passé
    Given un contrat existant :
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Studio Futur | 01/07/2026 | 31/07/2026 | 60     | 2000    |
    When je modifie les dates du contrat "Studio Futur" en "01/01/2026" → "31/01/2026"
    And j'affiche les contrats passés
    Then le contrat "Studio Futur" porte le badge "Passé"
