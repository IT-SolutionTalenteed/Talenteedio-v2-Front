<template>
  <div>
    <h1>Dashboard Talent</h1>
    
    <nav>
      <button @click="logout">Déconnexion</button>
    </nav>
    
    <div>
      <h2>Bienvenue dans l'espace talent</h2>
      <p>Gérez votre profil et vos opportunités.</p>
      
      <ul>
        <li>Mon profil</li>
        <li>Mes candidatures</li>
        <li>Offres recommandées</li>
        <li>Messages</li>
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