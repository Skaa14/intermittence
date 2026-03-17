Feature: Page de détail du calcul AJ

  Scenario: Affichage sans profil configuré
    Given la page de détail est affichée sans profil
    Then le message "Aucun profil configuré." est affiché

  Scenario: Affichage des composantes brutes annexe 8
    Given un profil annexe 8 avec 600h et 18000 euros
    When la page de détail est affichée
    Then le titre de section contient "Annexe 8"
    And la composante A affiche la formule "0.42 × 14400 + 0.05 × (18000 − 14400)"
    And la composante B affiche la formule "0.26 × 600 / 507"
    And la composante C affiche la formule "31.96 × 0.4"
    And l'AJ brute affichée en résumé est "62.41"
    And l'AJ nette affichée en résumé est "56.01"

  Scenario: Affichage des composantes brutes annexe 10
    Given un profil annexe 10 avec 600h et 18000 euros
    When la page de détail est affichée
    Then le titre de section contient "Annexe 10"
    And la composante A affiche la formule "0.36 × 13700 + 0.05 × (18000 − 13700)"
    And la composante C affiche la formule "31.96 × 0.7"

  Scenario: Plancher affiché quand AJ brute trop basse
    Given un profil annexe 8 avec 507h et 5000 euros
    When la page de détail est affichée
    Then le plafonnement est affiché
    And l'AJ brute affichée en résumé est "38.00"

  Scenario: Plafond affiché quand AJ brute trop haute
    Given un profil annexe 8 avec 507h et 500000 euros
    When la page de détail est affichée
    Then le plafonnement est affiché
    And l'AJ brute affichée en résumé est "174.80"

  Scenario: Affichage des cotisations avec CSG standard
    Given un profil annexe 8 avec 600h et 18000 euros
    When la page de détail est affichée
    Then la cotisation "Retraite complémentaire" est affichée
    And la cotisation "CSG (taux standard)" est affichée
    And la cotisation "CRDS" est affichée
    And le total des cotisations est affiché

  Scenario: Affichage des cotisations avec CSG réduit
    Given un profil annexe 8 avec 600h et 18000 euros et CSG réduit
    When la page de détail est affichée
    Then la cotisation "CSG (taux réduit)" est affichée
    And la cotisation "CRDS" est affichée

  Scenario: Affichage de la cotisation Alsace-Moselle
    Given un profil annexe 8 avec 600h et 18000 euros et Alsace-Moselle
    When la page de détail est affichée
    Then la cotisation "Alsace-Moselle" est affichée

  Scenario: Exonération CSG/CRDS quand AJ brute sous le seuil
    Given un profil annexe 10 avec 507h et 5000 euros
    When la page de détail est affichée
    Then le message d'exonération CSG/CRDS est affiché
    And la cotisation "Retraite complémentaire" est affichée

  Scenario: Affichage du SJM
    Given un profil annexe 8 avec 600h et 18000 euros
    When la page de détail est affichée
    Then le SJM affiche la formule "18000 × 8 / 600"

  Scenario: Les paramètres sont masqués par défaut
    Given un profil annexe 8 avec 600h et 18000 euros
    When la page de détail est affichée
    Then les paramètres de la composante A ne sont pas visibles

  Scenario: Affichage des paramètres au tap sur l'icône œil
    Given un profil annexe 8 avec 600h et 18000 euros
    When la page de détail est affichée
    And je tape sur l'icône paramètres de la composante A
    Then les paramètres de la composante A sont visibles
    And le paramètre "18000" avec la description "Salaire de référence" est affiché

  Scenario: Masquage des paramètres au second tap
    Given un profil annexe 8 avec 600h et 18000 euros
    When la page de détail est affichée
    And je tape sur l'icône paramètres de la composante A
    And je tape sur l'icône paramètres de la composante A
    Then les paramètres de la composante A ne sont pas visibles
