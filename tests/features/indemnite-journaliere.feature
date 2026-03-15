Feature: Calcul de l'indemnité journalière (AJ)

  Scenario: Calcul AJ annexe 8 cas standard
    Given un profil annexe "8" avec 600 heures et 18000 euros de salaire
    When je calcule l'indemnité journalière
    Then l'AJ brute est 62.41 euros

  Scenario: Calcul AJ annexe 10 cas standard
    Given un profil annexe "10" avec 600 heures et 18000 euros de salaire
    When je calcule l'indemnité journalière
    Then l'AJ brute est 65.09 euros

  Scenario: Plancher annexe 8
    Given un profil annexe "8" avec 507 heures et 5000 euros de salaire
    When je calcule l'indemnité journalière
    Then l'AJ brute est 38.00 euros

  Scenario: Plancher annexe 10
    Given un profil annexe "10" avec 507 heures et 5000 euros de salaire
    When je calcule l'indemnité journalière
    Then l'AJ brute est 44.00 euros

  Scenario: Exemple 6 du guide France Travail (annexe 8, 800h, 18000 euros)
    Given un profil annexe "8" avec 800 heures et 18000 euros de salaire
    When je calcule l'indemnité journalière
    Then l'AJ brute est 64.78 euros

  Scenario: AJ avec heures au-dessus du seuil NHT annexe 8
    Given un profil annexe "8" avec 800 heures et 14400 euros de salaire
    When je calcule l'indemnité journalière
    Then l'AJ brute est 63.63 euros
