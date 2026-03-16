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
    And les jours indemnisés affichés sont "23"

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
    Then l'ARE versée affichée est "1337 €"
    And le salaire brut affiché est "0 €"
    And le total reçu affiché est "1337 €"
