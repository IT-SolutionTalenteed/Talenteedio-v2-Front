<template>
  <PageHeader
    title="Dashboard Administrateur"
    page="Dashboard"
    :breadcrumbs="breadcrumbs"
  />

  <div class="page-body">
    <!-- Vue d'ensemble -->
    <div v-if="activeTab === 'overview'" class="container-xl">
      <!-- Message de bienvenue -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card card-md">
            <div class="card-stamp card-stamp-lg">
              <div class="card-stamp-icon bg-primary">
                <i class="bi bi-shield-check"></i>
              </div>
            </div>
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-10">
                  <h3 class="h1">Bienvenue dans l'espace administrateur</h3>
                  <div class="markdown text-secondary">
                    Vous avez accès à toutes les fonctionnalités d'administration.
                    Gérez les utilisateurs, les offres d'emploi, les candidatures et bien plus encore.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row row-deck row-cards">
        <!-- Stats Cards avec icônes -->
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="avatar bg-primary-stat">
                    <i class="bi bi-people-fill"></i>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">
                    {{ totalTalents !== null ? totalTalents : '...' }} Talents
                  </div>
                  <div class="text-secondary">Inscrits</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="avatar bg-success-stat">
                    <i class="bi bi-building"></i>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">
                    {{ totalEntreprises !== null ? totalEntreprises : '...' }} Entreprises
                  </div>
                  <div class="text-secondary">Actives</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="avatar bg-info-stat">
                    <i class="bi bi-briefcase-fill"></i>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">Offres d'emploi</div>
                  <div class="text-secondary">Publiées</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="avatar bg-warning-stat">
                    <i class="bi bi-calendar-event-fill"></i>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">Événements</div>
                  <div class="text-secondary">À venir</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Actions rapides</h3>
            </div>
            <div class="list-group list-group-flush">
              <router-link 
                :to="{ name: 'AdminTalents' }" 
                class="list-group-item list-group-item-action d-flex align-items-center"
              >
                <span class="avatar avatar-sm me-3 bg-primary-lt">
                  <i class="bi bi-people-fill"></i>
                </span>
                <div class="flex-fill">
                  <div class="font-weight-medium">Gérer les talents</div>
                  <div class="text-secondary small">Voir et modifier les profils</div>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
              
              <router-link 
                :to="{ name: 'AdminEntreprises' }" 
                class="list-group-item list-group-item-action d-flex align-items-center"
              >
                <span class="avatar avatar-sm me-3 bg-success-lt">
                  <i class="bi bi-building"></i>
                </span>
                <div class="flex-fill">
                  <div class="font-weight-medium">Gérer les entreprises</div>
                  <div class="text-secondary small">Administrer les comptes</div>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
              
              <router-link 
                :to="{ name: 'AdminOffres' }" 
                class="list-group-item list-group-item-action d-flex align-items-center"
              >
                <span class="avatar avatar-sm me-3 bg-info-lt">
                  <i class="bi bi-briefcase-fill"></i>
                </span>
                <div class="flex-fill">
                  <div class="font-weight-medium">Offres d'emploi</div>
                  <div class="text-secondary small">Gérer les publications</div>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
              
              <router-link 
                :to="{ name: 'AdminEvenements' }" 
                class="list-group-item list-group-item-action d-flex align-items-center"
              >
                <span class="avatar avatar-sm me-3 bg-warning-lt">
                  <i class="bi bi-calendar-event-fill"></i>
                </span>
                <div class="flex-fill">
                  <div class="font-weight-medium">Événements</div>
                  <div class="text-secondary small">Planifier et organiser</div>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Gestion du contenu -->
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Gestion du contenu</h3>
            </div>
            <div class="list-group list-group-flush">
              <router-link 
                :to="{ name: 'AdminArticles' }" 
                class="list-group-item list-group-item-action d-flex align-items-center"
              >
                <span class="avatar avatar-sm me-3 bg-purple-lt">
                  <i class="bi bi-file-earmark-text-fill"></i>
                </span>
                <div class="flex-fill">
                  <div class="font-weight-medium">Articles</div>
                  <div class="text-secondary small">Gérer les publications</div>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
              
              <router-link 
                :to="{ name: 'AdminMediaCategories' }" 
                class="list-group-item list-group-item-action d-flex align-items-center"
              >
                <span class="avatar avatar-sm me-3 bg-pink-lt">
                  <i class="bi bi-folder-fill"></i>
                </span>
                <div class="flex-fill">
                  <div class="font-weight-medium">Catégories média</div>
                  <div class="text-secondary small">Organiser les contenus</div>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
              
              <router-link 
                :to="{ name: 'AdminLegalPages' }" 
                class="list-group-item list-group-item-action d-flex align-items-center"
              >
                <span class="avatar avatar-sm me-3 bg-cyan-lt">
                  <i class="bi bi-file-earmark-ruled-fill"></i>
                </span>
                <div class="flex-fill">
                  <div class="font-weight-medium">Pages légales</div>
                  <div class="text-secondary small">CGU, mentions légales</div>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
              
              <router-link 
                :to="{ name: 'AdminImportCandidats' }" 
                class="list-group-item list-group-item-action d-flex align-items-center"
              >
                <span class="avatar avatar-sm me-3 bg-teal-lt">
                  <i class="bi bi-upload"></i>
                </span>
                <div class="flex-fill">
                  <div class="font-weight-medium">Import candidats</div>
                  <div class="text-secondary small">Importer en masse</div>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Référentiels -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Référentiels</h3>
              <div class="card-subtitle">Gérer les données de référence du système</div>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <router-link :to="{ name: 'AdminJobContracts' }" class="btn btn-outline-primary w-100">
                    <i class="bi bi-file-text me-2"></i>
                    Types de contrat
                  </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                  <router-link :to="{ name: 'AdminJobModes' }" class="btn btn-outline-success w-100">
                    <i class="bi bi-laptop me-2"></i>
                    Modes de travail
                  </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                  <router-link :to="{ name: 'AdminSkills' }" class="btn btn-outline-info w-100">
                    <i class="bi bi-star me-2"></i>
                    Compétences
                  </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                  <router-link :to="{ name: 'AdminStudyLevels' }" class="btn btn-outline-warning w-100">
                    <i class="bi bi-mortarboard me-2"></i>
                    Niveaux d'études
                  </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                  <router-link :to="{ name: 'AdminExperiences' }" class="btn btn-outline-purple w-100">
                    <i class="bi bi-briefcase me-2"></i>
                    Expériences
                  </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                  <router-link :to="{ name: 'AdminLanguages' }" class="btn btn-outline-pink w-100">
                    <i class="bi bi-translate me-2"></i>
                    Langues
                  </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                  <router-link :to="{ name: 'AdminActivitySectors' }" class="btn btn-outline-cyan w-100">
                    <i class="bi bi-diagram-3 me-2"></i>
                    Secteurs d'activité
                  </router-link>
                </div>
                <div class="col-md-3 col-sm-6">
                  <router-link :to="{ name: 'AdminCategorieEvenements' }" class="btn btn-outline-teal w-100">
                    <i class="bi bi-tags me-2"></i>
                    Catégories événements
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Événements -->
    <CategorieEvenementList v-if="activeTab === 'categorie-evenements'" />
    <EvenementList v-if="activeTab === 'evenements'" />

    <!-- Offres -->
    <OffreList v-if="activeTab === 'offres'" />

    <!-- Contenu -->
    <MediaCategoryList v-if="activeTab === 'media-categories'" />
    <ArticleList v-if="activeTab === 'articles'" />

    <!-- Entreprises & Talents -->
    <EntrepriseList v-if="activeTab === 'entreprises'" />
    <TalentList v-if="activeTab === 'talents'" />
    <EntretienList v-if="activeTab === 'entretiens'" />
    <FeedbackList v-if="activeTab === 'feedbacks'" />
    <ImportCandidats v-if="activeTab === 'import-candidats'" />
    <SyncCrm v-if="activeTab === 'sync-crm'" />

    <!-- Référentiels -->
    <JobContractList v-if="activeTab === 'job-contracts'" />
    <JobModeList v-if="activeTab === 'job-modes'" />
    <SkillList v-if="activeTab === 'skills'" />
    <StudyLevelList v-if="activeTab === 'study-levels'" />
    <ExperienceList v-if="activeTab === 'experiences'" />
    <LanguageList v-if="activeTab === 'languages'" />
    <ActivitySectorList v-if="activeTab === 'activity-sectors'" />
    <LegalPageList v-if="activeTab === 'legal-pages'" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { authService } from '../services/api.js'

import PageHeader from './layout/PageHeader.vue'

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

const router = useRouter()
const route = useRoute()

// Déterminer l'onglet actif basé sur la route
const activeTab = computed(() => {
  const path = route.path.split('/').pop()
  return path || 'overview'
})

const totalTalents    = ref(null)
const totalEntreprises = ref(null)

const breadcrumbs = ref([
  { label: 'Accueil', route: { name: 'Home' } }
])

onMounted(async () => {
  try {
    const [talentsRes, entreprisesRes] = await Promise.all([
      api.get('/admin/talents?page=1&per_page=1'),
      api.get('/admin/entreprises'),
    ])
    totalTalents.value     = talentsRes.data.total ?? null
    const ents = entreprisesRes.data
    totalEntreprises.value = Array.isArray(ents) ? ents.length : (ents.total ?? null)
  } catch {}
})

const logout = async () => {
  try {
    await authService.logout()
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/login')
  }
}
</script>
