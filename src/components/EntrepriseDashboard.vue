<template>
  <VerticalLayout>
    <OffreList        v-if="activeTab === 'offres'" />
    <CandidatureList  v-if="activeTab === 'candidatures'" />
    <EvenementList    v-if="activeTab === 'evenements'" />
    <ArticleList      v-if="activeTab === 'articles'" />
    <EntretienList    v-if="activeTab === 'entretiens'" />

    <!-- Fallback si aucun onglet actif -->
    <div
      v-if="!['offres','candidatures','evenements','articles','entretiens'].includes(activeTab)"
      class="d-flex flex-column align-center justify-center ga-4"
      style="min-height:320px"
    >
      <v-icon size="72" color="success" style="opacity:.15">mdi-office-building-outline</v-icon>
      <div class="text-h6 text-medium-emphasis">Bienvenue dans votre espace Entreprise</div>
      <div class="text-body-2 text-disabled">Sélectionnez une section dans le menu</div>
      <v-btn color="success" prepend-icon="mdi-briefcase-outline" @click="dashboardStore.setActiveTab('offres')">
        Gérer mes offres
      </v-btn>
    </div>
  </VerticalLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard.store'

import VerticalLayout from './layout/VerticalLayout.vue'
import OffreList from './entreprise/OffreList.vue'
import CandidatureList from './entreprise/CandidatureList.vue'
import EvenementList from './entreprise/EvenementList.vue'
import ArticleList from './entreprise/ArticleList.vue'
import EntretienList from './entreprise/EntretienList.vue'

const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

onMounted(() => {
  const validTabs = ['offres', 'candidatures', 'evenements', 'articles', 'entretiens']
  if (!validTabs.includes(activeTab.value)) {
    dashboardStore.setActiveTab('offres')
  }
})
</script>
