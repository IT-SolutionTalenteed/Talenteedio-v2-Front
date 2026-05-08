<template>
  <div>
    <!-- Bannière bienvenue -->
    <v-card
      class="mb-6 overflow-hidden"
      color="primary"
      rounded="xl"
      elevation="0"
    >
      <v-card-text class="pa-6">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div>
            <div class="text-h5 font-weight-bold text-white mb-1">
              {{ t('dashboard.company.welcome') }}
            </div>
            <div class="text-body-2" style="color:rgba(255,255,255,0.75)">
              {{ t('dashboard.company.subtitle') }}
            </div>
          </div>
          <v-icon size="72" style="color:rgba(255,255,255,0.15)">mdi-briefcase-variant</v-icon>
        </div>
      </v-card-text>
    </v-card>

    <!-- Stats cards -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="6" lg="3">
        <v-card 
          rounded="xl" 
          elevation="0" 
          border 
          class="stat-card-clickable"
          @click="router.push({ name: 'EntrepriseOffres' })"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold text-primary">
                  {{ stats.totalOffres !== null ? stats.totalOffres : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">{{ t('dashboard.company.stats.offers') }}</div>
              </div>
              <v-avatar color="primary" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-briefcase-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card 
          rounded="xl" 
          elevation="0" 
          border
          class="stat-card-clickable"
          @click="router.push({ name: 'EntrepriseCandidatures' })"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold text-success">
                  {{ stats.totalCandidatures !== null ? stats.totalCandidatures : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">{{ t('dashboard.company.stats.applications') }}</div>
              </div>
              <v-avatar color="success" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-account-multiple-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card 
          rounded="xl" 
          elevation="0" 
          border
          class="stat-card-clickable"
          @click="router.push({ name: 'EntrepriseEntretiens' })"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold text-warning">
                  {{ stats.totalEntretiens !== null ? stats.totalEntretiens : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">{{ t('dashboard.company.stats.interviews') }}</div>
              </div>
              <v-avatar color="warning" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-calendar-account-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card 
          rounded="xl" 
          elevation="0" 
          border
          class="stat-card-clickable"
          @click="router.push({ name: 'EntrepriseArticles' })"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold text-info">
                  {{ stats.totalArticles !== null ? stats.totalArticles : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">{{ t('dashboard.company.stats.articles') }}</div>
              </div>
              <v-avatar color="info" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-newspaper-variant-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions rapides -->
    <v-card rounded="xl" elevation="0" border class="mb-6">
      <v-card-title class="pa-5 pb-3">
        <div class="text-h6">{{ t('dashboard.company.quickActions.title') }}</div>
      </v-card-title>
      <v-card-text class="pa-5 pt-0">
        <v-row dense>
          <v-col cols="12" sm="6" md="3">
            <v-btn
              block
              color="primary"
              variant="tonal"
              size="large"
              prepend-icon="mdi-plus"
              @click="router.push({ name: 'EntrepriseOffreCreate' })"
            >
              {{ t('dashboard.company.quickActions.publishOffer') }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn
              block
              color="success"
              variant="tonal"
              size="large"
              prepend-icon="mdi-account-multiple"
              @click="router.push({ name: 'EntrepriseCandidatures' })"
            >
              {{ t('dashboard.company.quickActions.viewApplications') }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn
              block
              color="info"
              variant="tonal"
              size="large"
              prepend-icon="mdi-newspaper-plus"
              @click="router.push({ name: 'EntrepriseArticleCreate' })"
            >
              {{ t('dashboard.company.quickActions.createArticle') }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn
              block
              color="warning"
              variant="tonal"
              size="large"
              prepend-icon="mdi-briefcase-search"
              @click="router.push({ name: 'EntrepriseOffres' })"
            >
              {{ t('dashboard.company.quickActions.myOffers') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const stats = ref({
  totalOffres: null,
  totalCandidatures: null,
  totalEntretiens: null,
  totalArticles: null
})

onMounted(async () => {
  try {
    const response = await api.get('/entreprise/dashboard-stats')
    stats.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
})
</script>

<style scoped>
.stat-card-clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.stat-card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
