import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import ProfileSelection from '../components/ProfileSelection.vue'
import TalentRegister from '../components/TalentRegister.vue'
import TalentConfirm from '../components/TalentConfirm.vue'
import CorporateLanding from '../components/CorporateLanding.vue'
import CorporateConfirm from '../components/CorporateConfirm.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import TalentDashboard from '../components/TalentDashboard.vue'
import EntrepriseDashboard from '../components/EntrepriseDashboard.vue'
import VerticalLayout from '../components/layout/VerticalLayout.vue'
import GoogleCallback from '../components/GoogleCallback.vue'
import Annonces from '../components/Annonces.vue'
import AnnonceDetail from '../components/AnnonceDetail.vue'
import Entreprises from '../components/Entreprises.vue'
import EntrepriseDetail from '../components/EntrepriseDetail.vue'
import CategorieEvenementPublic from '../components/CategorieEvenementPublic.vue'
import TousLesEvenements from '../components/TousLesEvenements.vue'
import Blog from '../components/Blog.vue'
import ArticleDetail from '../components/ArticleDetail.vue'
import EvenementDetail from '../components/EvenementDetail.vue'
import MesFavoris from '../components/MesFavoris.vue'
import LegalPage from '../components/LegalPage.vue'
import EditProfile from '../components/EditProfile.vue'
import CompanyLanding from '../components/CompanyLanding.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import ResetPassword from '../components/ResetPassword.vue'

// Admin form pages
import JobContractForm from '../components/admin/JobContractForm.vue'
import JobModeForm from '../components/admin/JobModeForm.vue'
import SkillForm from '../components/admin/SkillForm.vue'
import StudyLevelForm from '../components/admin/StudyLevelForm.vue'
import ExperienceForm from '../components/admin/ExperienceForm.vue'
import LanguageForm from '../components/admin/LanguageForm.vue'
import ActivitySectorForm from '../components/admin/ActivitySectorForm.vue'
import MediaCategoryForm from '../components/admin/MediaCategoryForm.vue'
import LegalPageForm from '../components/admin/LegalPageForm.vue'
import AdminArticleForm from '../components/admin/ArticleForm.vue'
import EntrepriseForm from '../components/admin/EntrepriseForm.vue'
import OffreAdminForm from '../components/admin/OffreForm.vue'
import EvenementForm from '../components/admin/EvenementForm.vue'
import CategorieEvenementForm from '../components/admin/CategorieEvenementForm.vue'
import TalentForm from '../components/admin/TalentForm.vue'
import PlanForm from '../components/admin/PlanForm.vue'

// Entreprise form pages
import EntrepriseOffreForm from '../components/entreprise/OffreForm.vue'
import EntrepriseArticleForm from '../components/entreprise/ArticleForm.vue'

// Talent form pages
import FeedbackForm from '../components/talent/FeedbackForm.vue'

