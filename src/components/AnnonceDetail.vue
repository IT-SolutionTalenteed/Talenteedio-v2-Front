<template>
  <div class="offre-detail-page">
    <PublicNav />

    <!-- Loading -->
    <div v-if="loading" class="od-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Chargement de l'offre...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="!offre" class="od-loading">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>Offre introuvable.</p>
      <router-link to="/annonces" class="btn btn--blue" style="margin-top:16px;">Retour aux annonces</router-link>
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
                  <i class="fa-solid fa-calendar"></i> Limite : {{ formatDate(offre.date_limite) }}
                </span>
                <span v-if="offre.salaire">
                  <i class="fa-solid fa-coins"></i> {{ offre.salaire }} €
                </span>
              </div>
            </div>
            <!-- CTA -->
            <div class="od-hero-cta">
              <template v-if="isLoggedIn && userRole === 'talent'">
                <div class="od-cta-row">
                  <button class="btn btn--blue btn--lg" @click="showModal = true">
                    <i class="fa-solid fa-paper-plane" style="margin-right:6px;"></i>Postuler
                  </button>
                  <button
                    class="btn-favori-hero"
                    :class="{ 'btn-favori-hero--active': isFavori }"
                    :title="isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                    @click="toggleFavori"
                  >
                    <i :class="isFavori ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                  </button>
                </div>
              </template>
              <template v-else-if="isLoggedIn">
                <p class="od-cta-note">Seuls les talents peuvent postuler.</p>
              </template>
              <template v-else>
                <router-link :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" class="btn btn--blue btn--lg">
                  <i class="fa-solid fa-lock" style="margin-right:6px;"></i>Se connecter pour postuler
                </router-link>
                <router-link to="/register" class="btn btn--orange btn--lg" style="margin-top:8px;">
                  Créer un compte
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
                <h2 class="od-block-title"><i class="fa-solid fa-bullseye"></i> Mission</h2>
                <div class="od-rich" v-html="offre.mission"></div>
              </div>

              <!-- Description -->
              <div v-if="offre.description" class="od-block">
                <h2 class="od-block-title"><i class="fa-solid fa-align-left"></i> Description du poste</h2>
                <div class="od-rich" v-html="offre.description"></div>
              </div>

              <!-- Profil recherché -->
              <div v-if="offre.profil_recherche" class="od-block">
                <h2 class="od-block-title"><i class="fa-solid fa-user-check"></i> Profil recherché</h2>
                <div class="od-rich" v-html="offre.profil_recherche"></div>
              </div>

              <!-- À propos -->
              <div v-if="offre.a_propos" class="od-block">
                <h2 class="od-block-title"><i class="fa-solid fa-circle-info"></i> À propos de l'entreprise</h2>
                <div class="od-rich" v-html="offre.a_propos"></div>
              </div>

            </div>

            <!-- ── Sidebar ── -->
            <aside class="od-sidebar">

              <!-- Détails -->
              <div class="od-side-card">
                <h3 class="od-side-title">Détails de l'offre</h3>
                <ul class="od-detail-list">
                  <li v-if="offre.job_contracts?.length">
                    <i class="fa-solid fa-file-contract"></i>
                    <div>
                      <span class="od-detail-label">Contrat</span>
                      <span>{{ offre.job_contracts.map(c => c.name).join(', ') }}</span>
                    </div>
                  </li>
                  <li v-if="offre.localisation">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                      <span class="od-detail-label">Localisation</span>
                      <span>{{ offre.localisation }}</span>
                    </div>
                  </li>
                  <li v-if="offre.study_levels?.length">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <div>
                      <span class="od-detail-label">Niveau d'études</span>
                      <span>{{ offre.study_levels.map(s => s.name).join(', ') }}</span>
                    </div>
                  </li>
                  <li v-if="offre.experiences?.length">
                    <i class="fa-solid fa-briefcase"></i>
                    <div>
                      <span class="od-detail-label">Expérience</span>
                      <span>{{ offre.experiences.map(e => e.name).join(', ') }}</span>
                    </div>
                  </li>
                  <li v-if="offre.date_limite">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <div>
                      <span class="od-detail-label">Date limite</span>
                      <span>{{ formatDate(offre.date_limite) }}</span>
                    </div>
                  </li>
                  <li v-if="offre.salaire">
                    <i class="fa-solid fa-coins"></i>
                    <div>
                      <span class="od-detail-label">Salaire</span>
                      <span>{{ offre.salaire }} €</span>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Entreprise -->
              <div v-if="offre.entreprise" class="od-side-card">
                <h3 class="od-side-title">L'entreprise</h3>
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
                      <i class="fa-solid fa-globe"></i> Site web
                    </a>
                  </div>
                </div>
                <router-link :to="`/entreprises/${offre.entreprise.id}`" class="btn btn--outline btn--sm" style="margin-top:14px;display:block;text-align:center;">
                  Voir le profil de l'entreprise
                </router-link>
              </div>

              <!-- CTA -->
              <div class="od-side-card od-side-cta">
                <p>Intéressé par ce poste ?</p>
                <template v-if="isLoggedIn && userRole === 'talent'">
                  <button class="btn btn--blue" style="width:100%;" @click="showModal = true">Postuler maintenant</button>
                </template>
                <template v-else>
                  <router-link :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" class="btn btn--blue" style="display:block;text-align:center;">
                    Se connecter pour postuler
                  </router-link>
                </template>
              </div>

            </aside>
          </div>
        </div>
      </section>

    </template>

    <!-- Modal de candidature -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Postuler à cette offre</h2>
          <button class="modal-close" @click="closeModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form @submit.prevent="postuler" class="modal-body">
          <div class="form-group">
            <label for="cv">CV (PDF, DOC, DOCX) <span class="required">*</span></label>
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
            <button type="button" class="btn btn--outline" @click="closeModal">Annuler</button>
            <button type="submit" class="btn btn--blue" :disabled="submitting">
              <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-paper-plane"></i>
              {{ submitting ? 'Envoi...' : 'Envoyer ma candidature' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import PublicNav from './PublicNav.vue'
import { useFavoris } from '../composables/useFavoris.js'

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

const showModal = ref(false)
const cvFile = ref(null)
const submitting = ref(false)

const { favoris, loadFavoris, toggleFavori: _toggleFavori, isFavoriId } = useFavoris()

const isFavori = computed(() => offre.value ? isFavoriId(offre.value.id) : false)

const load = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiBase}/public/offres/${route.params.id}`)
    offre.value = res.data
  } catch {
    offre.value = null
  } finally {
    loading.value = false
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux. Taille maximale : 5 Mo')
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
    alert('Veuillez sélectionner un CV')
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

    postuleMsg.value = 'Votre candidature a bien été envoyée !'
    postuleOk.value = true
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

const formatDate = (str) => !str ? '' : new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

onMounted(() => {
  load()
  loadFavoris()
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
  padding: 48px 0;
}
.od-hero-inner {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 28px;
  align-items: start;
}
@media (max-width: 768px) {
  .od-hero-inner { grid-template-columns: 80px 1fr; }
  .od-hero-cta   { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .od-hero-inner { grid-template-columns: 1fr; }
}

.od-hero-logo {
  width: 90px; height: 90px; border-radius: 14px;
  background: #fff; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,.18); flex-shrink: 0;
}
.od-hero-logo img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
.od-hero-initial  { font-size: 32px; font-weight: 800; color: var(--blue); }

.od-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.tag { font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: 50px; }
.tag--blue { background: rgba(255,255,255,.2); color: #fff; }
.tag--gray { background: rgba(255,255,255,.12); color: rgba(255,255,255,.85); }

.od-hero-title { font-size: 30px; font-weight: 800; color: #fff; margin: 0 0 12px; line-height: 1.2; }
.od-hero-meta  { display: flex; flex-wrap: wrap; gap: 16px; }
.od-hero-meta span { font-size: 14px; color: rgba(255,255,255,.85); display: flex; align-items: center; gap: 6px; }
.od-hero-meta i    { color: var(--orange, #f07c00); }

.od-hero-cta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; min-width: 200px; }
.od-cta-note { font-size: 13px; color: rgba(255,255,255,.7); text-align: center; }

.od-cta-row { display: flex; align-items: center; gap: 10px; }

.btn-favori-hero {
  background: rgba(255,255,255,.15);
  border: 1.5px solid rgba(255,255,255,.3);
  border-radius: 10px;
  width: 46px; height: 46px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 20px; color: rgba(255,255,255,.7);
  transition: background .2s, color .2s, transform .15s;
  flex-shrink: 0;
}
.btn-favori-hero:hover         { background: rgba(244,63,94,.2); color: #f43f5e; border-color: #f43f5e; transform: scale(1.08); }
.btn-favori-hero--active       { background: rgba(244,63,94,.25); color: #f43f5e; border-color: #f43f5e; }
.od-apply-msg { font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 8px; text-align: center; }
.od-apply-msg--ok  { background: rgba(34,197,94,.2); color: #d1fae5; }
.od-apply-msg--err { background: rgba(239,68,68,.2); color: #fee2e2; }

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
  .od-sidebar { order: -1; }
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
.od-sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 90px; }
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
</style>
