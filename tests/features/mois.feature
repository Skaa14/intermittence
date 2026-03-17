Feature: Détail d'un mois

  Background:
    Given nous sommes le "15/06/2026"

  Scenario: Décomposition du calcul sans contrat
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 507    | 13800   | 01/04/2026        |
    And je suis sur le détail du mois d'index 0
    Then les jours calendaires affichés sont "30"
    And les jours travaillés affichés sont "0"
    And le délai d'attente affiché est "7"
    And la franchise congés payés affichée est "2"
    And les jours indemnisés affichés sont "21"

  Scenario: Contrat du mois affiché dans le détail
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 507    | 13800   | 01/04/2026        |
    And ces contrats existent
      | Employeur | Début      | Fin        | Heures | Salaire |
      | Théâtre   | 01/04/2026 | 30/04/2026 | 40     | 1500    |
    And je suis sur le détail du mois d'index 0
    Then le contrat de "Théâtre" affiche le salaire "1500 €"
    And le contrat de "Théâtre" affiche "40 h"

  Scenario: Affichage sans profil configuré
    Given le profil n'est pas configuré
    And je suis sur le détail du mois d'index 0
    Then le message "Configurez votre profil" est affiché

  Scenario: Totaux du mois affichés dans le détail
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 507    | 13800   | 01/04/2026        |
    And je suis sur le détail du mois d'index 0
    Then l'ARE versée affichée est "1221 €"
    And le salaire brut affiché est "0 €"
    And le total reçu affiché est "1221 €"

  Scenario: Franchise salaire affichée quand le salaire de référence est élevé
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 400    | 30000   | 01/04/2026        |
    And je suis sur le détail du mois d'index 0
    Then la franchise salaire affichée est "4"

  Scenario: Franchises nulles quand les heures travaillées sont zéro
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 0      | 13800   | 01/04/2026        |
    And je suis sur le détail du mois d'index 0
    Then les jours indemnisés affichés sont "23"

  Scenario: Exemple officiel 6 — AJ technicien annexe 8 avec 800h et 18000 euros
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 800    | 18000   | 01/04/2026        |
    And je suis sur le détail du mois d'index 0
    Then l'ARE versée affichée est "1360 €"
    And la franchise congés payés affichée est "2"

  Scenario: Exemple officiel 10 — Franchise CP musicien annexe 10 avec 176 jours travaillés
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 10     | 1760   | 20000   | 01/04/2026        |
    And je suis sur le détail du mois d'index 0
    Then la franchise congés payés affichée est "2"

  Scenario: Exemple officiel 12 — Plafond mensuel réduit l'ARE
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 800    | 18000   | 01/04/2026        |
    And ces contrats existent
      | Employeur | Début      | Fin        | Heures | Salaire |
      | Studio    | 01/05/2026 | 31/05/2026 | 80     | 4000    |
    And je suis sur le détail du mois d'index 1
    Then l'ARE versée affichée est "560 €"
    And le total reçu affiché est "4560 €"

  Scenario: Salaire mensuel seul dépasse le plafond — ARE nulle
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 800    | 18000   | 01/04/2026        |
    And ces contrats existent
      | Employeur | Début      | Fin        | Heures | Salaire |
      | Studio    | 01/05/2026 | 31/05/2026 | 40     | 5000    |
    And je suis sur le détail du mois d'index 1
    Then l'ARE versée affichée est "0 €"
    And le total reçu affiché est "5000 €"

  Scenario: Jours indemnisés nuls mais salaire dépasse le plafond
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 0      | 13800   | 01/04/2026        |
    And ces contrats existent
      | Employeur | Début      | Fin        | Heures | Salaire |
      | Studio    | 01/04/2026 | 30/04/2026 | 200    | 5000    |
    And je suis sur le détail du mois d'index 0
    Then les jours indemnisés affichés sont "0"
    And l'ARE versée affichée est "0 €"
    And le total reçu affiché est "5000 €"

  Scenario: Seuil de non-indemnisation atteint annexe 8
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 507    | 13800   | 01/04/2026        |
    And ces contrats existent
      | Employeur | Début      | Fin        | Heures | Salaire |
      | Studio    | 01/05/2026 | 31/05/2026 | 210    | 3000    |
    And je suis sur le détail du mois d'index 1
    Then les jours indemnisés affichés sont "0"
    And l'ARE versée affichée est "0 €"
    And le message seuil de non-indemnisation est affiché

  Scenario: Seuil de non-indemnisation atteint annexe 10
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 10     | 507    | 13800   | 01/04/2026        |
    And ces contrats existent
      | Employeur | Début      | Fin        | Heures | Salaire |
      | Studio    | 01/05/2026 | 31/05/2026 | 280    | 4000    |
    And je suis sur le détail du mois d'index 1
    Then les jours indemnisés affichés sont "0"
    And l'ARE versée affichée est "0 €"
    And le message seuil de non-indemnisation est affiché

  Scenario: Jours calendaires réduits le mois de la date d'anniversaire
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 507    | 13800   | 21/08/2026        |
    And je suis sur le détail du mois d'index 0
    Then les jours calendaires affichés sont "11"
    And les jours indemnisés affichés sont "2"

  Scenario: Jours calendaires complets le mois suivant la date d'anniversaire
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 507    | 13800   | 21/08/2026        |
    And je suis sur le détail du mois d'index 1
    Then les jours calendaires affichés sont "30"

  Scenario: Seuil de non-indemnisation non atteint annexe 8
    Given le profil est configuré
      | Annexe | Heures | Salaire | Date anniversaire |
      | 8      | 507    | 13800   | 01/04/2026        |
    And ces contrats existent
      | Employeur | Début      | Fin        | Heures | Salaire |
      | Studio    | 01/05/2026 | 31/05/2026 | 100    | 1500    |
    And je suis sur le détail du mois d'index 1
    Then le message seuil de non-indemnisation n'est pas affiché
    And l'ARE versée affichée n'est pas "0 €"
