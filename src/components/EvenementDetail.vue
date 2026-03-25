<template>
  <div class="ev-detail-page">
    <PublicNav />

    <!-- Loading -->
    <div v-if="loading" class="evd-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Chargement de l'événement...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="!evenement" class="evd-loading">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>Événement introuvable.</p>
      <router-link to="/" class="btn btn--blue" style="margin-top:16px;">Retour à l'accueil</router-link>
    </div>

    <template v-else>

      <!-- ══ HERO ══ -->
      <section class="evd-hero" :style="heroStyle">
        <div class="evd-hero-overlay"></div>
        <div class="container">
          <div class="evd-hero-content">
            <span class="label-white" v-if="evenement.categorie">{{ evenement.categorie.titre }}</span>
            <h1 class="evd-hero-title">{{ evenement.titre }}</h1>
            <div class="evd-hero-meta">
              <span v-if="evenement.date_debut">
                <i class="fa-solid fa-calendar"></i>
                {{ formatDateRange(evenement.date_debut, evenement.date_fin) }}
              </span>
              <span v-if="evenement.ville">
                <i class="fa-solid fa-location-dot"></i>
                {{ evenement.ville }}{{ evenement.pays ? ', ' + evenement.pays : '' }}
              </span>
              <span v-if="evenement.heure_debut_journee">
                <i class="fa-solid fa-clock"></i>
                {{ evenement.heure_debut_journee?.substring(0,5) }} – {{ evenement.heure_fin_journee?.substring(0,5) }}
              </span>
            </div>
            <!-- CTA selon rôle -->
            <div class="evd-hero-cta">
              <template v-if="isTalent">
                <button class="btn btn--orange btn--lg" @click="scrollToMatching">
                  <i class="fa-solid fa-wand-magic-sparkles" style="margin-right:6px;"></i>Lancer le matching IA
                </button>
              </template>
              <template v-else>
                <router-link to="/register" class="btn btn--orange btn--lg">
                  <i class="fa-solid fa-user-plus" style="margin-right:6px;"></i>S'inscrire pour participer
                </router-link>
                <router-link to="/login" class="btn btn--outline-white btn--lg">
                  Se connecter
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CORPS ══ -->
      <section class="evd-body">
        <div class="container">
          <div class="evd-layout">

            <!-- ── Colonne principale ── -->
            <div class="evd-main">

              <!-- Description -->
              <div v-if="evenement.description" class="evd-block">
                <h2 class="evd-block-title"><i class="fa-solid fa-circle-info"></i> À propos de cet événement</h2>
                <p class="evd-description">{{ evenement.description }}</p>
              </div>

              <!-- ══ ENTREPRISES PARTICIPANTES ══ -->
              <div class="evd-block" id="entreprises-section">
                <h2 class="evd-block-title">
                  <i class="fa-solid fa-building"></i> Entreprises participantes
                  <span class="evd-count">{{ evenement.entreprises?.length || 0 }}</span>
                </h2>

                <div v-if="evenement.entreprises?.length" class="evd-companies-grid">
                  <div
                    v-for="ent in evenement.entreprises"
                    :key="ent.id"
                    class="evd-company-card"
                  >
                    <!-- Logo -->
                    <div class="evd-company-logo">
                      <img v-if="ent.logo_url" :src="ent.logo_url" :alt="ent.nom" />
                      <span v-else class="evd-company-initial">{{ ent.nom.charAt(0) }}</span>
                    </div>
                    <!-- Infos -->
                    <div class="evd-company-info">
                      <h3 class="evd-company-name">{{ ent.nom }}</h3>
                      <p v-if="ent.activity_sector" class="evd-company-sector">
                        <i class="fa-solid fa-industry"></i> {{ ent.activity_sector.name }}
                      </p>
                      <p v-if="ent.ville || ent.pays" class="evd-company-loc">
                        <i class="fa-solid fa-location-dot"></i>
                        {{ [ent.ville, ent.pays].filter(Boolean).join(', ') }}
                      </p>
                      <p v-if="ent.description" class="evd-company-desc">{{ truncate(ent.description, 80) }}</p>
                      <div v-if="ent.offres?.length" class="evd-company-offres">
                        <i class="fa-solid fa-briefcase"></i>
                        {{ ent.offres.length }} offre{{ ent.offres.length > 1 ? 's' : '' }}
                      </div>
                    </div>
                    <!-- Action -->
                    <div class="evd-company-action">
                      <router-link :to="`/entreprises/${ent.id}`" class="btn btn--outline-nav btn--sm">
                        Voir le profil
                      </router-link>
                    </div>
                  </div>
                </div>
                <div v-else class="evd-empty">
                  <i class="fa-solid fa-building-circle-xmark"></i>
                  <p>Aucune entreprise enregistrée pour cet événement.</p>
                </div>

                <!-- Indicateur matching pour les talents -->
                <div v-if="isTalent && evenement.entreprises?.length" class="evd-matching-hint">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                  <div>
                    <strong>Prendre un rendez-vous ?</strong>
                    Lancez d'abord le matching IA ci-dessous pour identifier les entreprises les plus adaptées à votre profil, puis prenez rendez-vous depuis les résultats.
                  </div>
                  <button class="btn btn--blue btn--sm" @click="scrollToMatching">
                    Lancer le matching
                  </button>
                </div>
              </div>

              <!-- ══ MATCHING IA (talent seulement) ══ -->
              <div v-if="isTalent" class="evd-block evd-matching-block" id="matching-section">
                <h2 class="evd-block-title">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> Matching IA
                  <span class="evd-label-ai">Propulsé par OpenAI</span>
                </h2>
                <p class="evd-matching-intro">
                  Notre IA analyse votre profil et le compare aux entreprises participantes pour vous proposer les meilleures opportunités.
                </p>

                <!-- Formulaire matching -->
                <div v-if="!matchingResultats" class="evd-matching-form">
                  <div class="evd-form-row">
                    <label class="evd-form-label">Poste recherché <span class="req">*</span></label>
                    <input
                      v-model="matchingForm.poste_recherche"
                      type="text"
                      class="evd-form-input"
                      placeholder="Ex: Développeur Full Stack, Data Analyst, Manager RH..."
                    />
                  </div>

                  <div class="evd-form-row">
                    <label class="evd-form-label">Compétences clés</label>
                    <select v-model="matchingForm.competences_ids" multiple class="evd-form-select" size="6">
                      <option v-for="sk in skills" :key="sk.id" :value="sk.name">{{ sk.name }}</option>
                    </select>
                    <small class="evd-form-hint">Maintenir Ctrl/Cmd pour sélectionner plusieurs</small>
                  </div>

                  <div class="evd-form-row">
                    <label class="evd-form-label">CV (PDF, DOC, DOCX — optionnel)</label>
                    <div class="evd-file-input" @click="$refs.cvInput.click()">
                      <i class="fa-solid fa-upload"></i>
                      <span>{{ cvFile ? cvFile.name : 'Déposer votre CV ici ou cliquer pour parcourir' }}</span>
                    </div>
                    <input ref="cvInput" type="file" accept=".pdf,.doc,.docx" @change="e => cvFile = e.target.files[0]" style="display:none;" />
                  </div>

                  <div v-if="matchingError" class="evd-error">
                    <i class="fa-solid fa-triangle-exclamation"></i> {{ matchingError }}
                  </div>

                  <button
                    class="btn btn--blue btn--lg evd-matching-btn"
                    :disabled="!matchingForm.poste_recherche || matchingLoading"
                    @click="lancerMatching"
                  >
                    <i class="fa-solid fa-wand-magic-sparkles" v-if="!matchingLoading"></i>
                    <i class="fa-solid fa-spinner fa-spin" v-else></i>
                    {{ matchingLoading ? 'Analyse IA en cours...' : 'Lancer le matching IA' }}
                  </button>
                </div>

                <!-- Résultats matching -->
                <div v-else class="evd-matching-results">
                  <div class="evd-matching-results-header">
                    <h3><i class="fa-solid fa-chart-bar"></i> Résultats — {{ matchingResultats.resultats?.length }} entreprise{{ matchingResultats.resultats?.length !== 1 ? 's' : '' }} analysée{{ matchingResultats.resultats?.length !== 1 ? 's' : '' }}</h3>
                    <button class="btn btn--outline-nav btn--sm" @click="resetMatching">
                      <i class="fa-solid fa-rotate-left"></i> Nouveau matching
                    </button>
                  </div>

                  <div v-if="matchingResultats.resultats?.length" class="evd-results-list">
                    <div
                      v-for="(r, i) in matchingResultats.resultats"
                      :key="r.entreprise_id"
                      class="evd-result-card"
                    >
                      <!-- Rang -->
                      <div class="evd-result-rank" :class="`rank-${i+1}`">
                        {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}` }}
                      </div>
                      <!-- Infos -->
                      <div class="evd-result-info">
                        <h4 class="evd-result-name">{{ r.nom }}</h4>
                        <p class="evd-result-raison">{{ r.raison }}</p>
                        <div v-if="r.ville" class="evd-result-loc">
                          <i class="fa-solid fa-location-dot"></i> {{ r.ville }}
                        </div>
                      </div>
                      <!-- Score -->
                      <div class="evd-result-score">
                        <div class="evd-score-circle" :class="scoreClass(r.score)">
                          <span class="evd-score-num">{{ r.score }}</span>
                          <span class="evd-score-max">/100</span>
                        </div>
                        <div class="evd-score-bar">
                          <div class="evd-score-fill" :style="{ width: r.score + '%' }" :class="scoreClass(r.score)"></div>
                        </div>
                      </div>
                      <!-- CTA -->
                      <div class="evd-result-cta">
                        <button class="btn btn--blue btn--sm" @click="ouvrirReservationById(r.entreprise_id, r.nom)">
                          <i class="fa-solid fa-calendar-plus"></i> Prendre RDV
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="evd-empty">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>Aucun résultat — essayez avec d'autres critères.</p>
                  </div>
                </div>
              </div>

              <!-- ══ CTA CONNEXION (non-talent) ══ -->
              <div v-else class="evd-block evd-cta-login-block">
                <div class="evd-cta-login-inner">
                  <div class="evd-cta-login-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                  <div>
                    <h3>Matching IA & Prise de rendez-vous</h3>
                    <p>Connectez-vous en tant que talent pour accéder au matching IA et réserver un entretien avec les entreprises de votre choix.</p>
                    <div class="evd-cta-login-btns">
                      <router-link to="/login" class="btn btn--blue">Se connecter</router-link>
                      <router-link to="/register" class="btn btn--orange">Créer un compte talent</router-link>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- ── Sidebar ── -->
            <aside class="evd-sidebar">

              <!-- Infos événement -->
              <div class="evd-side-card">
                <h3 class="evd-side-title">Informations</h3>
                <ul class="evd-info-list">
                  <li v-if="evenement.date_debut">
                    <i class="fa-solid fa-calendar-days"></i>
                    <div>
                      <span class="evd-info-label">Date</span>
                      <span>{{ formatDateRange(evenement.date_debut, evenement.date_fin) }}</span>
                    </div>
                  </li>
                  <li v-if="evenement.heure_debut_journee">
                    <i class="fa-solid fa-clock"></i>
                    <div>
                      <span class="evd-info-label">Horaires</span>
                      <span>{{ evenement.heure_debut_journee?.substring(0,5) }} – {{ evenement.heure_fin_journee?.substring(0,5) }}</span>
                    </div>
                  </li>
                  <li v-if="evenement.ville">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                      <span class="evd-info-label">Lieu</span>
                      <span>{{ evenement.ville }}{{ evenement.pays ? ', ' + evenement.pays : '' }}</span>
                    </div>
                  </li>
                  <li v-if="evenement.entreprises?.length">
                    <i class="fa-solid fa-building"></i>
                    <div>
                      <span class="evd-info-label">Recruteurs</span>
                      <span>{{ evenement.entreprises.length }} entreprise{{ evenement.entreprises.length > 1 ? 's' : '' }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Logos entreprises (mini grid) -->
              <div v-if="evenement.entreprises?.length" class="evd-side-card">
                <h3 class="evd-side-title">Recruteurs</h3>
                <div class="evd-logos-mini">
                  <template v-for="ent in evenement.entreprises.slice(0, 12)" :key="ent.id">
                    <div class="evd-logo-mini" :title="ent.nom">
                      <img v-if="ent.logo_url" :src="ent.logo_url" :alt="ent.nom" />
                      <span v-else>{{ ent.nom.charAt(0) }}</span>
                    </div>
                  </template>
                  <div v-if="evenement.entreprises.length > 12" class="evd-logo-mini evd-logo-more">
                    +{{ evenement.entreprises.length - 12 }}
                  </div>
                </div>
              </div>

              <!-- CTA -->
              <div class="evd-side-card evd-side-cta">
                <template v-if="isTalent">
                  <p>Prêt à trouver les meilleures opportunités ?</p>
                  <button class="btn btn--blue" style="width:100%;" @click="scrollToMatching">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Lancer le matching
                  </button>
                </template>
                <template v-else>
                  <p>Rejoignez la communauté des talents africains</p>
                  <router-link to="/register" class="btn btn--orange" style="display:block;text-align:center;">
                    S'inscrire gratuitement
                  </router-link>
                </template>
              </div>

            </aside>
          </div>
        </div>
      </section>

      <!-- ══ MODAL RÉSERVATION ══ -->
      <div v-if="rdvEntreprise" class="evd-modal-overlay" @click.self="rdvEntreprise = null">
        <div class="evd-modal">
          <button class="evd-modal-close" @click="rdvEntreprise = null">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="evd-modal-header">
            <h3>Prendre rendez-vous</h3>
            <p>
              <strong>{{ rdvEntreprise.nom }}</strong> —
              {{ evenement.titre }}
            </p>
          </div>

          <!-- Chargement créneaux -->
          <div v-if="rdvLoading" class="evd-rdv-loading">
            <i class="fa-solid fa-spinner fa-spin"></i> Chargement des créneaux...
          </div>

          <!-- Confirmation -->
          <div v-else-if="rdvConfirme" class="evd-rdv-confirme">
            <i class="fa-solid fa-circle-check"></i>
            <p>Entretien réservé le <strong>{{ rdvConfirme.date }}</strong> à <strong>{{ rdvConfirme.heure_debut }}</strong></p>
            <p class="evd-rdv-status">En attente de confirmation de l'entreprise</p>
            <button class="btn btn--blue" @click="rdvEntreprise = null">Fermer</button>
          </div>

          <!-- Créneaux -->
          <div v-else>
            <div v-if="rdvCreneaux.length" class="evd-creneaux">
              <div v-for="jour in rdvCreneaux" :key="jour.date" class="evd-creneau-jour">
                <h4 class="evd-creneau-date">
                  <i class="fa-solid fa-calendar"></i> {{ formatJour(jour.date) }}
                </h4>
                <div class="evd-creneau-slots">
                  <button
                    v-for="slot in jour.slots"
                    :key="slot.heure_debut"
                    :disabled="!slot.disponible"
                    :class="['evd-slot', {
                      'evd-slot--selected': selectedSlot?.heure_debut === slot.heure_debut && selectedDate === jour.date,
                      'evd-slot--pris': !slot.disponible
                    }]"
                    @click="slot.disponible && selectSlot(jour.date, slot)"
                  >
                    {{ slot.heure_debut.substring(0,5) }}
                    <span v-if="!slot.disponible" class="evd-slot-pris">pris</span>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="evd-rdv-loading">
              <i class="fa-solid fa-calendar-xmark" style="font-size:32px;opacity:.4;"></i>
              <p>Aucun créneau disponible.</p>
            </div>

            <div v-if="selectedSlot" class="evd-slot-confirm">
              <p>
                <i class="fa-solid fa-clock"></i>
                Créneau sélectionné : <strong>{{ formatJour(selectedDate) }} à {{ selectedSlot.heure_debut.substring(0,5) }}</strong>
              </p>
              <div v-if="rdvError" class="evd-error">{{ rdvError }}</div>
              <div class="evd-slot-confirm-btns">
                <button class="btn btn--blue" @click="confirmerReservation" :disabled="rdvLoading">
                  <i class="fa-solid fa-check"></i> Confirmer la réservation
                </button>
                <button class="btn btn--ghost" @click="selectedSlot = null">Annuler</button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import api from '../services/api.js'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route   = useRoute()

// ── Data ──────────────────────────────────────────────────────
const evenement = ref(null)
const loading   = ref(true)
const skills    = ref([])

// ── Auth ──────────────────────────────────────────────────────
const isLoggedIn = ref(!!localStorage.getItem('token'))
const userRole   = ref(localStorage.getItem('userRole') || '')
const isTalent   = computed(() => isLoggedIn.value && userRole.value === 'talent')

// ── Matching ──────────────────────────────────────────────────
const matchingForm      = ref({ poste_recherche: '', competences_ids: [] })
const matchingLoading   = ref(false)
const matchingError     = ref('')
const matchingResultats = ref(null)
const matchingEntrepriseId = ref(null)
const cvFile            = ref(null)

// ── Réservation ───────────────────────────────────────────────
const rdvEntreprise = ref(null)
const rdvLoading    = ref(false)
const rdvCreneaux   = ref([])
const rdvError      = ref('')
const rdvConfirme   = ref(null)
const selectedDate  = ref(null)
const selectedSlot  = ref(null)

// ── Computed style héro ───────────────────────────────────────
const heroStyle = computed(() => {
  if (evenement.value?.image_mise_en_avant_url) {
    return { backgroundImage: `url('${evenement.value.image_mise_en_avant_url}')` }
  }
  return {}
})

// ── Chargement événement ──────────────────────────────────────
const load = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiBase}/public/evenements/${route.params.id}`)
    evenement.value = res.data
  } catch {
    evenement.value = null
  } finally {
    loading.value = false
  }
}

