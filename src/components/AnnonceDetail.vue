<template>
  <div class="page-wrapper">
    <div class="offre-detail-page">
    <PublicNav />

    <!-- Loading -->
    <div v-if="loading" class="od-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>{{ t('annonces.detail.loading') }}</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="!offre" class="od-loading">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>{{ t('annonces.detail.notFound') }}</p>
      <router-link to="/annonces" class="btn btn--blue" style="margin-top:16px;">{{ t('annonces.detail.backToOffers') }}</router-link>
    </div>

    <template v-else>

      <!-- ══ HERO ══ -->
      <section class="od-hero">
        <div class="container">
          <div class="od-hero-inner">
            <!-- Logo -->
            <div class="od-hero-logo">
              <img v-if="offre.entreprise?.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" />
              <span v-else class="od-hero-initial">{{ offre.entreprise?.nom?.charAt(0) || '?' }}</span>
            </div>
            <!-- Infos principales -->
            <div class="od-hero-info">
              <div class="od-tags">
                <span v-for="c in offre.job_contracts" :key="c.id" class="tag tag--blue">{{ c.name }}</span>
                <span v-for="m in offre.job_modes"     :key="m.id" class="tag tag--gray">{{ m.name }}</span>
              </div>
              <h1 class="od-hero-title">{{ offre.titre }}</h1>
              <div class="od-hero-meta">
                <span v-if="offre.entreprise">
                  <i class="fa-solid fa-building"></i> {{ offre.entreprise.nom }}
                </span>
                <span v-if="offre.localisation">
                  <i class="fa-solid fa-location-dot"></i> {{ offre.localisation }}
                </span>
                <span v-if="offre.date_limite">
                  <i class="fa-solid fa-calendar"></i> {{ t('annonces.detail.deadline') }} : {{ formatDate(offre.date_limite) }}
                </span>
                <span v-if="offre.salaire">
                  <i class="fa-solid fa-coins"></i> {{ offre.salaire }} €
                </span>
              </div>
            </div>
            <!-- CTA -->
            <div class="od-hero-cta">
              <template v-if="isLoggedIn && userRole === 'talent'">
                <template v-if="dejaPostule === null">
                  <!-- Chargement de la vérification -->
                  <div style="padding: 20px;">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 24px; color: rgba(255,255,255,.6);"></i>
                  </div>
                </template>
                <template v-else-if="dejaPostule">
                  <div class="deja-postule-badge">
                    <i class="fa-solid fa-check-circle"></i>
                    <span>{{ t('annonces.detail.alreadyApplied') }}</span>
                  </div>
                  <router-link to="/talent/candidatures" class="btn btn--white btn--sm" style="margin-top:12px;">
                    <i class="fa-solid fa-folder-open" style="margin-right:6px;"></i>{{ t('annonces.detail.viewMyApplications') }}
                  </router-link>
                </template>
                <template v-else>
                  <div class="od-cta-col">
                    <div class="od-cta-row">
                      <button class="btn btn--blue btn--lg" @click="showModal = true">
                        <i class="fa-solid fa-paper-plane" style="margin-right:6px;"></i>{{ t('annonces.detail.apply') }}
                      </button>
                      <button
                        class="btn-favori-hero"
                        :class="{ 'btn-favori-hero--active': isFavori }"
                        :title="isFavori ? t('annonces.detail.removeFromFavorites') : t('annonces.detail.addToFavorites')"
                        @click="toggleFavori"
                      >
                        <i :class="isFavori ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                      </button>
                    </div>
                    <button class="btn btn--orange btn--lg" @click="matchCV" style="width:100%;">
                      <i class="fa-solid fa-wand-magic-sparkles" style="margin-right:6px;"></i>Match CV
                    </button>
                  </div>
                </template>
              </template>
              <template v-else-if="isLoggedIn">
                <p class="od-cta-note">{{ t('annonces.detail.talentOnly') }}</p>
              </template>
              <template v-else>
                <router-link :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" class="btn btn--blue btn--lg">
                  <i class="fa-solid fa-lock" style="margin-right:6px;"></i>{{ t('annonces.detail.loginToApply') }}
                </router-link>
                <router-link to="/profile-selection" class="btn btn--orange btn--lg" style="margin-top:8px;">
                  {{ t('annonces.detail.createAccount') }}
                </router-link>
              </template>
              <!-- Feedback postuler -->
              <p v-if="postuleMsg" :class="['od-apply-msg', postuleOk ? 'od-apply-msg--ok' : 'od-apply-msg--err']">
                {{ postuleMsg }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CORPS ══ -->
      <section class="od-body">
        <div class="container">
          <div class="od-layout">

            <!-- ── Contenu principal ── -->
            <div class="od-main">

              <!-- Mission -->
              <div v-if="offre.mission" class="od-block">
                <h2 class="od-block-title"><i class="fa-solid fa-bullseye"></i> {{ t('annonces.detail.mission') }}</h2>
                <div class="od-rich" v-html="offre.mission"></div>
              </div>

              <!-- Description -->
              <div v-if="offre.description" class="od-block">
                <h2 class="od-block-title"><i class="fa-solid fa-align-left"></i> {{ t('annonces.detail.jobDescription') }}</h2>
                <div class="od-rich" v-html="offre.description"></div>
              </div>

              <!-- Profil recherché -->
              <div v-if="offre.profil_recherche" class="od-block">
                <h2 class="od-block-title"><i class="fa-solid fa-user-check"></i> {{ t('annonces.detail.profileSought') }}</h2>
                <div class="od-rich" v-html="offre.profil_recherche"></div>
              </div>

              <!-- À propos -->
              <div v-if="offre.a_propos" class="od-block">
                <h2 class="od-block-title"><i class="fa-solid fa-circle-info"></i> {{ t('annonces.detail.aboutCompany') }}</h2>
                <div class="od-rich" v-html="offre.a_propos"></div>
              </div>

            </div>

            <!-- ── Sidebar ── -->
            <aside class="od-sidebar">

              <!-- Détails -->
              <div class="od-side-card">
                <h3 class="od-side-title">{{ t('annonces.detail.offerDetails') }}</h3>
                <ul class="od-detail-list">
                  <li v-if="offre.job_contracts?.length">
                    <i class="fa-solid fa-file-contract"></i>
                    <div>
                      <span class="od-detail-label">{{ t('annonces.detail.contract') }}</span>
                      <span>{{ offre.job_contracts.map(c => c.name).join(', ') }}</span>
                    </div>
                  </li>
                  <li v-if="offre.localisation">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                      <span class="od-detail-label">{{ t('annonces.detail.location') }}</span>
                      <span>{{ offre.localisation }}</span>
                    </div>
                  </li>
                  <li v-if="offre.study_levels?.length">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <div>
                      <span class="od-detail-label">{{ t('annonces.detail.studyLevel') }}</span>
                      <span>{{ offre.study_levels.map(s => s.name).join(', ') }}</span>
                    </div>
                  </li>
                  <li v-if="offre.experiences?.length">
                    <i class="fa-solid fa-briefcase"></i>
                    <div>
                      <span class="od-detail-label">{{ t('annonces.detail.experience') }}</span>
                      <span>{{ offre.experiences.map(e => e.name).join(', ') }}</span>
                    </div>
                  </li>
                  <li v-if="offre.date_limite">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <div>
                      <span class="od-detail-label">{{ t('annonces.detail.deadline2') }}</span>
                      <span>{{ formatDate(offre.date_limite) }}</span>
                    </div>
                  </li>
                  <li v-if="offre.salaire">
                    <i class="fa-solid fa-coins"></i>
                    <div>
                      <span class="od-detail-label">{{ t('annonces.detail.salary') }}</span>
                      <span>{{ offre.salaire }} €</span>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Entreprise -->
              <div v-if="offre.entreprise" class="od-side-card">
                <h3 class="od-side-title">{{ t('annonces.detail.theCompany') }}</h3>
                <div class="od-company">
                  <div class="od-company-logo">
                    <img v-if="offre.entreprise.logo_url" :src="offre.entreprise.logo_url" :alt="offre.entreprise.nom" />
                    <span v-else>{{ offre.entreprise.nom.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="od-company-name">{{ offre.entreprise.nom }}</p>
                    <p v-if="offre.entreprise.activity_sector" class="od-company-sector">{{ offre.entreprise.activity_sector.name }}</p>
                    <p v-if="offre.entreprise.ville || offre.entreprise.pays" class="od-company-loc">
                      <i class="fa-solid fa-location-dot"></i>
                      {{ [offre.entreprise.ville, offre.entreprise.pays].filter(Boolean).join(', ') }}
                    </p>
                    <a v-if="offre.entreprise.site_web" :href="offre.entreprise.site_web" target="_blank" rel="noopener" class="od-company-link">
                      <i class="fa-solid fa-globe"></i> {{ t('annonces.detail.website') }}
                    </a>
                  </div>
                </div>
                <router-link :to="`/entreprises/${offre.entreprise.id}`" class="btn btn--outline btn--sm" style="margin-top:14px;display:block;text-align:center;">
                  {{ t('annonces.detail.viewCompanyProfile') }}
                </router-link>
              </div>

              <!-- CTA -->
              <div class="od-side-card od-side-cta">
                <p>{{ t('annonces.detail.interestedInJob') }}</p>
                <template v-if="isLoggedIn && userRole === 'talent'">
                  <template v-if="dejaPostule === null">
                    <!-- Chargement de la vérification -->
                    <div style="padding: 20px;">
                      <i class="fa-solid fa-spinner fa-spin" style="font-size: 24px; color: rgba(255,255,255,.6);"></i>
                    </div>
                  </template>
                  <template v-else-if="dejaPostule">
                    <div class="deja-postule-badge" style="margin-bottom:12px;">
                      <i class="fa-solid fa-check-circle"></i>
                      <span>{{ t('annonces.detail.alreadyApplied') }}</span>
                    </div>
                    <router-link to="/talent/candidatures" class="btn btn--white btn--sm" style="display:block;text-align:center;">
                      <i class="fa-solid fa-folder-open" style="margin-right:6px;"></i>{{ t('annonces.detail.viewMyApplications') }}
                    </router-link>
                  </template>
                  <template v-else>
                    <button class="btn btn--blue" style="width:100%;" @click="showModal = true">{{ t('annonces.detail.applyNow') }}</button>
                    <button class="btn btn--orange btn--sm" style="width:100%;margin-top:8px;" @click="matchCV">
                      <i class="fa-solid fa-wand-magic-sparkles" style="margin-right:6px;"></i>Match CV
                    </button>
                  </template>
                </template>
                <template v-else>
                  <router-link :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" class="btn btn--blue" style="display:block;text-align:center;">
                    {{ t('annonces.detail.loginToApply') }}
                  </router-link>
                </template>
              </div>

              <!-- Partage -->
              <ShareCard :text="offre.titre" />

            </aside>
          </div>
        </div>
      </section>

    </template>

    <!-- Modal de candidature -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ t('annonces.detail.modalTitle') }}</h2>
          <button class="modal-close" @click="closeModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form @submit.prevent="postuler" class="modal-body">
          <div class="form-group">
            <label for="cv">{{ t('annonces.detail.cvLabel') }} <span class="required">*</span></label>
            <input
              type="file"
              id="cv"
              ref="cvInput"
              accept=".pdf,.doc,.docx"
              @change="handleFileChange"
              required
            />
            <p v-if="cvFile" class="file-name">
              <i class="fa-solid fa-file"></i> {{ cvFile.name }}
            </p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn--outline" @click="closeModal">{{ t('annonces.detail.cancel') }}</button>
            <button type="submit" class="btn btn--blue" :disabled="submitting">
              <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-paper-plane"></i>
              {{ submitting ? t('annonces.detail.sending') : t('annonces.detail.sendApplication') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de matching CV -->
    <div v-if="showMatchModal" class="modal-overlay" @click.self="closeMatchModal">
      <div class="modal-content modal-match">
        <div class="modal-header">
          <h2><i class="fa-solid fa-wand-magic-sparkles"></i> Match CV avec l'offre</h2>
          <button class="modal-close" @click="closeMatchModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          
          <!-- Chargement de la vérification -->
          <div v-if="loadingExistingMatch" class="match-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Vérification des résultats existants...</p>
          </div>

          <!-- Résultat existant trouvé -->
          <div v-else-if="hasExistingMatch && !matchResult" class="match-existing">
            <div class="match-existing-header">
              <i class="fa-solid fa-clock-rotate-left"></i>
              <h3>Résultat déjà disponible</h3>
            </div>
            <p>Vous avez déjà effectué un matching pour cette offre le {{ formatDate(existingMatchData.created_at) }}.</p>
            <div class="match-existing-actions">
              <button class="btn btn--blue" @click="matchResult = existingMatchData">
                <i class="fa-solid fa-eye"></i> Voir le résultat
              </button>
              <button class="btn btn--outline" @click="forceNewMatch">
                <i class="fa-solid fa-rotate"></i> Refaire avec un nouveau CV
              </button>
            </div>
          </div>

          <!-- Upload CV (nouveau matching ou pas de résultat existant) -->
          <div v-else-if="!matchResult" class="match-upload">
            <div v-if="hasExistingMatch" class="match-info">
              <i class="fa-solid fa-info-circle"></i>
              <p>Vous allez créer un nouveau matching qui remplacera l'ancien.</p>
            </div>
            <div class="form-group">
              <label for="match-cv">Téléchargez votre CV <span class="required">*</span></label>
              <input
                type="file"
                id="match-cv"
                accept=".pdf,.doc,.docx"
                @change="handleMatchFileChange"
                :disabled="matchSubmitting"
              />
              <p v-if="matchCvFile" class="file-name">
                <i class="fa-solid fa-file"></i> {{ matchCvFile.name }}
              </p>
            </div>
            <p v-if="matchError" class="match-error">{{ matchError }}</p>
            <div class="modal-actions">
              <button type="button" class="btn btn--outline" @click="closeMatchModal">Annuler</button>
              <button 
                type="button" 
                class="btn btn--orange" 
                @click="submitMatch"
                :disabled="!matchCvFile || matchSubmitting"
              >
                <i v-if="matchSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-wand-magic-sparkles"></i>
                {{ matchSubmitting ? 'Analyse en cours...' : 'Analyser le match' }}
              </button>
            </div>
          </div>

          <!-- Résultats du matching -->
          <div v-else class="match-results">
            <div class="match-score-main">
              <div class="match-score-circle" :style="{ borderColor: getScoreColor(matchResult.score) }">
                <span class="match-score-value" :style="{ color: getScoreColor(matchResult.score) }">
                  {{ matchResult.score }}%
                </span>
                <span class="match-score-label">Compatibilité</span>
              </div>
            </div>

            <div class="match-reason">
              <h3><i class="fa-solid fa-lightbulb"></i> Analyse globale</h3>
              <p>{{ matchResult.raison }}</p>
            </div>

            <div v-if="matchResult.details" class="match-details">
              <h3><i class="fa-solid fa-chart-bar"></i> Détails par catégorie</h3>
              <div class="match-detail-grid">
                <div v-for="(detail, key) in matchResult.details" :key="key" class="match-detail-item">
                  <div class="match-detail-header">
                    <span class="match-detail-title">{{ getCategoryLabel(key) }}</span>
                    <span class="match-detail-score" :style="{ color: getScoreColor(detail.score) }">
                      {{ detail.score }}%
                    </span>
                  </div>
                  <div class="match-detail-bar">
                    <div 
                      class="match-detail-bar-fill" 
                      :style="{ width: detail.score + '%', backgroundColor: getScoreColor(detail.score) }"
                    ></div>
                  </div>
                  <p class="match-detail-text">{{ detail.explication }}</p>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn--outline" @click="closeMatchModal">Fermer</button>
              <button type="button" class="btn btn--blue" @click="showModal = true; closeMatchModal();">
                <i class="fa-solid fa-paper-plane"></i> Postuler maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>

    <!-- ══ FOOTER ══ -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import Footer from './Footer.vue'
import ShareCard from './ShareCard.vue'
import { useFavoris } from '../composables/useFavoris.js'
import { useMeta } from '../composables/useMeta'

const { t, locale } = useI18n()
const { setMeta, resetMeta } = useMeta()
const apiBase    = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route      = useRoute()
const offre      = ref(null)
const loading    = ref(true)

const token      = localStorage.getItem('token')
const isLoggedIn = ref(!!token)
const userRole   = ref(localStorage.getItem('userRole') || '')
const isTalent   = isLoggedIn.value && userRole.value === 'talent'

const postuleMsg = ref('')
const postuleOk  = ref(false)
const dejaPostule = ref(null) // null = chargement, true = déjà postulé, false = pas encore postulé

const showModal = ref(false)
const cvFile = ref(null)
const submitting = ref(false)

// Modal de matching
const showMatchModal = ref(false)
const matchCvFile = ref(null)
const matchSubmitting = ref(false)
const matchResult = ref(null)
const matchError = ref('')
const hasExistingMatch = ref(false)
const existingMatchData = ref(null)
const loadingExistingMatch = ref(false)

const { favoris, loadFavoris, toggleFavori: _toggleFavori, isFavoriId } = useFavoris()

const isFavori = computed(() => offre.value ? isFavoriId(offre.value.id) : false)

const load = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiBase}/public/offres/${route.params.id}`)
    offre.value = res.data
    
    // Vérifier si l'utilisateur a déjà postulé
    if (isLoggedIn.value && userRole.value === 'talent') {
      await checkDejaPostule()
    } else {
      // Si pas connecté ou pas talent, on peut afficher les boutons
      dejaPostule.value = false
    }
    
    // Mettre à jour les meta tags pour le partage
    if (offre.value) {
      const description = offre.value.description 
        ? offre.value.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
        : `Offre d'emploi : ${offre.value.titre} chez ${offre.value.entreprise?.nom || 'une entreprise'}`
      
      setMeta({
        title: offre.value.titre,
        description: description,
        image: offre.value.entreprise?.logo_url || 'https://talenteed.io/favicon.png',
        url: window.location.href,
        type: 'article'
      })
    }
  } catch {
    offre.value = null
  } finally {
    loading.value = false
  }
}

