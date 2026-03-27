<template>
  <!-- Vue d'ensemble -->
  <div v-if="activeTab === 'overview'">
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
              Bienvenue dans l'espace administrateur 👋
            </div>
            <div class="text-body-2" style="color:rgba(255,255,255,0.75)">
              Gérez les utilisateurs, les offres, les candidatures et bien plus.
            </div>
          </div>
          <v-icon size="72" style="color:rgba(255,255,255,0.15)">mdi-shield-crown</v-icon>
        </div>
      </v-card-text>
    </v-card>

    <!-- Stats cards -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="xl" elevation="0" border>
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold text-primary">
                  {{ totalTalents !== null ? totalTalents : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">Talents inscrits</div>
              </div>
              <v-avatar color="primary" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-account-tie-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="xl" elevation="0" border>
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold text-success">
                  {{ totalEntreprises !== null ? totalEntreprises : '—' }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-1">Entreprises actives</div>
              </div>
              <v-avatar color="success" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-office-building-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="xl" elevation="0" border>
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold text-warning">—</div>
                <div class="text-body-2 text-medium-emphasis mt-1">Offres publiées</div>
              </div>
              <v-avatar color="warning" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-briefcase-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="xl" elevation="0" border>
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold text-info">—</div>
                <div class="text-body-2 text-medium-emphasis mt-1">Événements à venir</div>
              </div>
              <v-avatar color="info" variant="tonal" size="52" rounded="lg">
                <v-icon size="26">mdi-calendar-star</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions rapides + Contenu -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border height="100%">
          <v-card-title class="pa-5 pb-2 text-body-1 font-weight-semibold">
            <v-icon class="mr-2" color="primary" size="20">mdi-lightning-bolt</v-icon>
            Actions rapides
          </v-card-title>
          <v-list lines="two" class="py-0">
            <v-list-item
              v-for="action in quickActions"
              :key="action.title"
              :prepend-icon="action.icon"
              :title="action.title"
              :subtitle="action.subtitle"
              :base-color="action.color"
              rounded="0"
              append-icon="mdi-chevron-right"
              @click="router.push(action.route)"
            >
              <template #prepend>
                <v-avatar :color="action.color" variant="tonal" size="38" rounded="lg" class="mr-3">
                  <v-icon size="18">{{ action.icon }}</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border height="100%">
          <v-card-title class="pa-5 pb-2 text-body-1 font-weight-semibold">
            <v-icon class="mr-2" color="secondary" size="20">mdi-newspaper-variant-outline</v-icon>
            Gestion du contenu
          </v-card-title>
          <v-list lines="two" class="py-0">
            <v-list-item
              v-for="item in contentActions"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              :subtitle="item.subtitle"
              rounded="0"
              append-icon="mdi-chevron-right"
              @click="router.push(item.route)"
            >
              <template #prepend>
                <v-avatar :color="item.color" variant="tonal" size="38" rounded="lg" class="mr-3">
                  <v-icon size="18">{{ item.icon }}</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Référentiels -->
    <v-card rounded="xl" elevation="0" border>
      <v-card-title class="pa-5 pb-3 text-body-1 font-weight-semibold">
        <v-icon class="mr-2" color="secondary" size="20">mdi-cog-outline</v-icon>
        Référentiels
        <span class="text-body-2 font-weight-regular text-medium-emphasis ml-2">
          — Données de référence du système
        </span>
      </v-card-title>
      <v-card-text class="pa-5 pt-0">
        <v-row dense>
          <v-col
            v-for="ref in referentiels"
            :key="ref.title"
            cols="6" sm="4" md="3"
          >
            <v-btn
              :prepend-icon="ref.icon"
              :color="ref.color"
              variant="tonal"
              block
              rounded="lg"
              class="justify-start"
              height="44"
              @click="router.push(ref.route)"
            >
              {{ ref.title }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>

  <!-- Sous-sections admin (CRUD components) -->
  <CategorieEvenementList v-if="activeTab === 'categorie-evenements'" />
  <EvenementList          v-if="activeTab === 'evenements'" />
  <OffreList              v-if="activeTab === 'offres'" />
  <MediaCategoryList      v-if="activeTab === 'media-categories'" />
  <ArticleList            v-if="activeTab === 'articles'" />
  <EntrepriseList         v-if="activeTab === 'entreprises'" />
  <TalentList             v-if="activeTab === 'talents'" />
  <EntretienList          v-if="activeTab === 'entretiens'" />
  <FeedbackList           v-if="activeTab === 'feedbacks'" />
  <ImportCandidats        v-if="activeTab === 'import-candidats'" />
  <SyncCrm               v-if="activeTab === 'sync-crm'" />
  <CandidatureList       v-if="activeTab === 'candidatures'" />
  <ParticipationList     v-if="activeTab === 'evenement-participations'" />
  <JobContractList        v-if="activeTab === 'job-contracts'" />
  <JobModeList            v-if="activeTab === 'job-modes'" />
  <SkillList              v-if="activeTab === 'skills'" />
  <StudyLevelList         v-if="activeTab === 'study-levels'" />
  <ExperienceList         v-if="activeTab === 'experiences'" />
  <LanguageList           v-if="activeTab === 'languages'" />
  <ActivitySectorList     v-if="activeTab === 'activity-sectors'" />
  <LegalPageList          v-if="activeTab === 'legal-pages'" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api.js'

import CategorieEvenementList from './admin/CategorieEvenementList.vue'
import EvenementList from './admin/EvenementList.vue'
import OffreList from './admin/OffreList.vue'
import MediaCategoryList from './admin/MediaCategoryList.vue'
import ArticleList from './admin/ArticleList.vue'
import JobContractList from './admin/JobContractList.vue'
import JobModeList from './admin/JobModeList.vue'
import SkillList from './admin/SkillList.vue'
import StudyLevelList from './admin/StudyLevelList.vue'
import ExperienceList from './admin/ExperienceList.vue'
import LanguageList from './admin/LanguageList.vue'
import ActivitySectorList from './admin/ActivitySectorList.vue'
import LegalPageList from './admin/LegalPageList.vue'
import EntrepriseList from './admin/EntrepriseList.vue'
import TalentList from './admin/TalentList.vue'
import EntretienList from './admin/EntretienList.vue'
import FeedbackList from './admin/FeedbackList.vue'
import ImportCandidats from './admin/ImportCandidats.vue'
import SyncCrm from './admin/SyncCrm.vue'
import CandidatureList from './admin/CandidatureList.vue'
import ParticipationList from './admin/ParticipationList.vue'

const router = useRouter()
const route = useRoute()

const activeTab = computed(() => route.path.split('/').pop() || 'overview')

const totalTalents    = ref(null)
const totalEntreprises = ref(null)

onMounted(async () => {
  try {
    const [talentsRes, entreprisesRes] = await Promise.all([
      api.get('/admin/talents?page=1&per_page=1'),
      api.get('/admin/entreprises'),
    ])
    totalTalents.value = talentsRes.data.total ?? null
    const ents = entreprisesRes.data
    totalEntreprises.value = Array.isArray(ents) ? ents.length : (ents.total ?? null)
  } catch {}
})

const quickActions = [
  {
    title: 'Gérer les talents',
    subtitle: 'Voir et modifier les profils',
    icon: 'mdi-account-tie-outline',
    color: 'primary',
    route: { name: 'AdminTalents' },
  },
  {
    title: 'Gérer les entreprises',
    subtitle: 'Administrer les comptes',
    icon: 'mdi-office-building-outline',
    color: 'success',
    route: { name: 'AdminEntreprises' },
  },
  {
    title: "Offres d'emploi",
    subtitle: 'Gérer les publications',
    icon: 'mdi-briefcase-outline',
    color: 'info',
    route: { name: 'AdminOffres' },
  },
  {
    title: 'Événements',
    subtitle: 'Planifier et organiser',
    icon: 'mdi-calendar-star',
    color: 'warning',
    route: { name: 'AdminEvenements' },
  },
]

const contentActions = [
  {
    title: 'Articles',
    subtitle: 'Gérer les publications',
    icon: 'mdi-file-document-outline',
    color: 'purple',
    route: { name: 'AdminArticles' },
  },
  {
    title: 'Catégories Média',
    subtitle: 'Organiser les contenus',
    icon: 'mdi-folder-multiple-outline',
    color: 'pink',
    route: { name: 'AdminMediaCategories' },
  },
  {
    title: 'Pages légales',
    subtitle: 'CGU, mentions légales',
    icon: 'mdi-file-certificate-outline',
    color: 'teal',
    route: { name: 'AdminLegalPages' },
  },
  {
    title: 'Import candidats',
    subtitle: 'Importer en masse (XLS)',
    icon: 'mdi-upload',
    color: 'cyan',
    route: { name: 'AdminImportCandidats' },
  },
]

const referentiels = [
  { title: 'Contrats', icon: 'mdi-file-sign', color: 'primary', route: { name: 'AdminJobContracts' } },
  { title: 'Modes travail', icon: 'mdi-laptop', color: 'success', route: { name: 'AdminJobModes' } },
  { title: 'Compétences', icon: 'mdi-star-outline', color: 'info', route: { name: 'AdminSkills' } },
  { title: 'Niveaux étude', icon: 'mdi-school-outline', color: 'warning', route: { name: 'AdminStudyLevels' } },
  { title: 'Expériences', icon: 'mdi-clock-outline', color: 'purple', route: { name: 'AdminExperiences' } },
  { title: 'Langues', icon: 'mdi-translate', color: 'pink', route: { name: 'AdminLanguages' } },
  { title: 'Secteurs', icon: 'mdi-sitemap-outline', color: 'teal', route: { name: 'AdminActivitySectors' } },
  { title: 'Catég. événements', icon: 'mdi-tag-multiple-outline', color: 'cyan', route: { name: 'AdminCategorieEvenements' } },
]
</script>
