<template>
  <div>
    <h1>Dashboard Talent</h1>

    <nav>
      <button @click="activeTab = 'offres'">Offres d'emploi</button>
      <button @click="activeTab = 'candidatures'">Mes candidatures</button>
      <button @click="logout" style="background-color:#dc3545;">Déconnexion</button>
    </nav>

    <OffreList v-if="activeTab === 'offres'" />
    <MesCandidatures v-if="activeTab === 'candidatures'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'
import OffreList from './talent/OffreList.vue'
import MesCandidatures from './talent/MesCandidatures.vue'

const router = useRouter()
const activeTab = ref('offres')

const logout = async () => {
  try { await authService.logout() } catch {}
  finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/login')
  }
}
</script>