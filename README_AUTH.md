# Frontend Vue.js - Authentification

## Structure créée

### Composants
- `Login.vue` - Page de connexion
- `Register.vue` - Page d'inscription  
- `AdminDashboard.vue` - Dashboard administrateur
- `TalentDashboard.vue` - Dashboard talent
- `EntrepriseDashboard.vue` - Dashboard entreprise

### Services
- `api.js` - Configuration Axios et services d'authentification

### Routeur
- `router/index.js` - Configuration des routes avec guards d'authentification

## Fonctionnalités

### Authentification
- Login avec email/mot de passe
- Register avec nom, email, mot de passe et rôle (talent/entreprise)
- Stockage du token JWT et du rôle dans localStorage
- Déconnexion avec nettoyage du localStorage

### Navigation
- Redirection automatique selon le rôle après connexion :
  - Admin → `/admin`
  - Talent → `/talent` 
  - Entreprise → `/entreprise`
- Protection des routes avec guards d'authentification
- Redirection vers login si non authentifié

### API
- Base URL configurée via variable d'environnement `VITE_API_URL`
- Défaut : `http://localhost:8000/api`
- Intercepteurs pour ajouter automatiquement le token Bearer
- Gestion automatique des erreurs 401 (déconnexion forcée)

## Configuration

### Variables d'environnement
Copiez le fichier `.env.example` vers `.env` et ajustez les valeurs :

```bash
cp .env.example .env
```

Variables disponibles :
- `VITE_API_URL` - URL de base de l'API Laravel (défaut: http://localhost:8000/api)

## Utilisation

1. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Éditer .env si nécessaire
```

2. Démarrer le serveur de développement :
```bash
npm run dev
```

2. Accéder à l'application : `http://localhost:5173`

3. S'inscrire ou se connecter selon le rôle souhaité

## Notes importantes

- Le backend Laravel doit être démarré sur `http://localhost:8000`
- Les routes API attendues :
  - `POST /api/register` - Inscription
  - `POST /api/login` - Connexion
  - `POST /api/logout` - Déconnexion
  - `GET /api/user` - Informations utilisateur

- Pas de CSS avancé, HTML simple comme demandé
- Gestion basique des erreurs avec affichage des messages