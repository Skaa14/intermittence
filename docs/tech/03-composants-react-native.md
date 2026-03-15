# Composants React Native vs HTML

## Équivalences

| HTML            | React Native      | Notes                                    |
|-----------------|--------------------|------------------------------------------|
| `<div>`         | `<View>`           | Container de base, flexbox par défaut    |
| `<p>`, `<span>` | `<Text>`           | Tout texte DOIT être dans un `<Text>`    |
| `<input>`       | `<TextInput>`      | Champ de saisie                          |
| `<button>`      | `<Pressable>`      | Bouton (plus moderne que TouchableOpacity) |
| `<ul>` + `.map` | `<FlatList>`       | Liste scrollable, ne rend que le visible |
| `<img>`         | `<Image>`          | Images                                   |
| `<scroll>`      | `<ScrollView>`     | Zone scrollable                          |

## Styles

Pas de CSS classique. On utilise `StyleSheet.create()` :
- Propriétés en camelCase (`backgroundColor` au lieu de `background-color`)
- Flexbox par défaut, mais `flexDirection` est `column` (pas `row` comme en CSS web)
- Pas d'unités (px, rem) — tout est en "density-independent pixels"
- Les ombres sont différentes iOS/Android (`shadowColor` vs `elevation`)

## KeyboardAvoidingView
Composant qui pousse le contenu quand le clavier s'ouvre (sinon le clavier cache les inputs). Comportement différent iOS/Android d'où le `Platform.OS` check.
