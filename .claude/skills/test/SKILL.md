---
name: test
description: Conventions et patterns de test du projet — charge ces règles avant d'écrire des tests
---

# Skill /test — Conventions de test

Charge ces règles AVANT d'écrire des tests. Ne relis pas les fichiers de test existants, tout est documenté ici.

## Fichiers à lire

Lis ces 3 fichiers dans `.claude/skills/test/` avant d'écrire le moindre test :

1. **patterns.md** — Structure des fichiers, patterns Gherkin, step definitions, types de tests
2. **mocks.md** — Catalogue des mocks existants (DateTimePicker, Alert, etc.), à réutiliser tel quel
3. **rules.md** — Règles à respecter dans tous les tests

## Mise à jour obligatoire

Quand tu crées un nouveau mock, un nouveau pattern réutilisable, ou une nouvelle règle de test :
- Mets à jour le fichier correspondant (`mocks.md`, `patterns.md`, ou `rules.md`)
- Ajoute le nouveau contenu à la suite de l'existant
