# React Context — State partagé entre écrans

## Le problème
En React, les données (state) vivent dans un composant. Si l'onglet "Contrats" stocke la liste, comment "Accueil" et "Simulation" y accèdent ?

## La solution : Context
Un "sac de données" placé en haut de l'arbre de composants. Tous les enfants peuvent y accéder sans passer les props manuellement.

## Comment ça marche

### 1. Créer le Context
```tsx
const MonContext = createContext<MonType | null>(null);
```

### 2. Le Provider (fournit les données)
Un composant qui enveloppe l'app et rend les données disponibles :
```tsx
export function MonProvider({ children }) {
  const [data, setData] = useState([]);
  return (
    <MonContext.Provider value={{ data, setData }}>
      {children}
    </MonContext.Provider>
  );
}
```

### 3. Le hook custom (consomme les données)
Un raccourci pour accéder au Context depuis n'importe quel composant :
```tsx
export function useMonContext() {
  return useContext(MonContext);
}
```

### 4. Utilisation
```tsx
// Dans _layout.tsx (parent)
<MonProvider>
  <Stack />
</MonProvider>

// Dans n'importe quel écran (enfant)
const { data } = useMonContext();
```

## Quand utiliser Context vs autres solutions
- **Context** : données partagées simples (auth, thème, liste de contrats)
- **Zustand / Redux** : state complexe avec beaucoup de logique métier
- **useState seul** : données locales à un seul écran
