# Dashboard Admin - CRUD Media Categories & Articles

## Fonctionnalités implémentées

### Dashboard Admin
- Navigation par onglets (Vue d'ensemble, Catégories Média, Articles)
- Statistiques en temps réel
- Interface d'administration complète

### CRUD Catégories Média
**Composant**: `MediaCategoryList.vue`
**Service**: `mediaCategoryService.js`

**Fonctionnalités**:
- ✅ Lister toutes les catégories
- ✅ Créer une nouvelle catégorie
- ✅ Modifier une catégorie existante
- ✅ Supprimer une catégorie
- ✅ Activation/désactivation des catégories

**Champs gérés**:
- Nom (obligatoire)
- Description (optionnel)
- Statut actif/inactif
- Slug (généré automatiquement)

### CRUD Articles
**Composant**: `ArticleList.vue`
**Service**: `articleService.js`

**Fonctionnalités**:
- ✅ Lister tous les articles
- ✅ Créer un nouvel article
- ✅ Modifier un article existant
- ✅ Supprimer un article
- ✅ Association avec catégories média (relation many-to-many)
- ✅ Gestion du statut publié/brouillon

**Champs gérés**:
- Titre (obligatoire)
- Contenu (obligatoire)
- Catégories média (sélection multiple)
- Statut publié/brouillon
- Slug (généré automatiquement côté backend)

## API Endpoints attendus

### Catégories Média
- `GET /api/admin/media-categories` - Liste
- `POST /api/admin/media-categories` - Création
- `PUT /api/admin/media-categories/{id}` - Modification
- `DELETE /api/admin/media-categories/{id}` - Suppression

### Articles
- `GET /api/admin/articles` - Liste
- `POST /api/admin/articles` - Création
- `PUT /api/admin/articles/{id}` - Modification
- `DELETE /api/admin/articles/{id}` - Suppression

## Interface utilisateur

### Navigation
- Onglets pour naviguer entre les sections
- Bouton de déconnexion
- Vue d'ensemble avec statistiques

### Formulaires
- Validation côté client
- Messages d'erreur et de succès
- Annulation possible
- Champs obligatoires marqués

### Tableaux
- Affichage paginé des données
- Actions par ligne (Modifier/Supprimer)
- Confirmations de suppression
- Formatage des dates

## Utilisation

1. Se connecter avec le compte admin
2. Naviguer vers `/admin`
3. Utiliser les onglets pour accéder aux CRUD
4. Créer, modifier, supprimer les éléments selon les besoins

## Notes techniques

- Gestion d'état réactive avec Vue 3 Composition API
- Services API centralisés
- Gestion des erreurs avec messages utilisateur
- Interface responsive basique
- Pas de pagination côté frontend (à implémenter si nécessaire)