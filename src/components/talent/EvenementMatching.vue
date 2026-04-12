<template>
  <div>
    <!-- ══════════════════════════════════════════════════════
         TABS : Matching événement | Matching offres global
    ══════════════════════════════════════════════════════ -->
    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="evenement">
        <v-icon size="16" class="mr-1">mdi-calendar-star</v-icon>
        Matching événement
      </v-tab>
      <v-tab value="global">
        <v-icon size="16" class="mr-1">mdi-briefcase-search</v-icon>
        Matching offres global
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">

      <!-- ══════════ TAB 1 — Matching événement ══════════ -->
      <v-window-item value="evenement">

        <!-- Formulaire de matching -->
        <div v-if="selectedEvenement && !resultatsEv">
          <h3 class="text-h6 mb-1">Matching pour : {{ selectedEvenement.titre }}</h3>
          <p class="text-caption text-medium-emphasis mb-4">
            {{ selectedEvenement.date_debut }} → {{ selectedEvenement.date_fin }}
          </p>

          <v-text-field
            v-model="formEv.poste_recherche"
            label="Poste recherché *"
            variant="outlined"
            density="comfortable"
            placeholder="Ex: Développeur Full Stack, Data Analyst..."
            class="mb-3"
            required
          />

          <div class="mb-3">
            <label class="text-body-2 font-weight-medium d-block mb-1">
              CV (PDF, DOC, DOCX — optionnel)
            </label>
            <input type="file" accept=".pdf,.doc,.docx" @change="e => cvFileEv = e.target.files[0]" />
            <span v-if="cvFileEv" class="text-caption text-success ml-2">{{ cvFileEv.name }}</span>
          </div>

          <div class="d-flex gap-2">
            <v-btn color="primary" :loading="loadingEv" @click="lancerMatchingEv">
              <v-icon size="16" class="mr-1">mdi-auto-fix</v-icon>
              Lancer le matching IA
            </v-btn>
            <v-btn variant="text" @click="selectedEvenement = null">Annuler</v-btn>
          </div>
        </div>

        <!-- Résultats matching événement -->
        <div v-else-if="resultatsEv">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-h6">Résultats — {{ resultatsEv.evenement?.titre }}</h3>
            <v-btn variant="text" size="small" @click="resultatsEv = null; selectedEvenement = null">
              <v-icon size="14" class="mr-1">mdi-arrow-left</v-icon> Retour
            </v-btn>
          </div>

          <div v-if="resultatsEv.resultats?.length > 0">
            <v-card
              v-for="(r, i) in resultatsEv.resultats"
              :key="r.entreprise_id"
              variant="outlined"
              class="mb-3 pa-4"
              :class="i === 0 ? 'border-orange' : ''"
            >
              <div class="d-flex align-start justify-space-between">
                <div class="flex-grow-1">
                  <!-- Rang + nom -->
                  <div class="d-flex align-center gap-2 mb-1">
                    <span class="text-h6">{{ rankEmoji(i) }}</span>
                    <span class="text-subtitle-1 font-weight-bold">{{ r.nom }}</span>
                  </div>
                  <!-- Localisation + secteur -->
                  <div class="text-caption text-medium-emphasis mb-1">
                    <span v-if="r.ville">📍 {{ r.ville }}<span v-if="r.pays">, {{ r.pays }}</span></span>
                    <span v-if="r.secteur" class="ml-2">🏭 {{ r.secteur }}</span>
                  </div>
                  <!-- Raison -->
                  <p class="text-body-2 text-medium-emphasis mt-2">{{ r.raison }}</p>
                </div>
                <!-- Score -->
                <div class="text-center ml-4">
                  <div class="text-h5 font-weight-black" :class="scoreColor(r.score)">
                    {{ r.score }}
                  </div>
                  <div class="text-caption text-medium-emphasis">/100</div>
                  <v-progress-linear
                    :model-value="r.score"
                    :color="scoreColorRaw(r.score)"
                    rounded
                    height="4"
                    class="mt-1"
                    style="width:56px"
                  />
                </div>
              </div>

              <!-- Offres matchées -->
              <div v-if="r.offres_matchees?.length" class="mt-3">
                <div class="text-caption font-weight-medium text-medium-emphasis mb-1">
                  <v-icon size="13">mdi-briefcase-outline</v-icon> Offres correspondantes
                </div>
                <div
                  v-for="o in r.offres_matchees"
                  :key="o.offre_id"
                  class="d-flex align-center justify-space-between py-1 px-2 rounded mb-1"
                  style="background:rgba(0,0,0,0.04)"
                >
                  <span class="text-body-2">{{ o.titre }}</span>
                  <v-chip size="x-small" :color="scoreColorRaw(o.score_offre)" label>
                    {{ o.score_offre }}/100
                  </v-chip>
                </div>
              </div>

              <v-btn
                size="small"
                variant="tonal"
                color="primary"
                class="mt-3"
                @click="$emit('demanderRdv', r.entreprise_id, r.nom, resultatsEv.evenement)"
              >
                <v-icon size="14" class="mr-1">mdi-calendar-check</v-icon>
                Prendre rendez-vous
              </v-btn>
            </v-card>
          </div>
          <v-alert v-else type="info" variant="tonal">Aucun résultat de matching.</v-alert>
        </div>

        <!-- Liste des événements -->
        <div v-else>
          <div v-if="evenements.length > 0">
            <v-card
              v-for="ev in evenements"
              :key="ev.id"
              variant="outlined"
              class="mb-3 pa-4"
            >
              <div class="d-flex align-start justify-space-between">
                <div>
                  <div class="text-subtitle-1 font-weight-bold">{{ ev.titre }}</div>
                  <div class="text-caption text-medium-emphasis">{{ ev.date_debut }} → {{ ev.date_fin }}</div>
                  <div v-if="ev.ville" class="text-caption text-medium-emphasis">📍 {{ ev.ville }}, {{ ev.pays }}</div>
                </div>
                <v-btn color="primary" variant="tonal" size="small" @click="ouvrirMatchingEv(ev)">
                  <v-icon size="14" class="mr-1">mdi-auto-fix</v-icon>
                  Matching IA
                </v-btn>
              </div>
            </v-card>
          </div>
          <v-alert v-else-if="!loadingEv" type="info" variant="tonal">Aucun événement disponible.</v-alert>
        </div>

      </v-window-item>

      <!-- ══════════ TAB 2 — Matching offres global ══════════ -->
      <v-window-item value="global">

        <!-- Formulaire -->
        <div v-if="!resultatsGlobal">
          <p class="text-body-2 text-medium-emphasis mb-4">
            Trouvez les offres les plus adaptées à votre profil parmi toutes les offres disponibles sur la plateforme.
            Le matching utilise votre profil complet (compétences, secteur souhaité, préférences géographiques) et le contenu de votre CV.
          </p>

          <v-text-field
            v-model="formGlobal.poste_recherche"
            label="Poste recherché *"
            variant="outlined"
            density="comfortable"
            placeholder="Ex: Développeur Full Stack, Data Analyst..."
            class="mb-3"
            required
          />

          <div class="mb-4">
            <label class="text-body-2 font-weight-medium d-block mb-1">
              CV (PDF, DOC, DOCX — optionnel mais recommandé)
            </label>
            <input type="file" accept=".pdf,.doc,.docx" @change="e => cvFileGlobal = e.target.files[0]" />
            <span v-if="cvFileGlobal" class="text-caption text-success ml-2">{{ cvFileGlobal.name }}</span>
          </div>

          <v-btn
            color="primary"
            :loading="loadingGlobal"
            :disabled="!formGlobal.poste_recherche"
            @click="lancerMatchingGlobal"
          >
            <v-icon size="16" class="mr-1">mdi-magnify</v-icon>
            Analyser toutes les offres
          </v-btn>
        </div>

        <!-- Résultats global -->
        <div v-else>
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h3 class="text-h6">{{ resultatsGlobal.resultats?.length }} offres analysées</h3>
              <p class="text-caption text-medium-emphasis">
                Poste : {{ resultatsGlobal.poste_recherche }} ·
                {{ resultatsGlobal.total_offres_analysees }} offres comparées
              </p>
            </div>
            <v-btn variant="text" size="small" @click="resultatsGlobal = null">
              <v-icon size="14" class="mr-1">mdi-arrow-left</v-icon> Nouveau
            </v-btn>
          </div>

          <div v-if="resultatsGlobal.resultats?.length > 0">
            <v-card
              v-for="(r, i) in resultatsGlobal.resultats"
              :key="r.offre_id"
              variant="outlined"
              class="mb-3 pa-4"
              :class="i === 0 ? 'border-orange' : ''"
            >
              <div class="d-flex align-start justify-space-between">
                <div class="flex-grow-1">
                  <div class="d-flex align-center gap-2 mb-1">
                    <span class="text-h6">{{ rankEmoji(i) }}</span>
                    <span class="text-subtitle-1 font-weight-bold">{{ r.titre }}</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mb-1">
                    <span v-if="r.entreprise">🏢 {{ r.entreprise }}</span>
                    <span v-if="r.localisation" class="ml-2">📍 {{ r.localisation }}</span>
                    <span v-if="r.secteur" class="ml-2">🏭 {{ r.secteur }}</span>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mt-2">{{ r.raison }}</p>
                </div>
                <div class="text-center ml-4">
                  <div class="text-h5 font-weight-black" :class="scoreColor(r.score)">
                    {{ r.score }}
                  </div>
                  <div class="text-caption text-medium-emphasis">/100</div>
                  <v-progress-linear
                    :model-value="r.score"
                    :color="scoreColorRaw(r.score)"
                    rounded
                    height="4"
                    class="mt-1"
                    style="width:56px"
                  />
                </div>
              </div>
            </v-card>
          </div>
          <v-alert v-else type="info" variant="tonal">Aucune offre correspondante trouvée.</v-alert>
        </div>

      </v-window-item>
    </v-window>

    <v-alert v-if="error" type="error" variant="tonal" class="mt-3">{{ error }}</v-alert>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import evenementService from '../../services/talent/evenementService.js'

