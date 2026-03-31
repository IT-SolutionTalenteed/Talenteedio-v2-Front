import { createI18n } from 'vue-i18n'

// Import French translations
import frCommon from './locales/fr/common.json'
import frHome from './locales/fr/home.json'
import frAnnonces from './locales/fr/annonces.json'
import frAuth from './locales/fr/auth.json'
import frFooter from './locales/fr/footer.json'
import frEntreprises from './locales/fr/entreprises.json'
import frBlog from './locales/fr/blog.json'

// Import English translations
import enCommon from './locales/en/common.json'
import enHome from './locales/en/home.json'
import enAnnonces from './locales/en/annonces.json'
import enAuth from './locales/en/auth.json'
import enFooter from './locales/en/footer.json'
import enEntreprises from './locales/en/entreprises.json'
import enBlog from './locales/en/blog.json'

// Merge translations with proper nesting
const fr = {
  ...frCommon,
  home: frHome,
  annonces: frAnnonces,
  auth: frAuth,
  footer: frFooter,
  entreprises: frEntreprises,
  blog: frBlog
}

const en = {
  ...enCommon,
  home: enHome,
  annonces: enAnnonces,
  auth: enAuth,
  footer: enFooter,
  entreprises: enEntreprises,
  blog: enBlog
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr,
    en
  }
})

export default i18n
