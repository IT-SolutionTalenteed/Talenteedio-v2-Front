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
            :title="(!rail || mobile) ? child.label : ''"
            :active="isActive(child)"
            color="primary"
            rounded="lg"
            class="child-nav-item"
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
          color="primary"
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
          :title="(!rail || mobile) ? t('dashboard.common.logout') : ''"
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
            :title="t('dashboard.common.home')"
            rounded="lg"
            @click="router.push('/home')"
          />
          <v-divider class="my-1" />
          <v-list-item
            prepend-icon="mdi-logout"
            :title="t('dashboard.common.logout')"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard.store'
import { authService } from '@/services/api'
import api from '@/services/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { mobile } = useDisplay()
const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

const drawer = ref(true)
const rail = ref(false)
const userNameStored = ref(localStorage.getItem('userName') || '')

const userRole = computed(() => localStorage.getItem('userRole') || 'admin')
const userName = computed(() => userNameStored.value || localStorage.getItem('userEmail') || 'Utilisateur')

onMounted(async () => {
  if (!userNameStored.value) {
    try {
      const res = await api.get('/user')
      const u = res.data
      const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.name || ''
      localStorage.setItem('userName', name)
      userNameStored.value = name
    } catch {}
  }
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
  overview: t('dashboard.common.overview'),
  entreprises: t('nav.admin.companies'),
  talents: t('nav.admin.talents'),
  entretiens: t('nav.admin.events.interviews'),
  feedbacks: t('nav.admin.events.feedbacks'),
  offres: t('nav.admin.jobs.offers'),
  'categorie-evenements': t('nav.admin.events.categories'),
  evenements: t('nav.admin.events.events'),
  'media-categories': t('nav.admin.media.categories'),
  articles: t('nav.admin.media.articles'),
  'job-contracts': t('nav.admin.jobs.contracts'),
  'job-modes': t('nav.admin.jobs.workModes'),
  skills: t('nav.admin.jobs.skills'),
  'study-levels': t('nav.admin.jobs.studyLevels'),
  experiences: t('nav.admin.jobs.experiences'),
  languages: t('nav.admin.jobs.languages'),
  'activity-sectors': t('nav.admin.jobs.sectors'),
  'legal-pages': t('nav.admin.legalPages'),
  'plans': t('nav.admin.plans'),
  admins: t('nav.admin.admins'),
  'import-candidats': t('nav.admin.crm.import'),
  'sync-crm': t('nav.admin.crm.sync'),
  candidatures: t('nav.admin.jobs.applications'),
  profile: t('nav.admin.profile'),
  'evenement-participations': t('nav.admin.events.participation'),
  favoris: t('nav.talent.favorites'),
}

const pageTitle = computed(() => {
  if (userRole.value !== 'admin') {
    return PAGE_TITLES[activeTab.value] || t('dashboard.common.dashboard')
  }
  const seg = route.path.split('/').pop()
  return PAGE_TITLES[seg] || t('dashboard.common.dashboard')
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
        label: t('nav.admin.overview'),
        route: { name: 'AdminOverview' },
        icon: 'mdi-view-dashboard-outline',
      },
      {
        label: t('nav.admin.profile'),
        icon: 'mdi-account-circle-outline',
        route: { name: 'AdminProfile' },
      },
      {
        label: t('nav.admin.jobs.title'),
        icon: 'mdi-briefcase-outline',
        children: [
          { label: t('nav.admin.jobs.offers'), route: { name: 'AdminOffres' }, icon: 'mdi-briefcase-search-outline' },
          { label: t('nav.admin.jobs.applications'), route: { name: 'AdminCandidatures' }, icon: 'mdi-file-account-outline' },
          { label: t('nav.admin.jobs.contracts'), route: { name: 'AdminJobContracts' }, icon: 'mdi-file-sign' },
          { label: t('nav.admin.jobs.workModes'), route: { name: 'AdminJobModes' }, icon: 'mdi-laptop' },
          { label: t('nav.admin.jobs.skills'), route: { name: 'AdminSkills' }, icon: 'mdi-star-outline' },
          { label: t('nav.admin.jobs.studyLevels'), route: { name: 'AdminStudyLevels' }, icon: 'mdi-school-outline' },
          { label: t('nav.admin.jobs.experiences'), route: { name: 'AdminExperiences' }, icon: 'mdi-clock-outline' },
          { label: t('nav.admin.jobs.languages'), route: { name: 'AdminLanguages' }, icon: 'mdi-translate' },
          { label: t('nav.admin.jobs.sectors'), route: { name: 'AdminActivitySectors' }, icon: 'mdi-sitemap-outline' },
        ],
      },
      {
        label: t('nav.admin.events.title'),
        icon: 'mdi-calendar-star',
        children: [
          { label: t('nav.admin.events.categories'), route: { name: 'AdminCategorieEvenements' }, icon: 'mdi-tag-multiple-outline' },
          { label: t('nav.admin.events.events'), route: { name: 'AdminEvenements' }, icon: 'mdi-calendar-month-outline' },
          { label: t('nav.admin.events.participation'), route: { name: 'AdminParticipations' }, icon: 'mdi-domain' },
          { label: t('nav.admin.events.interviews'), route: { name: 'AdminEntretiens' }, icon: 'mdi-calendar-account-outline' },
          { label: t('nav.admin.events.feedbacks'), route: { name: 'AdminFeedbacks' }, icon: 'mdi-message-text-outline' },
        ],
      },
      {
        label: t('nav.admin.crm.title'),
        icon: 'mdi-hubspot',
        children: [
          { label: t('nav.admin.crm.import'), route: { name: 'AdminImportCandidats' }, icon: 'mdi-upload' },
          { label: t('nav.admin.crm.sync'), route: { name: 'AdminSyncCrm' }, icon: 'mdi-sync' },
        ],
      },
      {
        label: t('nav.admin.talents'),
        route: { name: 'AdminTalents' },
        icon: 'mdi-account-tie-outline',
      },
      {
        label: t('nav.admin.companies'),
        route: { name: 'AdminEntreprises' },
        icon: 'mdi-office-building-outline',
      },
      {
        label: t('nav.admin.media.title'),
        icon: 'mdi-newspaper-variant-outline',
        children: [
          { label: t('nav.admin.media.categories'), route: { name: 'AdminMediaCategories' }, icon: 'mdi-folder-multiple-outline' },
          { label: t('nav.admin.media.articles'), route: { name: 'AdminArticles' }, icon: 'mdi-file-document-outline' },
        ],
      },
      {
        label: t('nav.admin.legalPages'),
        route: { name: 'AdminLegalPages' },
        icon: 'mdi-file-certificate-outline',
      },
      {
        label: t('nav.admin.plans'),
        route: { name: 'AdminPlans' },
        icon: 'mdi-crown-outline',
      },
      {
        label: t('nav.admin.admins'),
        route: { name: 'AdminAdmins' },
        icon: 'mdi-shield-account-outline',
      },
    ]
  }

  if (role === 'entreprise') {
    return [
      { label: t('nav.company.dashboard'), route: { name: 'EntrepriseDashboard' }, icon: 'mdi-view-dashboard-outline' },
      { label: t('nav.company.offers'), route: { name: 'EntrepriseOffres' }, icon: 'mdi-briefcase-outline' },
      { label: t('nav.company.applications'), route: { name: 'EntrepriseCandidatures' }, icon: 'mdi-account-multiple-outline' },
      { label: t('nav.company.events'), route: { name: 'EntrepriseEvenements' }, icon: 'mdi-calendar-star' },
      { label: t('nav.company.articles'), route: { name: 'EntrepriseArticles' }, icon: 'mdi-newspaper-variant-outline' },
      { label: t('nav.company.interviews'), route: { name: 'EntrepriseEntretiens' }, icon: 'mdi-calendar-account-outline' },
      { label: t('nav.company.profile'), route: { name: 'EntrepriseProfile' }, icon: 'mdi-account-circle-outline' },
    ]
  }

  if (role === 'talent') {
    return [
      { label: t('nav.talent.applications'), route: { name: 'TalentCandidatures' }, icon: 'mdi-briefcase-check-outline' },
      { label: t('nav.talent.favorites'), route: { name: 'TalentFavoris' }, icon: 'mdi-heart-outline' },
      { label: t('nav.talent.events'), route: { name: 'TalentEvenements' }, icon: 'mdi-calendar-star' },
      { label: t('nav.talent.interviews'), route: { name: 'TalentEntretiens' }, icon: 'mdi-calendar-account-outline' },
      { label: t('nav.talent.feedbacks'), route: { name: 'TalentFeedbacks' }, icon: 'mdi-message-text-outline' },
      { label: t('nav.talent.profile'), route: { name: 'TalentProfile' }, icon: 'mdi-account-circle-outline' },
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
/* Enfants : pas d'icône → réduire le padding gauche */
:deep(.v-list-group__items .child-nav-item) {
  padding-inline-start: 40px !important;
}
</style>