defineEmits(['demanderRdv'])

// ── Tabs ─────────────────────────────────────────────────────────────────────
const activeTab = ref('evenement')

// ── État commun ───────────────────────────────────────────────────────────────
const evenements = ref([])
const error      = ref('')

// ── Matching événement ────────────────────────────────────────────────────────
const selectedEvenement = ref(null)
const resultatsEv       = ref(null)
const loadingEv         = ref(false)
const cvFileEv          = ref(null)
const formEv            = ref({ poste_recherche: '' })

// ── Matching global ───────────────────────────────────────────────────────────
const resultatsGlobal = ref(null)
const loadingGlobal   = ref(false)
const cvFileGlobal    = ref(null)
const formGlobal      = ref({ poste_recherche: '' })

// ── Chargement initial ────────────────────────────────────────────────────────
const load = async () => {
  loadingEv.value = true
  try {
    const res = await evenementService.getAll()
    evenements.value = res.data
  } catch {
    error.value = 'Erreur chargement des événements'
  } finally {
    loadingEv.value = false
  }
}

// ── Matching événement ────────────────────────────────────────────────────────
const ouvrirMatchingEv = (ev) => {
  selectedEvenement.value = ev
  resultatsEv.value = null
  formEv.value = { poste_recherche: '' }
  cvFileEv.value = null
  error.value = ''
}

