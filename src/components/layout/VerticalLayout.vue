<template>
  <!-- Navigation Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail && !mobile"
    :temporary="mobile"
    color="#0f172a"
    width="260"
  >
    <!-- Logo / Header -->
    <div class="d-flex align-center justify-space-between px-4 py-3" style="min-height:64px">
      <router-link v-if="!rail || mobile" to="/" class="d-flex align-center">
        <img src="/logo.png" height="38" alt="Talenteed" style="max-width:130px;object-fit:contain" />
      </router-link>
      <v-icon v-else color="primary" size="26">mdi-lightning-bolt</v-icon>
      <v-btn
        v-if="!mobile"
        :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        variant="text"
        size="small"
        style="color:rgba(255,255,255,0.4)"
        @click="rail = !rail"
      />
    </div>

    <v-divider style="border-color:rgba(255,255,255,0.08)" />

    <!-- User card -->
    <div class="px-4 py-3">
      <div class="d-flex align-center ga-3">
        <v-avatar color="primary" size="38">
          <v-icon color="white" size="20">mdi-account</v-icon>
        </v-avatar>
        <div v-if="!rail || mobile">
          <div class="text-body-2 font-weight-medium" style="color:#fff">{{ userName }}</div>
          <div class="text-caption" style="color:rgba(255,255,255,0.45)">{{ roleLabel }}</div>
        </div>
      </div>
    </div>

    <v-divider style="border-color:rgba(255,255,255,0.08)" class="mb-1" />

    <!-- Nav items -->
    <v-list density="compact" nav bg-color="transparent" class="px-2">
      <template v-for="item in sideNav" :key="item.label">

        <!-- Group with children -->
        <v-list-group v-if="item.children?.length" :value="item.label" color="primary">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              :title="(!rail || mobile) ? item.label : ''"
              rounded="lg"
              style="color:rgba(255,255,255,0.75)"
            />
          </template>
          <v-list-item
            v-for="child in item.children"
            :key="child.label"
            :prepend-icon="child.icon || 'mdi-circle-small'"
            :title="(!rail || mobile) ? child.label : ''"
            :active="isActive(child)"
            active-color="primary"
            rounded="lg"
            style="color:rgba(255,255,255,0.65)"
            @click="handleNav(child)"
          />
        </v-list-group>

        <!-- Simple item -->
        <v-list-item
          v-else
          :prepend-icon="item.icon"
          :title="(!rail || mobile) ? item.label : ''"
          :active="isActive(item)"
          active-color="primary"
          rounded="lg"
          style="color:rgba(255,255,255,0.75)"
          @click="handleNav(item)"
        />

      </template>
    </v-list>

    <!-- Logout footer -->
    <template #append>
      <v-divider style="border-color:rgba(255,255,255,0.08)" />
      <v-list density="compact" nav bg-color="transparent" class="px-2 py-2">
        <v-list-item
          prepend-icon="mdi-logout"
          :title="(!rail || mobile) ? 'Déconnexion' : ''"
          rounded="lg"
          style="color:rgba(255,255,255,0.6)"
          @click="handleLogout"
        />
      </v-list>
    </template>
  </v-navigation-drawer>

  <!-- App Bar -->
  <v-app-bar color="white" elevation="0" border="b" height="64">
    <v-app-bar-nav-icon
      color="grey-darken-2"
      @click="mobile ? (drawer = !drawer) : (rail = !rail)"
    />
    <v-app-bar-title>
      <span class="text-grey-darken-3 font-weight-semibold" style="font-size:1rem">{{ pageTitle }}</span>
    </v-app-bar-title>
    <template #append>
      <v-menu min-width="220" location="bottom end">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="mr-2 px-2">
            <v-avatar color="primary" size="32" class="mr-2">
              <v-icon color="white" size="16">mdi-account</v-icon>
            </v-avatar>
            <span class="text-body-2 text-grey-darken-2 d-none d-sm-inline">{{ userName }}</span>
            <v-icon size="16" class="ml-1" color="grey">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" rounded="lg" elevation="8" class="pa-1">
          <v-list-item class="mb-1">
            <template #prepend>
              <v-avatar color="primary" size="38">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium">{{ userName }}</v-list-item-title>
            <v-list-item-subtitle>{{ roleLabel }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-1" />
          <v-list-item
            prepend-icon="mdi-home-outline"
            title="Accueil"
            rounded="lg"
            @click="router.push('/home')"
          />
          <v-divider class="my-1" />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Déconnexion"
            base-color="error"
            rounded="lg"
            @click="handleLogout"
          />
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>

  <!-- Main content -->
  <v-main class="bg-grey-lighten-4">
    <v-container fluid class="pa-5">
      <slot>
        <Suspense>
          <RouterView :key="route.fullPath" />
          <template #fallback>
            <div class="d-flex justify-center align-center" style="min-height:200px">
              <v-progress-circular indeterminate color="primary" size="48" />
            </div>
          </template>
        </Suspense>
      </slot>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard.store'
import { authService } from '@/services/api'

const router = useRouter()
const route = useRoute()
const { mobile } = useDisplay()
const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

const drawer = ref(true)
const rail = ref(false)

const userRole = computed(() => localStorage.getItem('userRole') || 'admin')
const userName = computed(() => {
  return localStorage.getItem('userName')
    || localStorage.getItem('userEmail')
    || 'Utilisateur'
})

const roleLabel = computed(() => {
  const labels = {
    admin: 'Administrateur',
    talent: 'Talent',
    entreprise: 'Entreprise',
    consultant_externe: 'Consultant',
  }
  return labels[userRole.value] || userRole.value
})

const PAGE_TITLES = {
  overview: "Vue d'ensemble",
  entreprises: 'Entreprises',
  talents: 'Talents',
  entretiens: 'Entretiens',
  feedbacks: 'Feedbacks',
  offres: "Offres d'emploi",
  'categorie-evenements': 'Catégories Événements',
  evenements: 'Événements',
  'media-categories': 'Catégories Média',
  articles: 'Articles',
  'job-contracts': 'Contrats de travail',
  'job-modes': 'Modes de travail',
  skills: 'Compétences',
  'study-levels': "Niveaux d'étude",
  experiences: 'Expériences',
  languages: 'Langues',
  'activity-sectors': "Secteurs d'activité",
  'legal-pages': 'Pages légales',
  'import-candidats': 'Import candidats',
  'sync-crm': 'Sync CRM',
  candidatures: 'Candidatures',
  profile: 'Mon profil',
  'evenement-participations': 'Demandes de participation',
  favoris: 'Mes favoris',
}

const pageTitle = computed(() => {
  if (userRole.value !== 'admin') {
    return PAGE_TITLES[activeTab.value] || 'Dashboard'
  }
  const seg = route.path.split('/').pop()
  return PAGE_TITLES[seg] || 'Dashboard'
})

const handleLogout = async () => {
  try { await authService.logout() } catch {}
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  router.push('/login')
}

const isActive = (item) => {
  if (item.route) return route.name === item.route?.name
  if (item.tab) return activeTab.value === item.tab
  return false
}

const handleNav = (item) => {
  if (item.route) {
    router.push(item.route)
  } else if (item.tab) {
    dashboardStore.setActiveTab(item.tab)
  }
  if (mobile.value) drawer.value = false
}

const sideNav = computed(() => {
  const role = userRole.value

  if (role === 'admin') {
    return [
      {
        label: "Vue d'ensemble",
        route: { name: 'AdminOverview' },
        icon: 'mdi-view-dashboard-outline',
      },
      {
        label: 'Profile',
        icon: 'mdi-account-circle-outline',
        route: { name: 'AdminProfile' },
      },
      {
        label: 'Jobs',
        icon: 'mdi-briefcase-outline',
        children: [
          { label: "Offres d'emploi", route: { name: 'AdminOffres' }, icon: 'mdi-briefcase-search-outline' },
          { label: 'Candidatures', route: { name: 'AdminCandidatures' }, icon: 'mdi-file-account-outline' },
          { label: 'Contrats de travail', route: { name: 'AdminJobContracts' }, icon: 'mdi-file-sign' },
          { label: 'Modes de travail', route: { name: 'AdminJobModes' }, icon: 'mdi-laptop' },
          { label: 'Compétences', route: { name: 'AdminSkills' }, icon: 'mdi-star-outline' },
          { label: "Niveaux d'étude", route: { name: 'AdminStudyLevels' }, icon: 'mdi-school-outline' },
          { label: 'Expériences', route: { name: 'AdminExperiences' }, icon: 'mdi-clock-outline' },
          { label: 'Langues', route: { name: 'AdminLanguages' }, icon: 'mdi-translate' },
          { label: "Secteurs d'activité", route: { name: 'AdminActivitySectors' }, icon: 'mdi-sitemap-outline' },
        ],
      },
      {
        label: 'Événements',
        icon: 'mdi-calendar-star',
        children: [
          { label: 'Catégories', route: { name: 'AdminCategorieEvenements' }, icon: 'mdi-tag-multiple-outline' },
          { label: 'Événements', route: { name: 'AdminEvenements' }, icon: 'mdi-calendar-month-outline' },
          { label: 'Participation', route: { name: 'AdminParticipations' }, icon: 'mdi-domain' },
          { label: 'Entretiens par stand', route: { name: 'AdminEntretiens' }, icon: 'mdi-calendar-account-outline' },
          { label: 'Feedbacks', route: { name: 'AdminFeedbacks' }, icon: 'mdi-message-text-outline' },
        ],
      },
      {
        label: 'CRM HubSpot',
        icon: 'mdi-hubspot',
        children: [
          { label: 'Import XLS', route: { name: 'AdminImportCandidats' }, icon: 'mdi-upload' },
          { label: 'Sync CRM HubSpot', route: { name: 'AdminSyncCrm' }, icon: 'mdi-sync' },
        ],
      },
      {
        label: 'Talents',
        route: { name: 'AdminTalents' },
        icon: 'mdi-account-tie-outline',
      },
      {
        label: 'Entreprises',
        route: { name: 'AdminEntreprises' },
        icon: 'mdi-office-building-outline',
      },
      {
        label: 'Médias',
        icon: 'mdi-newspaper-variant-outline',
        children: [
          { label: 'Catégories Média', route: { name: 'AdminMediaCategories' }, icon: 'mdi-folder-multiple-outline' },
          { label: 'Articles', route: { name: 'AdminArticles' }, icon: 'mdi-file-document-outline' },
        ],
      },
      {
        label: 'Pages légales',
        route: { name: 'AdminLegalPages' },
        icon: 'mdi-file-certificate-outline',
      },
    ]
  }

  if (role === 'entreprise') {
    return [
      { label: 'Tableau de bord', tab: 'overview', icon: 'mdi-view-dashboard-outline' },
      { label: 'Mes offres', tab: 'offres', icon: 'mdi-briefcase-outline' },
      { label: 'Candidatures', tab: 'candidatures', icon: 'mdi-account-multiple-outline' },
      { label: 'Événements', tab: 'evenements', icon: 'mdi-calendar-star' },
      { label: 'Articles', tab: 'articles', icon: 'mdi-newspaper-variant-outline' },
      { label: 'Entretiens', tab: 'entretiens', icon: 'mdi-calendar-account-outline' },
      { label: 'Mon profil', tab: 'profile', icon: 'mdi-account-circle-outline' },
    ]
  }

  if (role === 'talent') {
    return [
      { label: "Offres d'emploi", tab: 'offres', icon: 'mdi-briefcase-search-outline' },
      { label: 'Mes candidatures', tab: 'candidatures', icon: 'mdi-briefcase-check-outline' },
      { label: 'Mes favoris', tab: 'favoris', icon: 'mdi-heart-outline' },
      { label: 'Événements & Matching', tab: 'evenements', icon: 'mdi-calendar-star' },
      { label: 'Mes entretiens', tab: 'entretiens', icon: 'mdi-calendar-account-outline' },
      { label: 'Mes feedbacks', tab: 'feedbacks', icon: 'mdi-message-text-outline' },
      { label: 'Mon profil', tab: 'profile', icon: 'mdi-account-circle-outline' },
    ]
  }

  return []
})
</script>

<style scoped>
:deep(.v-navigation-drawer .v-list-item--active) {
  background: rgba(37, 99, 235, 0.18) !important;
}
:deep(.v-navigation-drawer .v-list-item--active .v-icon) {
  color: #2563eb !important;
}
:deep(.v-navigation-drawer .v-list-item--active .v-list-item-title) {
  color: #93c5fd !important;
  font-weight: 600;
}
:deep(.v-navigation-drawer .v-list-group__header) {
  color: rgba(255,255,255,0.75) !important;
}
</style>
