---
name: commit
description: Stage, review en profondeur, commit et push les changements
disable-model-invocation: true
---

# Skill /commit — Review + Commit + Push

## Étape 1 : Vérification pré-staging

Avant de stager quoi que ce soit :

1. Lance `git status` pour voir tous les fichiers modifiés/ajoutés/supprimés
2. **Vérifie qu'aucun fichier sensible ne sera stagé** — bloque si tu trouves :
   - Fichiers d'environnement : `.env`, `.env.*` (sauf `.env.example`)
   - Secrets/credentials : `*.pem`, `*.key`, `*.p12`, `*.jks`, `*.p8`, `credentials.*`, `secret*`
   - Tokens/configs privées : fichiers contenant des API keys, tokens, mots de passe
3. Si des fichiers sensibles sont détectés :
   - Liste-les à l'utilisateur
   - Demande confirmation avant de continuer
   - Propose de les ajouter au `.gitignore`

## Étape 2 : Staging

Stage tous les changements avec `git add -A`.

## Étape 3 : Review approfondi

Lance un **sub-agent** (Agent tool, subagent_type: general-purpose) pour faire une review complète du diff stagé.

Donne-lui ce prompt :

```
Tu es un code reviewer senior. Analyse le diff git staged ci-dessous de manière approfondie.

Exécute `git diff --cached` pour obtenir le diff complet.
Lis aussi le fichier CLAUDE.md à la racine du projet pour connaître les conventions.

Fais une review complète couvrant :

1. **Bugs & erreurs logiques** — race conditions, off-by-one, null/undefined non gérés, mauvais types
2. **Sécurité** — injections, données sensibles en dur, XSS, failles OWASP
3. **Code mort & oublis** — console.log, TODO/FIXME orphelins, code commenté, imports inutilisés
4. **Conventions du projet** — respect du CLAUDE.md (pas de commentaires dans le code, conventional commits, etc.)
5. **Qualité & maintenabilité** — duplication, nommage, complexité excessive, abstractions prématurées
6. **Tests** — si du code fonctionnel est ajouté/modifié, vérifie que des tests correspondants existent dans le diff

Pour chaque problème trouvé, donne :
- Le fichier et la ligne
- La sévérité : BLOQUANT (doit être corrigé avant commit) ou SUGGESTION (amélioration non critique)
- Une explication courte
- Un fix proposé

Si tout est clean, réponds exactement : "LGTM"

Termine par un résumé : nombre de bloquants, nombre de suggestions.
```

## Étape 4 : Décision

### Si le sub-agent répond "LGTM" (aucun bloquant, aucune suggestion) :
1. Génère un message de commit **conventional commit** basé sur le diff
2. Commite avec ce message (ajoute le co-author Claude)
3. Push sur la branche courante avec `git push -u origin HEAD`
4. Affiche le résultat final

### Si le sub-agent trouve des **suggestions** et/ou des **bloquants** :
1. Présente tous les problèmes à l'utilisateur
2. Demande ce qu'il veut faire :
   - Corriger automatiquement (Claude applique les fixes)
   - Corriger manuellement (l'utilisateur corrige lui-même)
   - Ignorer et commit tel quel
3. Après corrections appliquées, lance `git add -A` pour stager
4. Demande à l'utilisateur : "Re-review ou commit direct ?"
   - Si re-review → relance l'étape 3 (une seule fois, pas de boucle)
   - Si commit direct → commit + push

## Format du commit

- **Conventional commits** : `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- Message concis (1 ligne titre, corps optionnel si beaucoup de changements)
- Ajoute toujours le co-author :
  ```
  Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
  ```
- Utilise un HEREDOC pour le message :
  ```bash
  git commit -m "$(cat <<'EOF'
  feat: description courte

  Corps optionnel avec détails.

  Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
  EOF
  )"
  ```

## Identité Git

- Remote : `git@github-perso:lucas-dormoy1/intermittence.git`
- Ne jamais modifier la config git globale ou locale
