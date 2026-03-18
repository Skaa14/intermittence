Feature: Formation professionnelle

  Background:
    Given nous sommes le "15/06/2026"

  Scenario: Formation option A ajoute des heures au compteur 507h
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 10     | 545    | 16200   | 15/03/2026        |
    And ces contrats existent
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Cie Lumière  | 01/04/2026 | 15/04/2026 | 400    | 12000   |
    And ces formations existent
      | Intitulé          | Début      | Fin        | Heures | Option         |
      | Technique vocale  | 01/05/2026 | 20/05/2026 | 90     | compterHeures  |
    Then le compteur affiche "490h / 507h"
    And le texte "dont 90h de formation" est visible

  Scenario: Formation option B ne change pas le compteur 507h
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 580    | 19800   | 15/03/2026        |
    And ces contrats existent
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Live Nation  | 01/04/2026 | 15/04/2026 | 400    | 12000   |
    And ces formations existent
      | Intitulé               | Début      | Fin        | Heures | Option    |
      | Habilitation électrique | 01/05/2026 | 20/05/2026 | 70     | garderARE |
    Then le compteur affiche "400h / 507h"
    And le texte "dont" n'est pas visible

  Scenario: Formation option A plafonnée à 338h
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 10     | 545    | 16200   | 15/03/2026        |
    And ces contrats existent
      | Employeur    | Début      | Fin        | Heures | Salaire |
      | Cie Lumière  | 01/04/2026 | 15/04/2026 | 200    | 6000    |
    And ces formations existent
      | Intitulé          | Début      | Fin        | Heures | Option        |
      | Formation longue  | 01/05/2026 | 30/05/2026 | 500    | compterHeures |
    Then le compteur affiche "538h / 507h"
    And le texte "dont 338h de formation" est visible

  Scenario: Formation option A réduit les jours indemnisés sur la vue mensuelle
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 10     | 545    | 16200   | 15/03/2026        |
    And ces formations existent
      | Intitulé         | Début      | Fin        | Heures | Option        |
      | Technique vocale | 01/05/2026 | 20/05/2026 | 90     | compterHeures |
    When je navigue vers le détail du mois 2
    Then les jours de formation affichent "-20 j"
