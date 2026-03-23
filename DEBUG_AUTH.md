# Guide de débogage - Problème d'authentification

## Problème identifié
L'utilisateur se connecte mais est automatiquement déconnecté avec des erreurs 401.

## Corrections apportées

### 1. Correction du token dans Login.vue
- Changé `response.data.token` en `response.data.access_token`
- Le backend retourne `access_token`, pas `token`

### 2. Configuration Sanctum
- Ajouté les ports Vite (5173, 5174) aux domaines stateful
- Modifié `.env` : `SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,localhost:5174,127.0.0.1,127.0.0.1:5173,127.0.0.1:5174`

### 3. Configuration base de données
- Corrigé `config/database.php` : défaut MySQL au lieu de SQLite

### 4. Ajout de logs de débogage
- Middleware `DebugAuth` pour tracer les requêtes
- Logs dans les intercepteurs Axios
- Composant `TestAuth` pour tester manuellement

## Étapes de test

1. **Démarrer Laravel** :
```bash
cd Talenteedio-v2
php artisan serve
```

2. **Démarrer Vue.js** :
```bash
cd Front
npm run dev
```

3. **Tester l'authentification** :
- Aller sur `http://localhost:5173/test-auth`
- Cliquer sur "Test Login"
- Vérifier les logs dans la console
- Tester "Test API Call" après login

4. **Vérifier les logs Laravel** :
```bash
tail -f storage/logs/laravel.log
```

## Points à vérifier

### Côté Laravel
- [ ] Serveur démarré sur port 8000
- [ ] Base de données MySQL connectée
- [ ] Utilisateur admin existe
- [ ] Tokens Sanctum créés correctement

### Côté Vue.js
- [ ] Token stocké dans localStorage
- [ ] Header Authorization ajouté aux requêtes
- [ ] Pas d'erreurs CORS
- [ ] Réponses API correctes

## Commandes utiles

```bash
# Vérifier l'utilisateur admin
php artisan tinker
>>> App\Models\User::where('email', 'solofonirina35@gmail.com')->first()

# Nettoyer les tokens
>>> Laravel\Sanctum\PersonalAccessToken::truncate()

# Vérifier les routes
php artisan route:list --path=api/admin
```

## Si le problème persiste

1. Vérifier les headers CORS
2. Tester avec Postman/curl
3. Vérifier les logs Laravel
4. Supprimer le middleware de debug après résolution