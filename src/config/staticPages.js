/**
 * Configuration des pages statiques
 * 
 * Ce fichier centralise la configuration de toutes les pages statiques HTML
 * qui sont servies depuis le dossier public/static/
 */

export const staticPages = [
  {
    name: 'corporate',
    path: '/static/corporate',
    title: 'Solutions Corporate',
    description: 'Solutions sur-mesure pour grandes entreprises',
    icon: 'fa-building-columns',
    category: 'entreprise',
    inMenu: true
  },
  {
    name: 'company',
    path: '/static/company',
    title: 'Espace Recruteurs',
    description: 'Créer un compte entreprise',
    icon: 'fa-building',
    category: 'entreprise',
    inMenu: true
  },
  {
    name: 'entreprises',
    path: '/static/entreprises',
    title: 'Entreprises Partenaires',
    description: 'Découvrez nos entreprises partenaires',
    icon: 'fa-handshake',
    category: 'entreprise',
    inMenu: false
  },
  {
    name: 'talent',
    path: '/static/talent',
    title: 'Espace Talents',
    description: 'Rejoignez notre communauté de talents',
    icon: 'fa-user-tie',
    category: 'talent',
    inMenu: true
  },
  {
    name: 'talent-landing',
    path: '/static/talent-landing',
    title: 'Devenir Talent',
    description: 'Page d\'atterrissage pour les talents',
    icon: 'fa-star',
    category: 'talent',
    inMenu: false
  },
  {
    name: 'talent-confirm',
    path: '/static/talent-confirm',
    title: 'Confirmation',
    description: 'Confirmation d\'inscription',
    icon: 'fa-check-circle',
    category: 'talent',
    inMenu: false
  },
  {
    name: 'matching',
    path: '/static/matching',
    title: 'Matching IA',
    description: 'Notre système de matching intelligent',
    icon: 'fa-brain',
    category: 'info',
    inMenu: true
  },
  {
    name: 'comment-ca-marche',
    path: '/static/comment-ca-marche',
    title: 'Comment ça marche',
    description: 'Guide d\'utilisation de la plateforme',
    icon: 'fa-question-circle',
    category: 'info',
    inMenu: true
  },
  {
    name: 'jobs',
    path: '/static/jobs',
    title: 'Offres d\'emploi',
    description: 'Parcourez nos offres d\'emploi',
    icon: 'fa-briefcase',
    category: 'info',
    inMenu: false
  },
  {
    name: 'talents',
    path: '/static/talents',
    title: 'Annuaire Talents',
    description: 'Découvrez nos talents',
    icon: 'fa-users',
    category: 'info',
    inMenu: false
  },
  {
    name: 'corporate-landing',
    path: '/static/corporate-landing',
    title: 'Corporate Landing',
    description: 'Page d\'atterrissage corporate',
    icon: 'fa-rocket',
    category: 'entreprise',
    inMenu: false
  }
]

/**
 * Récupère une page statique par son nom
 */
export function getStaticPage(name) {
  return staticPages.find(page => page.name === name)
}

/**
 * Récupère toutes les pages d'une catégorie
 */
export function getStaticPagesByCategory(category) {
  return staticPages.filter(page => page.category === category)
}

/**
 * Récupère toutes les pages à afficher dans le menu
 */
export function getMenuStaticPages() {
  return staticPages.filter(page => page.inMenu)
}

/**
 * Récupère les pages pour entreprises
 */
export function getEntreprisePages() {
  return getStaticPagesByCategory('entreprise')
}

/**
 * Récupère les pages pour talents
 */
export function getTalentPages() {
  return getStaticPagesByCategory('talent')
}

/**
 * Récupère les pages d'information
 */
export function getInfoPages() {
  return getStaticPagesByCategory('info')
}

export default {
  staticPages,
  getStaticPage,
  getStaticPagesByCategory,
  getMenuStaticPages,
  getEntreprisePages,
  getTalentPages,
  getInfoPages
}
