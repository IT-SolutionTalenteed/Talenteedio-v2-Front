<template>
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
  <EditProfile    v-if="activeTab === 'profile'" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import OffreList from './talent/OffreList.vue'
import MesCandidatures from './talent/MesCandidatures.vue'
import MesFavoris from './talent/MesFavoris.vue'
import EvenementMatching from './talent/EvenementMatching.vue'
import ReservationEntretien from './talent/ReservationEntretien.vue'
import MesEntretiens from './talent/MesEntretiens.vue'
import MesFeedbacks from './talent/MesFeedbacks.vue'
import EditProfile from './EditProfile.vue'

const route = useRoute()
const activeTab = computed(() => route.path.split('/').pop() || 'offres')

const rdvState = ref(null)
const ouvrirRdv = (entrepriseId, entrepriseNom, evenement) => {
  rdvState.value = { entrepriseId, entrepriseNom, evenement }
}
</script>
