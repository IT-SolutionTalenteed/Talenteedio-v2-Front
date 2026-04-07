import { createI18n } from 'vue-i18n'

// Import French translations
import frCommon from './locales/fr/common.json'
import frHome from './locales/fr/home.json'
import frAnnonces from './locales/fr/annonces.json'
import frAuth from './locales/fr/auth.json'
import frFooter from './locales/fr/footer.json'
import frEntreprises from './locales/fr/entreprises.json'
import frBlog from './locales/fr/blog.json'
import frEvenements from './locales/fr/evenements.json'
import frCompany from './locales/fr/company.json'

// Import English translations
import enCommon from './locales/en/common.json'
import enHome from './locales/en/home.json'
import enAnnonces from './locales/en/annonces.json'
import enAuth from './locales/en/auth.json'
import enFooter from './locales/en/footer.json'
import enEntreprises from './locales/en/entreprises.json'
import enBlog from './locales/en/blog.json'
import enEvenements from './locales/en/evenements.json'
import enCompany from './locales/en/company.json'

// Merge translations with proper nesting
const fr = {
  ...frCommon,
  home: frHome,
  annonces: frAnnonces,
  auth: frAuth,
  footer: frFooter,
  entreprises: frEntreprises,
  blog: frBlog,
  evenements: frEvenements,
  company: frCompany
}

const en = {
  ...enCommon,
  home: enHome,
  annonces: enAnnonces,
  auth: enAuth,
  footer: enFooter,
  entreprises: enEntreprises,
  blog: enBlog,
  evenements: enEvenements,
  company: enCompany
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr,
    en
  },
  missingWarn: false,
  fallbackWarn: false,
  warnHtmlMessage: false,
  modifiers: {
    raw: (str) => str
  }
})

export default i18n
