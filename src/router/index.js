import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import TalentDashboard from '../components/TalentDashboard.vue'
import EntrepriseDashboard from '../components/EntrepriseDashboard.vue'
import TestAuth from '../components/TestAuth.vue'
import GoogleCallback from '../components/GoogleCallback.vue'
import Annonces from '../components/Annonces.vue'
import Entreprises from '../components/Entreprises.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/annonces',
    name: 'Annonces',
    component: Annonces
  },
  {
    path: '/entreprises',
    name: 'Entreprises',
    component: Entreprises
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
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
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