const checkDejaPostule = async () => {
  try {
    const res = await axios.get(`${apiBase}/talent/mes-candidatures`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    // Vérifier si une candidature existe pour cette offre
    const candidature = res.data.find(c => c.offre_id === parseInt(route.params.id))
    dejaPostule.value = !!candidature
  } catch (e) {
    console.error('Erreur lors de la vérification des candidatures:', e)
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert(t('annonces.detail.fileTooLarge'))
      e.target.value = ''
      cvFile.value = null
      return
    }
    cvFile.value = file
  }
}

const closeModal = () => {
  showModal.value = false
  cvFile.value = null
  postuleMsg.value = ''
}

const postuler = async () => {
  if (!cvFile.value) {
    alert(t('annonces.detail.selectCv'))
    return
  }

  submitting.value = true
  postuleMsg.value = ''

  try {
    const formData = new FormData()
    formData.append('cv', cvFile.value)

    await axios.post(
      `${apiBase}/talent/offres/${offre.value.id}/postuler`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    postuleMsg.value = t('annonces.detail.applicationSent')
    postuleOk.value = true
    dejaPostule.value = true // Marquer comme déjà postulé
    closeModal()
  } catch (e) {
    postuleMsg.value = e.response?.data?.message || 'Une erreur est survenue.'
    postuleOk.value = false
  } finally {
    submitting.value = false
  }
}

const toggleFavori = () => {
  if (offre.value) _toggleFavori(offre.value)
}

const matchCV = async () => {
  matchResult.value = null
  matchError.value = ''
  hasExistingMatch.value = false
  existingMatchData.value = null
  
  // Vérifier si un matching existe déjà
  loadingExistingMatch.value = true
  try {
    const res = await axios.get(
      `${apiBase}/talent/offres/${offre.value.id}/match`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    if (res.data.exists) {
      hasExistingMatch.value = true
      existingMatchData.value = res.data.matching
      matchResult.value = res.data.matching
    }
  } catch (e) {
    console.error('Error checking existing match:', e)
  } finally {
    loadingExistingMatch.value = false
  }
  
  showMatchModal.value = true
}

const forceNewMatch = () => {
  hasExistingMatch.value = false
  matchResult.value = null
  existingMatchData.value = null
}

const handleMatchFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert(t('annonces.detail.fileTooLarge'))
      e.target.value = ''
      matchCvFile.value = null
      return
    }
    matchCvFile.value = file
  }
}

