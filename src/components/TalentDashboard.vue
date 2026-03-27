<template>
  <VerticalLayout>
    <OffreList           v-if="activeTab === 'offres'" />
    <MesCandidatures     v-if="activeTab === 'candidatures'" />
    <MesFavoris          v-if="activeTab === 'favoris'" />
    <EvenementMatching
      v-if="activeTab === 'evenements' && !rdvState"
      @demanderRdv="ouvrirRdv"
    />
    <ReservationEntretien
      v-if="activeTab === 'evenements' && rdvState"
      :evenement="rdvState.evenement"
      :entreprise-id="rdvState.entrepriseId"
      :entreprise-nom="rdvState.entrepriseNom"
      @fermer="rdvState = null"
    />
    <MesEntretiens  v-if="activeTab === 'entretiens'" />
    <MesFeedbacks   v-if="activeTab === 'feedbacks'" />

    <!-- Fallback si aucun onglet actif -->
    <div
      v-if="!['offres','candidatures','favoris','evenements','entretiens','feedbacks'].includes(activeTab)"
      class="d-flex flex-column align-center justify-center ga-4"
      style="min-height:320px"
    >
      <v-icon size="72" color="primary" style="opacity:.15">mdi-briefcase-search-outline</v-icon>
      <div class="text-h6 text-medium-emphasis">Bienvenue dans votre espace Talent</div>
      <div class="text-body-2 text-disabled">Sélectionnez une section dans le menu</div>
      <v-btn color="primary" prepend-icon="mdi-briefcase-search-outline" @click="dashboardStore.setActiveTab('offres')">
        Voir les offres
      </v-btn>
    </div>
  </VerticalLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard.store'

import VerticalLayout from './layout/VerticalLayout.vue'
import OffreList from './talent/OffreList.vue'
import MesCandidatures from './talent/MesCandidatures.vue'
import MesFavoris from './talent/MesFavoris.vue'
import EvenementMatching from './talent/EvenementMatching.vue'
import ReservationEntretien from './talent/ReservationEntretien.vue'
import MesEntretiens from './talent/MesEntretiens.vue'
import MesFeedbacks from './talent/MesFeedbacks.vue'

const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

const rdvState = ref(null)

onMounted(() => {
  // Initialiser sur 'offres' si pas d'onglet talent valide
  const validTabs = ['offres', 'candidatures', 'favoris', 'evenements', 'entretiens', 'feedbacks']
  if (!validTabs.includes(activeTab.value)) {
    dashboardStore.setActiveTab('offres')
  }
})

const ouvrirRdv = (entrepriseId, entrepriseNom, evenement) => {
  rdvState.value = { entrepriseId, entrepriseNom, evenement }
}
</script>
