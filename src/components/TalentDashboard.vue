<template>
  <div>
    <h1>Dashboard Talent</h1>

    <nav>
      <button @click="activeTab = 'offres'">Offres d'emploi</button>
      <button @click="activeTab = 'candidatures'">Mes candidatures</button>
      <button @click="activeTab = 'favoris'">Mes favoris</button>
      <button @click="activeTab = 'evenements'">Événements & Matching</button>
      <button @click="logout" style="background-color:#dc3545;">Déconnexion</button>
    </nav>

    <OffreList v-if="activeTab === 'offres'" />
    <MesCandidatures v-if="activeTab === 'candidatures'" />
    <MesFavoris v-if="activeTab === 'favoris'" />
    <EvenementMatching v-if="activeTab === 'evenements'" @demanderRdv="ouvrirRdv" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'
import OffreList from './talent/OffreList.vue'
import MesCandidatures from './talent/MesCandidatures.vue'
import MesFavoris from './talent/MesFavoris.vue'
import EvenementMatching from './talent/EvenementMatching.vue'

const router = useRouter()
const activeTab = ref('offres')

// G-04 : sera utilisé depuis EvenementMatching pour ouvrir le RDV
const ouvrirRdv = (entrepriseId, evenement) => {
  // sera branché en G-04
  console.log('Demande RDV', entrepriseId, evenement)
}

const logout = async () => {
  try { await authService.logout() } catch {}
  finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/login')
  }
}
</script>