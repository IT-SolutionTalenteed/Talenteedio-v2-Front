<template>
  <VerticalLayout>
    <div class="page-header d-print-none">
      <div class="container-xl">
        <PageHeader
          title="Dashboard Talent"
          page="Dashboard"
          :breadcrumbs="breadcrumbs"
        />
      </div>
    </div>

    <div class="page-body">
      <div class="container-xl">
        <OffreList v-if="activeTab === 'offres'" />
        <MesCandidatures v-if="activeTab === 'candidatures'" />
        <MesFavoris v-if="activeTab === 'favoris'" />
        <EvenementMatching v-if="activeTab === 'evenements' && !rdvState" @demanderRdv="ouvrirRdv" />
        <ReservationEntretien
          v-if="activeTab === 'evenements' && rdvState"
          :evenement="rdvState.evenement"
          :entreprise-id="rdvState.entrepriseId"
          :entreprise-nom="rdvState.entrepriseNom"
          @fermer="rdvState = null"
        />
        <MesEntretiens v-if="activeTab === 'entretiens'" />
        <MesFeedbacks v-if="activeTab === 'feedbacks'" />
      </div>
    </div>
  </VerticalLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { authService } from '../services/api.js'

import VerticalLayout from './layout/VerticalLayout.vue'
import PageHeader from './layout/PageHeader.vue'
import { useDashboardStore } from '@/stores/dashboard.store'

import OffreList from './talent/OffreList.vue'
import MesCandidatures from './talent/MesCandidatures.vue'
import MesFavoris from './talent/MesFavoris.vue'
import EvenementMatching from './talent/EvenementMatching.vue'
import ReservationEntretien from './talent/ReservationEntretien.vue'
import MesEntretiens from './talent/MesEntretiens.vue'
import MesFeedbacks from './talent/MesFeedbacks.vue'

const router = useRouter()
const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

const rdvState = ref(null) // { entrepriseId, entrepriseNom, evenement }

const breadcrumbs = ref([
  { label: 'Accueil', route: { name: 'Home' } }
])

const ouvrirRdv = (entrepriseId, entrepriseNom, evenement) => {
  rdvState.value = { entrepriseId, entrepriseNom, evenement }
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