const lancerMatchingEv = async () => {
  if (!formEv.value.poste_recherche) return
  loadingEv.value = true; error.value = ''
  try {
    const fd = new FormData()
    fd.append('poste_recherche', formEv.value.poste_recherche)
    if (cvFileEv.value) fd.append('cv', cvFileEv.value)

    const res = await evenementService.matching(selectedEvenement.value.id, fd)
    resultatsEv.value = res.data
    selectedEvenement.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du matching. Vérifiez la clé OpenAI.'
  } finally {
    loadingEv.value = false
  }
}

// ── Matching global ───────────────────────────────────────────────────────────
const lancerMatchingGlobal = async () => {
  if (!formGlobal.value.poste_recherche) return
  loadingGlobal.value = true; error.value = ''
  try {
    const fd = new FormData()
    fd.append('poste_recherche', formGlobal.value.poste_recherche)
    if (cvFileGlobal.value) fd.append('cv', cvFileGlobal.value)

    const res = await evenementService.matchingOffresGlobal(fd)
    resultatsGlobal.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du matching global.'
  } finally {
    loadingGlobal.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const rankEmoji = (i) => ['🥇', '🥈', '🥉'][i] ?? `#${i + 1}`

const scoreColorRaw = (score) => {
  if (score >= 75) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
}

const scoreColor = (score) => {
  if (score >= 75) return 'text-success'
  if (score >= 50) return 'text-warning'
  return 'text-error'
}

onMounted(load)
</script>