// ── Chargement skills (pour le formulaire matching) ───────────
const loadSkills = async () => {
  try {
    const res = await api.get('/skills')
    skills.value = res.data
  } catch {}
}

// ── Matching ──────────────────────────────────────────────────
const lancerMatching = async () => {
  if (!matchingForm.value.poste_recherche) return
  matchingLoading.value = true
  matchingError.value   = ''
  try {
    const fd = new FormData()
    fd.append('poste_recherche', matchingForm.value.poste_recherche)
    if (matchingForm.value.competences_ids.length) {
      fd.append('competences', matchingForm.value.competences_ids.join(', '))
    }
    if (cvFile.value) fd.append('cv', cvFile.value)

    const res = await api.post(`/talent/evenements/${evenement.value.id}/matching`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    matchingResultats.value = res.data
  } catch (e) {
    matchingError.value = e.response?.data?.message || 'Erreur lors du matching. Vérifiez la clé OpenAI.'
  } finally {
    matchingLoading.value = false
  }
}

const resetMatching = () => {
  matchingResultats.value = null
  matchingForm.value = { poste_recherche: '', competences_ids: [] }
  cvFile.value = null
  matchingError.value = ''
}

// ── Réservation ───────────────────────────────────────────────
const ouvrirReservation = async (entreprise) => {
  rdvEntreprise.value = entreprise
  rdvLoading.value    = true
  rdvCreneaux.value   = []
  rdvConfirme.value   = null
  selectedSlot.value  = null
  selectedDate.value  = null
  rdvError.value      = ''

  try {
    const res = await api.get(`/talent/evenements/${evenement.value.id}/creneaux`, {
      params: { entreprise_id: entreprise.id }
    })
    rdvCreneaux.value = res.data
  } catch {
    rdvError.value = 'Impossible de charger les créneaux.'
  } finally {
    rdvLoading.value = false
  }
}

const ouvrirReservationById = (entrepriseId, entrepriseNom) => {
  const ent = evenement.value?.entreprises?.find(e => e.id === entrepriseId)
  if (ent) ouvrirReservation(ent)
  else ouvrirReservation({ id: entrepriseId, nom: entrepriseNom })
}

const selectSlot = (date, slot) => {
  selectedDate.value = date
  selectedSlot.value = slot
  rdvError.value = ''
}

const confirmerReservation = async () => {
  rdvLoading.value = true
  rdvError.value   = ''
  try {
    const res = await api.post(`/talent/evenements/${evenement.value.id}/reserver`, {
      entreprise_id: rdvEntreprise.value.id,
      date:          selectedDate.value,
      heure_debut:   selectedSlot.value.heure_debut,
    })
    rdvConfirme.value = res.data
  } catch (e) {
    rdvError.value = e.response?.data?.message || 'Erreur lors de la réservation.'
  } finally {
    rdvLoading.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────
const scrollToMatching = () => {
  document.getElementById('matching-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formatDateRange = (debut, fin) => {
  const fmt = (s) => new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  if (!debut) return ''
  if (!fin || debut === fin) return fmt(debut)
  return `${fmt(debut)} – ${fmt(fin)}`
}

const formatJour = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

const truncate = (str, len) => !str ? '' : str.length > len ? str.slice(0, len) + '…' : str

const scoreClass = (score) => {
  if (score >= 75) return 'score--high'
  if (score >= 50) return 'score--mid'
  return 'score--low'
}

onMounted(async () => {
  await load()
  if (isTalent.value) loadSkills()
})
</script>

<style scoped>
.ev-detail-page { min-height: 100vh; background: var(--light-bg, #f5f7fa); }

.evd-loading {
  min-height: 50vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
  color: var(--body-text); font-size: 15px;
}
.evd-loading i { font-size: 42px; opacity: .4; }

/* ══ HERO ══ */
.evd-hero {
  position: relative; padding: 90px 0 70px;
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  background-size: cover; background-position: center;
  min-height: 400px; display: flex; align-items: flex-end;
}
.evd-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(4,10,93,.55) 0%, rgba(4,10,93,.88) 100%);
}
.evd-hero-content { position: relative; z-index: 1; max-width: 800px; }
.label-white {
  display: inline-block; background: rgba(255,255,255,.2); color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  padding: 4px 14px; border-radius: 50px; margin-bottom: 14px;
}
.evd-hero-title { font-size: 38px; font-weight: 800; color: #fff; margin: 0 0 16px; line-height: 1.15; }
@media (max-width: 600px) { .evd-hero-title { font-size: 26px; } }
.evd-hero-meta { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 28px; }
.evd-hero-meta span { font-size: 14px; color: rgba(255,255,255,.88); display: flex; align-items: center; gap: 7px; }
.evd-hero-meta i    { color: var(--orange, #f07c00); }
.evd-hero-cta { display: flex; flex-wrap: wrap; gap: 10px; }

.btn--outline-white {
  border: 2px solid rgba(255,255,255,.5); background: transparent; color: #fff;
  padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700;
  text-decoration: none; cursor: pointer; transition: background .15s, border-color .15s;
  display: inline-flex; align-items: center;
}
.btn--outline-white:hover { background: rgba(255,255,255,.12); border-color: #fff; }

/* ══ CORPS ══ */
.evd-body { padding: 48px 0 80px; }
.evd-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px; align-items: start;
}
@media (max-width: 960px) {
  .evd-layout { grid-template-columns: 1fr; }
  .evd-sidebar { order: -1; }
}

/* Blocs */
.evd-block {
  background: #fff; border-radius: 14px;
  padding: 28px; margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.evd-block-title {
  font-size: 18px; font-weight: 700; color: var(--navy);
  margin: 0 0 20px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.evd-block-title i { color: var(--blue); }
.evd-count {
  font-size: 12px; font-weight: 700; color: #fff;
  background: var(--blue); padding: 2px 9px; border-radius: 50px; margin-left: auto;
}
.evd-description { font-size: 15px; color: var(--navy); line-height: 1.7; margin: 0; }
.evd-empty { text-align: center; padding: 32px; color: var(--body-text); }
.evd-empty i { font-size: 36px; opacity: .25; margin-bottom: 12px; display: block; }

/* ── Grille entreprises ── */
.evd-companies-grid { display: flex; flex-direction: column; gap: 14px; }
.evd-company-card {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 16px; align-items: center;
  padding: 18px 20px; border-radius: 12px;
  border: 1.5px solid var(--border, #e2e8f0);
  background: var(--light-bg, #f5f7fa);
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.evd-company-card.evd-company-card--selected { border-color: var(--blue); }
.evd-company-card:hover { border-color: var(--blue); box-shadow: 0 4px 14px rgba(0,0,0,.09); background: #fff; }
@media (max-width: 640px) {
  .evd-company-card { grid-template-columns: 56px 1fr; }
  .evd-company-action { grid-column: 1/-1; }
}

.evd-company-logo {
  width: 60px; height: 60px; border-radius: 10px;
  background: #fff; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.evd-company-logo img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.evd-company-initial { font-size: 24px; font-weight: 800; color: var(--blue); }

.evd-company-name   { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 4px; }
.evd-company-sector { font-size: 12px; color: var(--body-text); margin: 0 0 3px; display: flex; align-items: center; gap: 5px; }
.evd-company-sector i { color: var(--blue); font-size: 11px; }
.evd-company-loc    { font-size: 12px; color: var(--body-text); margin: 0 0 5px; display: flex; align-items: center; gap: 5px; }
.evd-company-loc i  { color: var(--orange); font-size: 11px; }
.evd-company-desc   { font-size: 12px; color: var(--body-text); margin: 0 0 6px; line-height: 1.4; }
.evd-company-offres { font-size: 12px; font-weight: 600; color: var(--navy); display: flex; align-items: center; gap: 5px; }
.evd-company-offres i { color: var(--orange); }

.btn--outline-nav {
  border: 1.5px solid var(--border, #e2e8f0); background: #fff; color: var(--navy);
  padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
  text-decoration: none; cursor: pointer; transition: border-color .15s, color .15s;
  display: inline-flex; align-items: center; gap: 5px;
}
.btn--outline-nav:hover { border-color: var(--blue); color: var(--blue); }

/* Encart hint matching */
.evd-matching-hint {
  margin-top: 20px; padding: 16px 20px;
  background: linear-gradient(135deg, #e8f0fe, #f0f4ff);
  border: 1.5px solid rgba(25,43,194,.2); border-radius: 10px;
  display: flex; align-items: flex-start; gap: 14px; flex-wrap: wrap;
}
.evd-matching-hint i { font-size: 20px; color: var(--blue); margin-top: 2px; flex-shrink: 0; }
.evd-matching-hint div { flex: 1; font-size: 14px; color: var(--navy); line-height: 1.5; }
.evd-matching-hint strong { font-weight: 700; display: block; margin-bottom: 4px; }

/* ── Matching ── */
.evd-matching-block { border-top: 3px solid var(--blue); }
.evd-label-ai {
  font-size: 10px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
  background: linear-gradient(135deg, #f49f0a, #ffb52e); color: #fff;
  padding: 2px 10px; border-radius: 50px; margin-left: 4px;
}
.evd-matching-intro { font-size: 14px; color: var(--body-text); margin: 0 0 24px; line-height: 1.6; }

.evd-matching-form { display: flex; flex-direction: column; gap: 20px; }
.evd-form-row { display: flex; flex-direction: column; gap: 6px; }
.evd-form-label { font-size: 13px; font-weight: 700; color: var(--navy); text-transform: uppercase; letter-spacing: .4px; }
.req { color: #ef4444; }
.evd-form-input {
  padding: 11px 14px; border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 8px; font-size: 14px; color: var(--navy); outline: none;
  transition: border-color .15s;
}
.evd-form-input:focus { border-color: var(--blue); }
.evd-form-select {
  padding: 8px 12px; border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 8px; font-size: 13px; color: var(--navy); outline: none;
  transition: border-color .15s;
}
.evd-form-select:focus { border-color: var(--blue); }
.evd-form-hint { font-size: 12px; color: var(--body-text); }

.evd-file-input {
  padding: 20px; border: 2px dashed var(--border, #e2e8f0);
  border-radius: 10px; text-align: center; cursor: pointer;
  color: var(--body-text); font-size: 13px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: border-color .15s, background .15s;
}
.evd-file-input:hover { border-color: var(--blue); background: rgba(25,43,194,.03); }
.evd-file-input i { font-size: 18px; color: var(--blue); }

.evd-matching-btn { align-self: flex-start; display: flex; align-items: center; gap: 8px; }
.evd-matching-btn:disabled { opacity: .6; cursor: not-allowed; }

.evd-error {
  font-size: 13px; color: #dc2626;
  background: #fee2e2; border-radius: 8px; padding: 10px 14px;
  display: flex; align-items: center; gap: 8px;
}

/* Résultats matching */
.evd-matching-results-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.evd-matching-results-header h3 { font-size: 16px; font-weight: 700; color: var(--navy); margin: 0; display: flex; align-items: center; gap: 8px; }
.evd-matching-results-header h3 i { color: var(--blue); }

.evd-results-list { display: flex; flex-direction: column; gap: 14px; }
.evd-result-card {
  display: grid;
  grid-template-columns: 48px 1fr auto auto;
  gap: 16px; align-items: center;
  padding: 18px 20px; border-radius: 12px;
  border: 1.5px solid var(--border, #e2e8f0);
  background: var(--light-bg, #f5f7fa);
  transition: border-color .2s, box-shadow .2s;
}
.evd-result-card:hover { border-color: var(--blue); box-shadow: 0 4px 14px rgba(0,0,0,.09); background: #fff; }
@media (max-width: 640px) {
  .evd-result-card { grid-template-columns: 40px 1fr; }
  .evd-result-score, .evd-result-cta { grid-column: 2 / -1; }
}

.evd-result-rank { font-size: 24px; text-align: center; flex-shrink: 0; }
.evd-result-name { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 5px; }
.evd-result-raison { font-size: 13px; color: var(--body-text); margin: 0 0 4px; line-height: 1.4; font-style: italic; }
.evd-result-loc { font-size: 12px; color: var(--body-text); display: flex; align-items: center; gap: 5px; margin: 0; }
.evd-result-loc i { color: var(--orange); }

.evd-result-score { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 80px; }
.evd-score-circle {
  display: flex; align-items: baseline; gap: 1px;
  font-weight: 800;
}
.evd-score-num  { font-size: 24px; line-height: 1; }
.evd-score-max  { font-size: 11px; color: var(--body-text); }
.score--high .evd-score-num { color: #16a34a; }
.score--mid  .evd-score-num { color: #d97706; }
.score--low  .evd-score-num { color: #dc2626; }

.evd-score-bar { width: 100%; height: 4px; background: var(--border, #e2e8f0); border-radius: 2px; overflow: hidden; }
.evd-score-fill { height: 100%; border-radius: 2px; transition: width .4s; }
.score--high .evd-score-fill { background: #16a34a; }
.score--mid  .evd-score-fill { background: #d97706; }
.score--low  .evd-score-fill { background: #dc2626; }

/* CTA connexion */
.evd-cta-login-block { background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%); }
.evd-cta-login-inner { display: flex; gap: 24px; align-items: flex-start; }
.evd-cta-login-icon {
  font-size: 36px; color: rgba(255,255,255,.4);
  background: rgba(255,255,255,.12); border-radius: 14px;
  width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.evd-cta-login-inner h3 { font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.evd-cta-login-inner p  { font-size: 14px; color: rgba(255,255,255,.8); margin: 0 0 16px; line-height: 1.6; }
.evd-cta-login-btns { display: flex; gap: 10px; flex-wrap: wrap; }
.evd-block-title.evd-cta-login-block { color: #fff !important; }

/* ── Sidebar ── */
.evd-sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 90px; }
.evd-side-card {
  background: #fff; border-radius: 14px;
  padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.evd-side-title { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 16px; }

.evd-info-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.evd-info-list li { display: flex; align-items: flex-start; gap: 12px; }
.evd-info-list i  { color: var(--blue); font-size: 14px; margin-top: 3px; flex-shrink: 0; }
.evd-info-list div { display: flex; flex-direction: column; gap: 2px; }
.evd-info-label { font-size: 11px; font-weight: 700; color: var(--body-text); text-transform: uppercase; letter-spacing: .4px; }
.evd-info-list span:last-child { font-size: 13px; color: var(--navy); font-weight: 600; }

.evd-logos-mini { display: flex; flex-wrap: wrap; gap: 8px; }
.evd-logo-mini {
  width: 40px; height: 40px; border-radius: 8px; overflow: hidden;
  background: var(--light-bg, #f5f7fa);
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--border, #e2e8f0);
}
.evd-logo-mini img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.evd-logo-mini span { font-size: 14px; font-weight: 800; color: var(--blue); }
.evd-logo-more { font-size: 11px; font-weight: 700; color: var(--body-text); background: var(--border, #e2e8f0); }

.evd-side-cta { background: linear-gradient(135deg, #040a5d, #192bc2); }
.evd-side-cta p { font-size: 14px; color: rgba(255,255,255,.85); margin: 0 0 14px; text-align: center; }
.evd-side-cta .btn--blue { gap: 8px; }

/* ══ MODAL RÉSERVATION ══ */
.evd-modal-overlay {
  position: fixed; inset: 0; background: rgba(4,10,93,.55); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  backdrop-filter: blur(4px);
}
.evd-modal {
  background: #fff; border-radius: 18px; width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto; padding: 32px; position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
}
.evd-modal-close {
  position: absolute; top: 18px; right: 18px;
  background: var(--light-bg, #f5f7fa); border: none;
  width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
  font-size: 14px; color: var(--navy);
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.evd-modal-close:hover { background: #e2e8f0; }
.evd-modal-header { margin-bottom: 24px; }
.evd-modal-header h3 { font-size: 20px; font-weight: 800; color: var(--navy); margin: 0 0 6px; }
.evd-modal-header p  { font-size: 14px; color: var(--body-text); margin: 0; }

.evd-rdv-loading { text-align: center; padding: 32px 0; color: var(--body-text); display: flex; flex-direction: column; align-items: center; gap: 12px; }
.evd-rdv-loading i { font-size: 24px; color: var(--blue); }

.evd-rdv-confirme {
  text-align: center; padding: 28px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 12px; margin-bottom: 16px;
}
.evd-rdv-confirme i { font-size: 48px; color: #16a34a; margin-bottom: 16px; display: block; }
.evd-rdv-confirme p { font-size: 15px; color: var(--navy); margin: 0 0 8px; }
.evd-rdv-status { font-size: 13px; color: var(--body-text) !important; font-style: italic; }

.evd-creneaux { display: flex; flex-direction: column; gap: 20px; }
.evd-creneau-jour {}
.evd-creneau-date {
  font-size: 14px; font-weight: 700; color: var(--navy);
  margin: 0 0 10px; display: flex; align-items: center; gap: 8px;
  text-transform: capitalize;
}
.evd-creneau-date i { color: var(--blue); }
.evd-creneau-slots { display: flex; flex-wrap: wrap; gap: 8px; }

.evd-slot {
  padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;
  border: 1.5px solid var(--border, #e2e8f0); background: var(--light-bg, #f5f7fa);
  color: var(--navy); cursor: pointer; transition: all .15s; position: relative;
}
.evd-slot:hover:not(:disabled) { border-color: var(--blue); background: #e8f0fe; color: var(--blue); }
.evd-slot--selected { border-color: var(--blue) !important; background: var(--blue) !important; color: #fff !important; }
.evd-slot--pris { opacity: .4; cursor: not-allowed !important; text-decoration: line-through; }
.evd-slot-pris { font-size: 10px; margin-left: 3px; }

.evd-slot-confirm {
  margin-top: 20px; padding: 16px 20px;
  background: linear-gradient(135deg, #e8f0fe, #f0f4ff);
  border-radius: 10px; border: 1.5px solid rgba(25,43,194,.2);
}
.evd-slot-confirm p { font-size: 14px; color: var(--navy); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.evd-slot-confirm p i { color: var(--blue); }
.evd-slot-confirm-btns { display: flex; gap: 10px; flex-wrap: wrap; }

.btn--ghost {
  background: transparent; border: none; color: var(--body-text);
  font-size: 14px; font-weight: 600; cursor: pointer; padding: 10px;
  border-radius: 8px; transition: background .15s;
}
.btn--ghost:hover { background: var(--light-bg, #f5f7fa); }
</style>