const adminMeta = { requiresAuth: true, role: 'admin' }
const entrepriseMeta = { requiresAuth: true, role: 'entreprise' }
const talentMeta = { requiresAuth: true, role: 'talent' }

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/company',
    name: 'CompanyLanding',
    component: CompanyLanding
  },
  {
    path: '/annonces',
    name: 'Annonces',
    component: Annonces
  },
  {
    path: '/annonces/:id',
    name: 'AnnonceDetail',
    component: AnnonceDetail
  },
  {
    path: '/entreprises',
    name: 'Entreprises',
    component: Entreprises
  },
  {
    path: '/entreprises/:id',
    name: 'EntrepriseDetail',
    component: EntrepriseDetail
  },
  {
    path: '/evenements',
    name: 'TousLesEvenements',
    component: TousLesEvenements
  },
  {
    path: '/evenements/categorie/:id',
    name: 'CategorieEvenementPublic',
    component: CategorieEvenementPublic
  },
  {
    path: '/evenements/:id',
    name: 'EvenementDetail',
    component: EvenementDetail
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:id',
    name: 'ArticleDetail',
    component: ArticleDetail
  },
  {
    path: '/favoris',
    name: 'MesFavoris',
    component: MesFavoris,
    meta: { requiresAuth: true, role: 'talent' }
  },
  {
    path: '/legal/:slug',
    name: 'LegalPage',
    component: LegalPage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: Register
  // },
  {
    path: '/profile-selection',
    name: 'ProfileSelection',
    component: ProfileSelection
  },
  {
    path: '/talent-register',
    name: 'TalentRegister',
    component: TalentRegister
  },
  {
    path: '/talent-confirm',
    name: 'TalentConfirm',
    component: TalentConfirm
  },
  {
    path: '/corporate-register',
    name: 'CorporateRegister',
    component: CorporateLanding
  },
  {
    path: '/corporate-confirm',
    name: 'CorporateConfirm',
    component: CorporateConfirm
  },
  {
    path: '/auth/google/callback',
    name: 'GoogleCallback',
    component: GoogleCallback
  },
  {
    path: '/admin',
    component: VerticalLayout,
    meta: adminMeta,
    redirect: '/admin/overview',
    children: [
      { path: 'overview', name: 'AdminOverview', component: AdminDashboard, meta: adminMeta },
      { path: 'entreprises', name: 'AdminEntreprises', component: AdminDashboard, meta: adminMeta },
      { path: 'entreprises/create', name: 'AdminEntrepriseCreate', component: EntrepriseForm, meta: adminMeta },
      { path: 'entreprises/:id/edit', name: 'AdminEntrepriseEdit', component: EntrepriseForm, meta: adminMeta },
      { path: 'talents', name: 'AdminTalents', component: AdminDashboard, meta: adminMeta },
      { path: 'talents/:id/edit', name: 'AdminTalentEdit', component: TalentForm, meta: adminMeta },
      { path: 'entretiens', name: 'AdminEntretiens', component: AdminDashboard, meta: adminMeta },
      { path: 'feedbacks', name: 'AdminFeedbacks', component: AdminDashboard, meta: adminMeta },
      { path: 'import-candidats', name: 'AdminImportCandidats', component: AdminDashboard, meta: adminMeta },
      { path: 'sync-crm', name: 'AdminSyncCrm', component: AdminDashboard, meta: adminMeta },
      { path: 'offres', name: 'AdminOffres', component: AdminDashboard, meta: adminMeta },
      { path: 'offres/create', name: 'AdminOffreCreate', component: OffreAdminForm, meta: adminMeta },
      { path: 'offres/:id/edit', name: 'AdminOffreEdit', component: OffreAdminForm, meta: adminMeta },
      { path: 'candidatures', name: 'AdminCandidatures', component: AdminDashboard, meta: adminMeta },
      { path: 'evenement-participations', name: 'AdminParticipations', component: AdminDashboard, meta: adminMeta },
      { path: 'categorie-evenements', name: 'AdminCategorieEvenements', component: AdminDashboard, meta: adminMeta },
      { path: 'categorie-evenements/create', name: 'AdminCategorieEvenementCreate', component: CategorieEvenementForm, meta: adminMeta },
      { path: 'categorie-evenements/:id/edit', name: 'AdminCategorieEvenementEdit', component: CategorieEvenementForm, meta: adminMeta },
      { path: 'evenements', name: 'AdminEvenements', component: AdminDashboard, meta: adminMeta },
      { path: 'evenements/create', name: 'AdminEvenementCreate', component: EvenementForm, meta: adminMeta },
      { path: 'evenements/:id/edit', name: 'AdminEvenementEdit', component: EvenementForm, meta: adminMeta },
      { path: 'media-categories', name: 'AdminMediaCategories', component: AdminDashboard, meta: adminMeta },
      { path: 'media-categories/create', name: 'AdminMediaCategoryCreate', component: MediaCategoryForm, meta: adminMeta },
      { path: 'media-categories/:id/edit', name: 'AdminMediaCategoryEdit', component: MediaCategoryForm, meta: adminMeta },
      { path: 'articles', name: 'AdminArticles', component: AdminDashboard, meta: adminMeta },
      { path: 'articles/create', name: 'AdminArticleCreate', component: AdminArticleForm, meta: adminMeta },
      { path: 'articles/:id/edit', name: 'AdminArticleEdit', component: AdminArticleForm, meta: adminMeta },
      { path: 'job-contracts', name: 'AdminJobContracts', component: AdminDashboard, meta: adminMeta },
      { path: 'job-contracts/create', name: 'AdminJobContractCreate', component: JobContractForm, meta: adminMeta },
      { path: 'job-contracts/:id/edit', name: 'AdminJobContractEdit', component: JobContractForm, meta: adminMeta },
      { path: 'job-modes', name: 'AdminJobModes', component: AdminDashboard, meta: adminMeta },
      { path: 'job-modes/create', name: 'AdminJobModeCreate', component: JobModeForm, meta: adminMeta },
      { path: 'job-modes/:id/edit', name: 'AdminJobModeEdit', component: JobModeForm, meta: adminMeta },
      { path: 'skills', name: 'AdminSkills', component: AdminDashboard, meta: adminMeta },
      { path: 'skills/create', name: 'AdminSkillCreate', component: SkillForm, meta: adminMeta },
      { path: 'skills/:id/edit', name: 'AdminSkillEdit', component: SkillForm, meta: adminMeta },
      { path: 'study-levels', name: 'AdminStudyLevels', component: AdminDashboard, meta: adminMeta },
      { path: 'study-levels/create', name: 'AdminStudyLevelCreate', component: StudyLevelForm, meta: adminMeta },
      { path: 'study-levels/:id/edit', name: 'AdminStudyLevelEdit', component: StudyLevelForm, meta: adminMeta },
      { path: 'experiences', name: 'AdminExperiences', component: AdminDashboard, meta: adminMeta },
      { path: 'experiences/create', name: 'AdminExperienceCreate', component: ExperienceForm, meta: adminMeta },
      { path: 'experiences/:id/edit', name: 'AdminExperienceEdit', component: ExperienceForm, meta: adminMeta },
      { path: 'languages', name: 'AdminLanguages', component: AdminDashboard, meta: adminMeta },
      { path: 'languages/create', name: 'AdminLanguageCreate', component: LanguageForm, meta: adminMeta },
      { path: 'languages/:id/edit', name: 'AdminLanguageEdit', component: LanguageForm, meta: adminMeta },
      { path: 'activity-sectors', name: 'AdminActivitySectors', component: AdminDashboard, meta: adminMeta },
      { path: 'activity-sectors/create', name: 'AdminActivitySectorCreate', component: ActivitySectorForm, meta: adminMeta },
      { path: 'activity-sectors/:id/edit', name: 'AdminActivitySectorEdit', component: ActivitySectorForm, meta: adminMeta },
      { path: 'legal-pages', name: 'AdminLegalPages', component: AdminDashboard, meta: adminMeta },
      { path: 'legal-pages/create', name: 'AdminLegalPageCreate', component: LegalPageForm, meta: adminMeta },
      { path: 'legal-pages/:id/edit', name: 'AdminLegalPageEdit', component: LegalPageForm, meta: adminMeta },
      { path: 'plans', name: 'AdminPlans', component: AdminDashboard, meta: adminMeta },
      { path: 'plans/create', name: 'AdminPlanCreate', component: PlanForm, meta: adminMeta },
      { path: 'plans/:id/edit', name: 'AdminPlanEdit', component: PlanForm, meta: adminMeta },
      { path: 'admins', name: 'AdminAdmins', component: AdminDashboard, meta: adminMeta },
      { path: 'profile', name: 'AdminProfile', component: EditProfile, meta: adminMeta },
    ]
  },
  // TALENT
  {
    path: '/talent',
    component: VerticalLayout,
    meta: talentMeta,
    redirect: '/talent/offres',
    children: [
      { path: 'offres',        name: 'TalentDashboard',    component: TalentDashboard, meta: talentMeta },
      { path: 'candidatures',  name: 'TalentCandidatures', component: TalentDashboard, meta: talentMeta },
      { path: 'favoris',       name: 'TalentFavoris',      component: TalentDashboard, meta: talentMeta },
      { path: 'evenements',    name: 'TalentEvenements',   component: TalentDashboard, meta: talentMeta },
      { path: 'entretiens',    name: 'TalentEntretiens',   component: TalentDashboard, meta: talentMeta },
      { path: 'feedbacks',     name: 'TalentFeedbacks',    component: TalentDashboard, meta: talentMeta },
      { path: 'profile',       name: 'TalentProfile',      component: TalentDashboard, meta: talentMeta },
      { path: 'feedbacks/:id/edit', name: 'TalentFeedbackEdit', component: FeedbackForm, meta: talentMeta },
    ]
  },
  // ENTREPRISE
  {
    path: '/entreprise',
    component: VerticalLayout,
    meta: entrepriseMeta,
    redirect: '/entreprise/overview',
    children: [
      { path: 'overview',      name: 'EntrepriseDashboard',   component: EntrepriseDashboard, meta: entrepriseMeta },
      { path: 'offres',        name: 'EntrepriseOffres',      component: EntrepriseDashboard, meta: entrepriseMeta },
      { path: 'candidatures',  name: 'EntrepriseCandidatures',component: EntrepriseDashboard, meta: entrepriseMeta },
      { path: 'evenements',    name: 'EntrepriseEvenements',  component: EntrepriseDashboard, meta: entrepriseMeta },
      { path: 'articles',      name: 'EntrepriseArticles',    component: EntrepriseDashboard, meta: entrepriseMeta },
      { path: 'entretiens',    name: 'EntrepriseEntretiens',  component: EntrepriseDashboard, meta: entrepriseMeta },
      { path: 'profile',       name: 'EntrepriseProfile',     component: EntrepriseDashboard, meta: entrepriseMeta },
      { path: 'offres/create',      name: 'EntrepriseOffreCreate',  component: EntrepriseOffreForm,  meta: entrepriseMeta },
      { path: 'offres/:id/edit',    name: 'EntrepriseOffreEdit',    component: EntrepriseOffreForm,  meta: entrepriseMeta },
      { path: 'articles/create',    name: 'EntrepriseArticleCreate',component: EntrepriseArticleForm,meta: entrepriseMeta },
      { path: 'articles/:id/edit',  name: 'EntrepriseArticleEdit',  component: EntrepriseArticleForm,meta: entrepriseMeta },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Si l'utilisateur utilise le bouton retour/avant du navigateur
    if (savedPosition) {
      return savedPosition
    }
    // Sinon, toujours être en haut de la page instantanément
    return { top: 0 }
  }
})

// Navigation guard pour vérifier l'authentification
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login')
    } else if (to.meta.role && to.meta.role !== userRole) {
      // Rediriger vers le dashboard approprié selon le rôle
      switch (userRole) {
        case 'admin':
          next('/admin')
          break
        case 'talent':
          next('/talent')
          break
        case 'entreprise':
          next('/entreprise')
          break
        default:
          next('/login')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
