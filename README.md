# 🎯 APVJ - Tableau de Bord d'Administration

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> **Plateforme moderne de gestion et de supervision en temps réel**

Tableau de bord d'administration complet pour la gestion des alertes, le suivi des actions et la visualisation des indicateurs clés de performance. Interface intuitive construite avec les technologies web les plus récentes.

## 📹 Démonstration

### 🎬 Vidéo de Présentation

[![Voir la démo vidéo](https://img.shields.io/badge/▶️_Regarder_la_Démo-Google_Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/14_MNsUn2EJ4rIeFdK6B_wxNowsbR8k-q/view)

> 💡 **Cliquez sur le bouton ci-dessus** pour visionner la démonstration complète du tableau de bord (80 MB - qualité HD)

---

## ✨ Fonctionnalités

### 📊 Tableau de Bord Interactif
- **Vue d'ensemble** des indicateurs clés de performance (KPI)
- **Statistiques en temps réel** avec mises à jour automatiques
- **Graphiques interactifs** et visualisations de données dynamiques
- **Widgets personnalisables** pour une expérience sur mesure

### 🚨 Gestion des Alertes
- **Liste complète** de toutes les alertes système
- **Filtrage avancé** par statut, priorité et catégorie
- **Actions rapides** pour traiter les alertes efficacement
- **Notifications** en temps réel pour les nouvelles alertes
- **Historique détaillé** des alertes traitées

### 📝 Gestion des Actions
- **Suivi complet** des actions en cours et terminées
- **Création et édition** d'actions avec interface intuitive
- **Attribution automatique** aux équipes et membres
- **Workflow de validation** personnalisable
- **Rapports d'avancement** détaillés

### 🔐 Sécurité & Authentification
- Authentification sécurisée
- Gestion des rôles et permissions
- Sessions sécurisées avec tokens JWT
- Logs d'audit des actions utilisateurs

---

## 🛠️ Technologies Utilisées

### Frontend
- [**React 18**](https://react.dev/) - Bibliothèque UI moderne avec Hooks
- [**TypeScript**](https://www.typescriptlang.org/) - Typage statique pour un code robuste
- [**Vite**](https://vitejs.dev/) - Build tool ultra-rapide
- [**TailwindCSS**](https://tailwindcss.com/) - Framework CSS utilitaire
- [**shadcn/ui**](https://ui.shadcn.com/) - Composants UI accessibles et personnalisables

### Gestion des Données
- [**TanStack Query**](https://tanstack.com/query) (React Query) - Gestion d'état serveur
- Mise en cache intelligente
- Synchronisation automatique
- Optimistic updates

### Outils de Développement
- ESLint - Linting du code
- Prettier - Formatage automatique
- TypeScript Compiler - Vérification de types

---

## 🚀 Installation & Configuration

### Prérequis

Assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) **v18.0+**
- [npm](https://www.npmjs.com/) **v9.0+** ou [yarn](https://yarnpkg.com/) **v1.22+**
- Un éditeur de code ([VS Code](https://code.visualstudio.com/) recommandé)

### Installation Rapide

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd apvj-dashboard
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuration des variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```
   
   Éditez `.env.local` avec vos paramètres :
   ```env
   VITE_API_URL=https://api.example.com
   VITE_APP_NAME=APVJ Dashboard
   ```

4. **Lancer l'application**
   
   **Mode développement :**
   ```bash
   npm run dev
   # Application disponible sur http://localhost:5173
   ```
   
   **Build de production :**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔒 Authentification & Accès

### Se Connecter

1. Accédez à la page de connexion : **`/admin/login`**
2. Utilisez vos identifiants fournis par l'administrateur système
3. Vous serez redirigé vers le tableau de bord principal

### Première Connexion

Pour votre première connexion, contactez l'équipe technique pour obtenir vos identifiants d'accès sécurisés.

---

## 📂 Structure du Projet

```
apvj-dashboard/
├── src/
│   ├── components/        # Composants React réutilisables
│   ├── pages/            # Pages de l'application
│   ├── hooks/            # Hooks personnalisés
│   ├── services/         # Services API
│   ├── lib/              # Utilitaires et helpers
│   ├── types/            # Définitions TypeScript
│   └── App.tsx           # Point d'entrée
├── public/               # Fichiers statiques
├── .env.example          # Template variables d'environnement
└── package.json
```

---

## 📊 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile le projet pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run type-check` | Vérifie les types TypeScript |

---

## 🎨 Personnalisation

### Thème et Couleurs

Le thème peut être personnalisé dans `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Composants shadcn/ui

Ajoutez de nouveaux composants avec :
```bash
npx shadcn-ui@latest add [component-name]
```

---

## 🐛 Dépannage

### Problèmes Courants

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Port already in use"**
```bash
# Changez le port dans vite.config.ts
server: {
  port: 3001
}
```

**Erreurs TypeScript**
```bash
npm run type-check
```

---

## 📚 Documentation Complémentaire

- [Documentation React](https://react.dev/learn)
- [Guide TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation TailwindCSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
- [TanStack Query Guide](https://tanstack.com/query/latest/docs/react/overview)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add: nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 💬 Support & Contact

Pour toute question, problème technique ou demande de fonctionnalité :

- 📧 **Email** : houndjojeanjacques82@gmail.com


---

**Développé avec ❤️ par l'équipe APVJ**