<template>
  <VerticalLayout>
    <div class="page-header d-print-none">
      <div class="container-xl">
        <PageHeader
          title="Dashboard Entreprise"
          page="Dashboard"
          :breadcrumbs="breadcrumbs"
        />
      </div>
    </div>

    <div class="page-body">
      <div class="container-xl">
        <OffreList v-if="activeTab === 'offres'" />
        <CandidatureList v-if="activeTab === 'candidatures'" />
        <EvenementList v-if="activeTab === 'evenements'" />
        <ArticleList v-if="activeTab === 'articles'" />
        <EntretienList v-if="activeTab === 'entretiens'" />
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

import OffreList from './entreprise/OffreList.vue'
import CandidatureList from './entreprise/CandidatureList.vue'
import EvenementList from './entreprise/EvenementList.vue'
import ArticleList from './entreprise/ArticleList.vue'
import EntretienList from './entreprise/EntretienList.vue'

const router = useRouter()
const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

const breadcrumbs = ref([
  { label: 'Accueil', route: { name: 'Home' } }
])

const logout = async () => {
  try { await authService.logout() } catch {}
  finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/login')
  }
}
</script>