const closeMatchModal = () => {
  showMatchModal.value = false
  matchCvFile.value = null
  matchResult.value = null
  matchError.value = ''
  hasExistingMatch.value = false
  existingMatchData.value = null
}

const submitMatch = async () => {
  if (!matchCvFile.value) {
    alert('Veuillez sélectionner un CV')
    return
  }

  matchSubmitting.value = true
  matchError.value = ''

  try {
    const formData = new FormData()
    formData.append('cv', matchCvFile.value)

    const res = await axios.post(
      `${apiBase}/talent/offres/${offre.value.id}/match`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    matchResult.value = res.data.matching
    
    // Log debug info si disponible
    if (res.data.debug) {
      console.log('CV parsing debug:', res.data.debug)
    }
  } catch (e) {
    console.error('Match error:', e)
    matchError.value = e.response?.data?.message || 'Une erreur est survenue lors de l\'analyse.'
    
    // Si c'est une erreur de parsing, afficher un message plus détaillé
    if (e.response?.status === 422) {
      matchError.value = 'Impossible d\'extraire le contenu du CV. Essayez avec un autre format (PDF ou DOCX) ou vérifiez que votre CV n\'est pas protégé.'
    }
  } finally {
    matchSubmitting.value = false
  }
}

const getScoreColor = (score) => {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

const getCategoryLabel = (key) => {
  const labels = {
    competences: 'Compétences',
    secteur: 'Secteur d\'activité',
    localisation: 'Localisation',
    formation: 'Formation & Expérience'
  }
  return labels[key] || key
}

const formatDate = (str) => {
  if (!str) return ''
  const lang = locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Date(str).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
}

// Watcher pour recharger quand l'ID change
watch(() => route.params.id, () => {
  if (route.params.id) {
    load()
  }
})

onMounted(() => {
  load()
  loadFavoris()
})

onUnmounted(() => {
  resetMeta()
})
</script>

<style scoped>
.offre-detail-page { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

/* Loading */
.od-loading {
  min-height: 50vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
  color: var(--body-text); font-size: 15px;
}
.od-loading i { font-size: 42px; opacity: .4; }

/* ── Hero ── */
.od-hero {
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  padding: 60px 0;
  position: relative;
  overflow: hidden;
}
.od-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(58,155,255,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.od-hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(242,159,31,0.12) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.od-hero-inner {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 28px;
  align-items: start;
  position: relative;
  z-index: 1;
}
@media (max-width: 768px) {
  .od-hero-inner { grid-template-columns: 80px 1fr; }
  .od-hero-cta   { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .od-hero-inner { grid-template-columns: 1fr; }
  .od-hero { padding: 40px 0; }
}

.od-hero-logo {
  width: 100px; 
  height: 100px; 
  border-radius: 16px;
  background: #fff; 
  overflow: hidden;
  display: flex; 
  align-items: center; 
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,.25); 
  flex-shrink: 0;
  border: 3px solid rgba(255,255,255,.2);
}
.od-hero-logo img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.od-hero-initial  { font-size: 36px; font-weight: 800; color: var(--blue); }

.od-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.tag { 
  font-size: 11px; 
  font-weight: 700; 
  padding: 5px 14px; 
  border-radius: 50px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.2);
}
.tag--blue { background: rgba(255,255,255,.25); color: #fff; }
.tag--gray { background: rgba(255,255,255,.15); color: rgba(255,255,255,.85); }

.od-hero-title { 
  font-family: 'Sarun Pro', sans-serif;
  font-size: 38px; 
  font-weight: 900; 
  color: #fff; 
  margin: 0 0 16px; 
  line-height: 1.15;
  text-shadow: 0 2px 12px rgba(0,0,0,.2);
}
.od-hero-meta  { display: flex; flex-wrap: wrap; gap: 20px; }
.od-hero-meta span { 
  font-size: 14px; 
  color: rgba(255,255,255,.9); 
  display: flex; 
  align-items: center; 
  gap: 7px;
  font-weight: 500;
}
.od-hero-meta i { color: var(--orange, #f07c00); font-size: 15px; }

.od-hero-cta { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 8px; 
  min-width: 200px; 
}
.od-cta-note { font-size: 13px; color: rgba(255,255,255,.75); text-align: center; margin: 0 auto; }

.od-cta-row { display: flex; align-items: center; gap: 12px; }
.od-cta-col { display: flex; flex-direction: column; gap: 12px; width: 100%; }

.btn-favori-hero {
  background: rgba(255,255,255,.18);
  border: 2px solid rgba(255,255,255,.3);
  border-radius: 12px;
  width: 50px; 
  height: 50px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer; 
  font-size: 20px; 
  color: rgba(255,255,255,.8);
  transition: all .2s;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}
.btn-favori-hero:hover { 
  background: rgba(244,63,94,.25); 
  color: #f43f5e; 
  border-color: #f43f5e; 
  transform: scale(1.1); 
}
.btn-favori-hero--active { 
  background: rgba(244,63,94,.3); 
  color: #f43f5e; 
  border-color: #f43f5e; 
}
.od-apply-msg { 
  font-size: 13px; 
  font-weight: 600; 
  padding: 10px 16px; 
  border-radius: 10px; 
  text-align: center;
  backdrop-filter: blur(10px);
}
.od-apply-msg--ok  { background: rgba(34,197,94,.25); color: #d1fae5; border: 1px solid rgba(34,197,94,.4); }
.od-apply-msg--err { background: rgba(239,68,68,.25); color: #fee2e2; border: 1px solid rgba(239,68,68,.4); }

/* Badge Déjà postulé */
.deja-postule-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(34,197,94,.25);
  color: #d1fae5;
  border: 2px solid rgba(34,197,94,.4);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 700;
  backdrop-filter: blur(10px);
}
.deja-postule-badge i {
  font-size: 18px;
}

/* ── Corps ── */
.od-body { padding: 48px 0 80px; }
.od-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}
@media (max-width: 900px) {
  .od-layout { grid-template-columns: 1fr; }
  .od-sidebar { order: 1; position: static; }
}

/* Blocs contenus */
.od-block {
  background: #fff; border-radius: 14px;
  padding: 28px; margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.od-block-title {
  font-size: 17px; font-weight: 700; color: var(--navy);
  margin: 0 0 18px; display: flex; align-items: center; gap: 10px;
}
.od-block-title i { color: var(--blue); }
.od-rich { font-size: 14px; color: var(--navy); line-height: 1.8; }
.od-rich :deep(ul) { padding-left: 20px; margin: 8px 0; }
.od-rich :deep(li) { margin-bottom: 4px; }
.od-rich :deep(p)  { margin: 0 0 10px; }
.od-rich :deep(strong) { font-weight: 700; }

/* Sidebar cards */
.od-sidebar { 
  display: flex; 
  flex-direction: column; 
  gap: 20px;
  position: sticky;
  top: 90px;
  align-self: flex-start;
}
.od-side-card {
  background: #fff; border-radius: 14px;
  padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.od-side-title { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 18px; }

/* Liste détails */
.od-detail-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.od-detail-list li { display: flex; align-items: flex-start; gap: 12px; }
.od-detail-list i  { color: var(--blue); font-size: 14px; margin-top: 2px; flex-shrink: 0; width: 16px; }
.od-detail-list div { display: flex; flex-direction: column; gap: 2px; }
.od-detail-label { font-size: 11px; font-weight: 700; color: var(--body-text); text-transform: uppercase; letter-spacing: .5px; }
.od-detail-list span:last-child { font-size: 13px; color: var(--navy); font-weight: 600; }

/* Entreprise */
.od-company { display: flex; gap: 14px; align-items: flex-start; }
.od-company-logo {
  width: 56px; height: 56px; border-radius: 10px; background: var(--light-bg, #f5f7fa);
  display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
}
.od-company-logo img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.od-company-logo span { font-size: 22px; font-weight: 800; color: var(--blue); }
.od-company-name   { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 4px; }
.od-company-sector { font-size: 12px; color: var(--body-text); margin: 0 0 4px; }
.od-company-loc    { font-size: 12px; color: var(--body-text); margin: 0 0 6px; display: flex; align-items: center; gap: 4px; }
.od-company-loc i  { color: var(--blue); }
.od-company-link   { font-size: 12px; color: var(--blue); text-decoration: none; display: flex; align-items: center; gap: 5px; }
.od-company-link:hover { text-decoration: underline; }

/* CTA sidebar */
.od-side-cta { text-align: center; background: linear-gradient(135deg, #040a5d, #192bc2); }
.od-side-cta p { font-size: 14px; color: rgba(255,255,255,.85); margin: 0 0 16px; }

/* Bouton outline */
.btn--outline {
  border: 1.5px solid var(--border, #e2e8f0);
  background: transparent; color: var(--navy);
  padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
  text-decoration: none; cursor: pointer; transition: border-color .15s, color .15s;
}
.btn--outline:hover { border-color: var(--blue); color: var(--blue); }

/* Bouton white */
.btn--white {
  border: 2px solid rgba(255,255,255,.3);
  background: rgba(255,255,255,.95); 
  color: var(--navy);
  padding: 8px 16px; 
  border-radius: 8px; 
  font-size: 13px; 
  font-weight: 600;
  text-decoration: none; 
  cursor: pointer; 
  transition: all .2s;
  backdrop-filter: blur(10px);
}
.btn--white:hover { 
  background: #fff; 
  border-color: rgba(255,255,255,.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
}

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6); z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; backdrop-filter: blur(4px);
}
.modal-content {
  background: #fff; border-radius: 16px;
  max-width: 600px; width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh; overflow-y: auto;
}
.modal-header {
  padding: 24px 28px; border-bottom: 1px solid var(--border, #e2e8f0);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-header h2 {
  font-size: 20px; font-weight: 700; color: var(--navy); margin: 0;
}
.modal-close {
  background: transparent; border: none; cursor: pointer;
  font-size: 24px; color: var(--body-text); padding: 0;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  border-radius: 6px; transition: background .2s, color .2s;
}
.modal-close:hover { background: var(--light-bg, #f5f7fa); color: var(--navy); }
.modal-body {
  padding: 28px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block; font-size: 14px; font-weight: 600;
  color: var(--navy); margin-bottom: 8px;
}
.required { color: #ef4444; }
.form-group input[type="file"] {
  display: block; width: 100%; padding: 10px 12px;
  border: 1.5px solid var(--border, #e2e8f0); border-radius: 8px;
  font-size: 14px; cursor: pointer; transition: border-color .2s;
}
.form-group input[type="file"]:hover { border-color: var(--blue); }
.file-name {
  margin-top: 8px; font-size: 13px; color: var(--body-text);
  display: flex; align-items: center; gap: 6px;
}
.file-name i { color: var(--blue); }
.form-group textarea {
  width: 100%; padding: 12px; border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 8px; font-size: 14px; font-family: inherit;
  resize: vertical; transition: border-color .2s;
}
.form-group textarea:focus {
  outline: none; border-color: var(--blue);
}
.char-count {
  margin-top: 4px; font-size: 12px; color: var(--body-text); text-align: right;
}
.modal-actions {
  display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;
}
.modal-actions .btn { min-width: 120px; }
.btn:disabled {
  opacity: 0.6; cursor: not-allowed;
}

/* Modal de matching */
.modal-match {
  max-width: 700px;
}
.match-loading {
  text-align: center;
  padding: 40px 20px;
}
.match-loading i {
  font-size: 32px;
  color: var(--blue);
  margin-bottom: 16px;
}
.match-loading p {
  font-size: 14px;
  color: var(--body-text);
}
.match-existing {
  text-align: center;
  padding: 20px;
}
.match-existing-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}
.match-existing-header i {
  font-size: 32px;
  color: var(--blue);
}
.match-existing-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  margin: 0;
}
.match-existing p {
  font-size: 14px;
  color: var(--body-text);
  margin-bottom: 24px;
}
.match-existing-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.match-info {
  background: #e0f2fe;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.match-info i {
  color: #0ea5e9;
  font-size: 18px;
  flex-shrink: 0;
}
.match-info p {
  font-size: 13px;
  color: #0c4a6e;
  margin: 0;
}
.match-upload {
  text-align: center;
}
.match-error {
  color: #ef4444;
  font-size: 13px;
  margin-top: 12px;
  padding: 10px;
  background: #fee2e2;
  border-radius: 8px;
}
.match-results {
  padding: 10px 0;
}
.match-score-main {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}
.match-score-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 8px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
}
.match-score-value {
  font-size: 42px;
  font-weight: 900;
  line-height: 1;
}
.match-score-label {
  font-size: 13px;
  color: var(--body-text);
  margin-top: 8px;
  font-weight: 600;
}
.match-reason {
  background: var(--light-bg, #f5f7fa);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.match-reason h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.match-reason h3 i {
  color: var(--orange);
}
.match-reason p {
  font-size: 14px;
  color: var(--navy);
  line-height: 1.6;
  margin: 0;
}
.match-details h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.match-details h3 i {
  color: var(--blue);
}
.match-detail-grid {
  display: grid;
  gap: 20px;
}
.match-detail-item {
  background: #fff;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 10px;
  padding: 16px;
}
.match-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.match-detail-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
}
.match-detail-score {
  font-size: 16px;
  font-weight: 800;
}
.match-detail-bar {
  height: 8px;
  background: var(--light-bg, #f5f7fa);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}
.match-detail-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}
.match-detail-text {
  font-size: 13px;
  color: var(--body-text);
  line-height: 1.5;
  margin: 0;
}
</style>
