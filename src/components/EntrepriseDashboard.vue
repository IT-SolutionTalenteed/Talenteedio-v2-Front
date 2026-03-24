<template>
  <div>
    <h1>Dashboard Entreprise</h1>

    <nav>
      <button @click="activeTab = 'offres'">Mes offres</button>
      <button @click="activeTab = 'candidatures'">Candidatures</button>
      <button @click="activeTab = 'evenements'">Événements</button>
      <button @click="activeTab = 'articles'">Mes articles</button>
      <button @click="activeTab = 'entretiens'">Entretiens</button>
      <button @click="logout" style="background-color:#dc3545;">Déconnexion</button>
    </nav>

    <OffreList v-if="activeTab === 'offres'" />
    <CandidatureList v-if="activeTab === 'candidatures'" />
    <EvenementList v-if="activeTab === 'evenements'" />
    <ArticleList v-if="activeTab === 'articles'" />
    <EntretienList v-if="activeTab === 'entretiens'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'
import OffreList from './entreprise/OffreList.vue'
import CandidatureList from './entreprise/CandidatureList.vue'
import EvenementList from './entreprise/EvenementList.vue'
import ArticleList from './entreprise/ArticleList.vue'
import EntretienList from './entreprise/EntretienList.vue'

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
