import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import TalentDashboard from '../components/TalentDashboard.vue'
import EntrepriseDashboard from '../components/EntrepriseDashboard.vue'
import VerticalLayout from '../components/layout/VerticalLayout.vue'
import TestAuth from '../components/TestAuth.vue'
import GoogleCallback from '../components/GoogleCallback.vue'
import Annonces from '../components/Annonces.vue'
import AnnonceDetail from '../components/AnnonceDetail.vue'
import Entreprises from '../components/Entreprises.vue'
import EntrepriseDetail from '../components/EntrepriseDetail.vue'
import CategorieEvenementPublic from '../components/CategorieEvenementPublic.vue'
import Blog from '../components/Blog.vue'
import ArticleDetail from '../components/ArticleDetail.vue'
import EvenementDetail from '../components/EvenementDetail.vue'
import MesFavoris from '../components/MesFavoris.vue'
import LegalPage from '../components/LegalPage.vue'

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
    path: '/terms-and-conditions',
    name: 'TermsAndConditions',
    component: LegalPage
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: LegalPage
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
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/test-auth',
    name: 'TestAuth',
    component: TestAuth
  },
  {
    path: '/auth/google/callback',
    name: 'GoogleCallback',
    component: GoogleCallback
  },
  {
    path: '/admin',
    component: VerticalLayout,
    meta: { requiresAuth: true, role: 'admin' },
    redirect: '/admin/overview',
    children: [
      { path: 'overview', name: 'AdminOverview', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'entreprises', name: 'AdminEntreprises', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'talents', name: 'AdminTalents', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'entretiens', name: 'AdminEntretiens', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'feedbacks', name: 'AdminFeedbacks', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'import-candidats', name: 'AdminImportCandidats', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'sync-crm', name: 'AdminSyncCrm', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'offres', name: 'AdminOffres', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'categorie-evenements', name: 'AdminCategorieEvenements', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'evenements', name: 'AdminEvenements', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'media-categories', name: 'AdminMediaCategories', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'articles', name: 'AdminArticles', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'job-contracts', name: 'AdminJobContracts', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'job-modes', name: 'AdminJobModes', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'skills', name: 'AdminSkills', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'study-levels', name: 'AdminStudyLevels', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'experiences', name: 'AdminExperiences', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'languages', name: 'AdminLanguages', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'activity-sectors', name: 'AdminActivitySectors', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'legal-pages', name: 'AdminLegalPages', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } }
    ]
  },
  {
    path: '/talent',
    name: 'TalentDashboard',
    component: TalentDashboard,
    meta: { requiresAuth: true, role: 'talent' }
  },
  {
    path: '/entreprise',
    name: 'EntrepriseDashboard',
    component: EntrepriseDashboard,
    meta: { requiresAuth: true, role: 'entreprise' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
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