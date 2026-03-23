<template>
  <div>
    <h1>Dashboard Entreprise</h1>
    
    <nav>
      <button @click="logout">Déconnexion</button>
    </nav>
    
    <div>
      <h2>Bienvenue dans l'espace entreprise</h2>
      <p>Gérez vos offres d'emploi et recrutements.</p>
      
      <ul>
        <li>Mes offres d'emploi</li>
        <li>Candidatures reçues</li>
        <li>Profil entreprise</li>
        <li>Statistiques de recrutement</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'

const router = useRouter()

const logout = async () => {
  try {
    await authService.logout()
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/login')
  }
}
</script>