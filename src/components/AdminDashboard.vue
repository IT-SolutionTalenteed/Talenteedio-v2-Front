<template>
  <div>
    <h1>Dashboard Administrateur</h1>

    <nav>
      <button @click="activeTab = 'overview'">Vue d'ensemble</button>

      <!-- Événements -->
      <button @click="activeTab = 'categorie-evenements'">Catégories événement</button>
      <button @click="activeTab = 'evenements'">Événements</button>

      <!-- Offres -->
      <button @click="activeTab = 'offres'">Offres d'emploi</button>

      <!-- Contenu -->
      <button @click="activeTab = 'media-categories'">Catégories Média</button>
      <button @click="activeTab = 'articles'">Articles</button>

      <!-- Entreprises & Talents -->
      <button @click="activeTab = 'entreprises'">Entreprises</button>
      <button @click="activeTab = 'talents'">Talents</button>
      <button @click="activeTab = 'entretiens'">Entretiens par stand</button>
      <button @click="activeTab = 'feedbacks'">Feedbacks</button>
      <button @click="activeTab = 'import-candidats'">Import XLS</button>

      <!-- Référentiels -->
      <button @click="activeTab = 'job-contracts'">Contrats de travail</button>
      <button @click="activeTab = 'job-modes'">Modes de travail</button>
      <button @click="activeTab = 'skills'">Compétences</button>
      <button @click="activeTab = 'study-levels'">Niveaux d'étude</button>
      <button @click="activeTab = 'experiences'">Expériences</button>
      <button @click="activeTab = 'languages'">Langues</button>
      <button @click="activeTab = 'activity-sectors'">Secteurs d'activité</button>
      <button @click="activeTab = 'legal-pages'">CGU / Mentions légales</button>

      <button @click="logout" style="background-color: #dc3545;">Déconnexion</button>
    </nav>

    <!-- Vue d'ensemble -->
    <div v-if="activeTab === 'overview'">
      <h2>Bienvenue dans l'espace administrateur</h2>
      <p>Vous avez accès à toutes les fonctionnalités d'administration.</p>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'

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

const router = useRouter()
const activeTab = ref('overview')

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
