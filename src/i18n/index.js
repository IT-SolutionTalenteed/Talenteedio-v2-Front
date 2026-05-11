import { createI18n } from 'vue-i18n'

// Import French translations
import frCommon from './locales/fr/common.json'
import frHome from './locales/fr/home.json'
import frAnnonces from './locales/fr/annonces.json'
import frAuth from './locales/fr/auth.json'
import frFooter from './locales/fr/footer.json'
import frBugReport from './locales/fr/bugReport.json'
import frEntreprises from './locales/fr/entreprises.json'
import frBlog from './locales/fr/blog.json'
import frEvenements from './locales/fr/evenements.json'
import frCompany from './locales/fr/company.json'
import frProfileSelection from './locales/fr/profileSelection.json'
import frTalentRegister from './locales/fr/talentRegister.json'
import frCorporateLanding from './locales/fr/corporateLanding.json'
import frCorporateConfirm from './locales/fr/corporateConfirm.json'
import frTalentConfirm from './locales/fr/talentConfirm.json'
import frFavorites from './locales/fr/favorites.json'
import frDashboard from './locales/fr/dashboard.json'
import frNav from './locales/fr/nav.json'
import frAdmin from './locales/fr/admin.json'
import frCompanyDashboard from './locales/fr/company.json'
import frTalentDashboard from './locales/fr/talent.json'
import frProfile from './locales/fr/profile.json'
import frCommonDashboard from './locales/fr/common.json'

// Import English translations
import enCommon from './locales/en/common.json'
import enHome from './locales/en/home.json'
import enAnnonces from './locales/en/annonces.json'
import enAuth from './locales/en/auth.json'
import enFooter from './locales/en/footer.json'
import enBugReport from './locales/en/bugReport.json'
import enEntreprises from './locales/en/entreprises.json'
import enBlog from './locales/en/blog.json'
import enEvenements from './locales/en/evenements.json'
import enCompany from './locales/en/company.json'
import enProfileSelection from './locales/en/profileSelection.json'
import enTalentRegister from './locales/en/talentRegister.json'
import enCorporateLanding from './locales/en/corporateLanding.json'
import enCorporateConfirm from './locales/en/corporateConfirm.json'
import enTalentConfirm from './locales/en/talentConfirm.json'
import enFavorites from './locales/en/favorites.json'
import enDashboard from './locales/en/dashboard.json'
import enNav from './locales/en/nav.json'
import enAdmin from './locales/en/admin.json'
import enCompanyDashboard from './locales/en/company.json'
import enTalentDashboard from './locales/en/talent.json'
import enProfile from './locales/en/profile.json'
import enCommonDashboard from './locales/en/common.json'

// Merge translations with proper nesting
const fr = {
  'language.french': 'Français',
  'language.english': 'Anglais',
  share: {
    title: 'Partager',
    facebook: 'Partager sur Facebook',
    twitter: 'Partager sur X',
    linkedin: 'Partager sur LinkedIn',
    copyLink: 'Copier le lien',
    copy: 'Copier',
    copied: 'Copié'
  },
  common: frCommon,
  home: frHome,
  annonces: frAnnonces,
  auth: frAuth,
  footer: frFooter,
  bugReport: frBugReport,
  entreprises: frEntreprises,
  blog: frBlog,
  evenements: frEvenements,
  company: frCompany,
  profileSelection: frProfileSelection,
  talentRegister: frTalentRegister,
  corporateLanding: frCorporateLanding,
  corporateConfirm: frCorporateConfirm,
  talentConfirm: frTalentConfirm,
  favorites: frFavorites,
  dashboard: frDashboard,
  nav: frNav,
  admin: frAdmin,
  companyDashboard: frCompanyDashboard,
  talentDashboard: frTalentDashboard,
  profile: frProfile,
  commonDashboard: frCommonDashboard
}

const en = {
  'language-french': 'French',
  'language-english': 'English',
  share: {
    title: 'Share',
    facebook: 'Share on Facebook',
    twitter: 'Share on X',
    linkedin: 'Share on LinkedIn',
    copyLink: 'Copy link',
    copy: 'Copy',
    copied: 'Copied'
  },
  common: enCommon,
  home: enHome,
  annonces: enAnnonces,
  auth: enAuth,
  footer: enFooter,
  bugReport: enBugReport,
  entreprises: enEntreprises,
  blog: enBlog,
  evenements: enEvenements,
  company: enCompany,
  profileSelection: enProfileSelection,
  talentRegister: enTalentRegister,
  corporateLanding: enCorporateLanding,
  corporateConfirm: enCorporateConfirm,
  talentConfirm: enTalentConfirm,
  favorites: enFavorites,
  dashboard: enDashboard,
  nav: enNav,
  admin: enAdmin,
  companyDashboard: enCompanyDashboard,
  talentDashboard: enTalentDashboard,
  profile: enProfile,
  commonDashboard: enCommonDashboard
}

const i18n = createI18n({
  legacy: false,
  locale: typeof window !== 'undefined' ? (localStorage.getItem('locale') || 'fr') : 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr,
    en
  },
  missingWarn: false,
  fallbackWarn: false,
  warnHtmlMessage: false,
  escapeParameter: false
})

export default i18n
