# 🎨 Talenteed Front - Nouveau Design

> Interface moderne et professionnelle basée sur Tabler (Bootstrap 5)

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Production
npm run build
```

## 📚 Documentation

### 🎯 Commencer ici
- **[INDEX_DOCUMENTATION.md](./INDEX_DOCUMENTATION.md)** - Index complet de toute la documentation

### 📖 Guides principaux
- **[README_MIGRATION.md](./README_MIGRATION.md)** - Instructions complètes de migration
- **[GUIDE_NOUVEAU_DESIGN.md](./GUIDE_NOUVEAU_DESIGN.md)** - Guide d'utilisation du design
- **[RESUME_MIGRATION.md](./RESUME_MIGRATION.md)** - Résumé de la migration

### ⚡ Installation rapide
- **[QUICK_START.sh](./QUICK_START.sh)** - Script d'installation automatique
- **[INSTALL_DEPENDENCIES.md](./INSTALL_DEPENDENCIES.md)** - Détails des dépendances
- **[COMMANDES.md](./COMMANDES.md)** - Toutes les commandes utiles

## ✨ Fonctionnalités

### Design moderne
- ✅ Interface basée sur Tabler (Bootstrap 5)
- ✅ Responsive design
- ✅ Dark mode pour le sidebar
- ✅ Bootstrap Icons
- ✅ Animations fluides

### Navigation adaptative
Le sidebar s'adapte automatiquement selon 6 rôles:
- **Admin** - Accès complet
- **Entreprise** - Interface entreprise
- **Talent** - Interface talent
- **Consultant** - Interface consultant
- **Referral** - Interface parrainage
- **HR First Club** - Interface RH

### Composants réutilisables
- `VerticalLayout` - Layout principal avec sidebar
- `Aside` - Sidebar de navigation
- `Footer` - Footer du site
- `PageHeader` - En-tête de page avec breadcrumbs
- `Loader` - Loaders de chargement

### Gestion d'état
- Pinia pour la gestion d'état
- Persistance sécurisée avec secure-ls
- Store global pour le loading

## 📦 Technologies

- **Vue 3** - Framework JavaScript
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing
- **Vue I18n** - Internationalisation
- **Tabler** - UI Framework (Bootstrap 5)
- **Bootstrap Icons** - Icônes
- **CKEditor** - Éditeur WYSIWYG
- **Sass** - Préprocesseur CSS

## 🎯 Structure du projet

```
Front/
├── src/
│   ├── components/
│   │   ├── layout/          # Composants de layout
│   │   ├── admin/           # Composants admin
│   │   ├── entreprise/      # Composants entreprise
│   │   └── talent/          # Composants talent
│   ├── views/               # Pages
│   ├── stores/              # Stores Pinia
│   ├── router/              # Configuration du router
│   ├── i18n/                # Traductions
│   ├── services/            # Services API
│   ├── config/              # Configuration
│   ├── assets/              # Assets (images, styles)
│   ├── App.vue              # Composant racine
│   └── main.js              # Point d'entrée
├── public/                  # Fichiers statiques
└── Documentation/           # Documentation complète
```

## 🔧 Configuration

### Rôle utilisateur

Le rôle doit être défini dans localStorage:

```javascript
// Dans la console du navigateur
localStorage.setItem('userRole', 'admin');

// Ou dans votre code
import { setRole, ROLES } from '@/config/roles';
setRole(ROLES.ADMIN);
```

### Variables d'environnement

Créez un fichier `.env` à la racine:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Talenteed
```

## 📖 Exemples

### Page simple

```vue
<template>
  <VerticalLayout>
    <div class="page-header d-print-none">
      <div class="container-xl">
        <PageHeader
          title="Ma page"
          page="Ma page"
          :breadcrumbs="breadcrumbs"
        />
      </div>
    </div>

    <div class="page-body">
      <div class="container-xl">
        <div class="card">
          <div class="card-body">
            Contenu de ma page
          </div>
        </div>
      </div>
    </div>
  </VerticalLayout>
</template>

<script setup>
import VerticalLayout from '@/components/layout/VerticalLayout.vue';
import PageHeader from '@/components/layout/PageHeader.vue';

const breadcrumbs = [
  { label: 'Accueil', route: { name: 'home' } }
];
</script>
```

Voir **[AdminDashboardExample.vue](./src/views/AdminDashboardExample.vue)** pour un exemple complet.

## 🎨 Composants Tabler

### Cards
```vue
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Titre</h3>
  </div>
  <div class="card-body">Contenu</div>
</div>
```

### Boutons
```vue
<button class="btn btn-primary">
  <i class="bi bi-plus me-2"></i>
  Ajouter
</button>
```

### Tables
```vue
<table class="table table-vcenter card-table">
  <thead>
    <tr>
      <th>Colonne 1</th>
      <th>Colonne 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Donnée 1</td>
      <td>Donnée 2</td>
    </tr>
  </tbody>
</table>
```

Plus d'exemples dans **[GUIDE_NOUVEAU_DESIGN.md](./GUIDE_NOUVEAU_DESIGN.md)**

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Le sidebar ne s'affiche pas
```javascript
// Vérifier le rôle
console.log(localStorage.getItem('userRole'));

// Définir un rôle
localStorage.setItem('userRole', 'admin');
```

### Les styles ne s'appliquent pas
```bash
# Vérifier que Sass est installé
npm list sass

# Réinstaller si nécessaire
npm install -D sass sass-loader
```

Plus de solutions dans **[README_MIGRATION.md](./README_MIGRATION.md)** section "Dépannage"

## 📚 Ressources

- [Documentation Tabler](https://tabler.io/docs)
- [Documentation Bootstrap 5](https://getbootstrap.com/docs/5.0/)
- [Documentation Vue 3](https://vuejs.org/)
- [Documentation Pinia](https://pinia.vuejs.org/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)

## 📝 Scripts disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement

# Production
npm run build            # Construire pour la production
npm run preview          # Prévisualiser la build de production

# Utilitaires
npm install              # Installer les dépendances
npm list                 # Lister les dépendances installées
```

## 🤝 Contribution

1. Lire la documentation complète
2. Suivre les conventions de code
3. Tester sur différents navigateurs
4. Documenter les changements

## 📄 Licence

Copyright © 2026 Solution Talenteed. Tous droits réservés.

---

## 🎯 Prochaines étapes

1. ✅ **Installer** - `npm install`
2. ✅ **Configurer** - Définir le rôle utilisateur
3. ✅ **Démarrer** - `npm run dev`
4. ✅ **Lire** - [INDEX_DOCUMENTATION.md](./INDEX_DOCUMENTATION.md)
5. ✅ **Adapter** - Migrer vos pages existantes

---

**Pour plus d'informations, consultez [INDEX_DOCUMENTATION.md](./INDEX_DOCUMENTATION.md)** 📚

*Dernière mise à jour: 2026-03-27*
