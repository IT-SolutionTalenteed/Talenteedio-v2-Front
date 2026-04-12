<template>
  <div>
    <!-- TABS -->
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

        <!-- Formulaire -->
        <div v-if="selectedEvenement && !resultatsEv">
          <h3 class="text-h6 mb-1">Matching pour : {{ selectedEvenement.titre }}</h3>
          <p class="text-caption text-medium-emphasis mb-4">
            {{ selectedEvenement.date_debut }} → {{ selectedEvenement.date_fin }}
          </p>

          <MatchingForm
            ref="matchingFormEvRef"
            v-model="formEv"
            :activity-sectors="activitySectors"
            :parsing-cv="parsingCvEv"
            @cv-change="onCvChangeEv"
            @cancel="selectedEvenement = null"
            @submit="lancerMatchingEv"
            :loading="loadingEv"
          />
        </div>

        <!-- Résultats -->
        <div v-else-if="resultatsEv">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-h6">Résultats — {{ resultatsEv.evenement?.titre }}</h3>
            <v-btn variant="text" size="small" @click="resultatsEv = null; selectedEvenement = null">
              <v-icon size="14" class="mr-1">mdi-arrow-left</v-icon> Retour
            </v-btn>
          </div>
          <MatchingResultsEvenement :resultats="resultatsEv.resultats" @demander-rdv="(id, nom, ev) => $emit('demanderRdv', id, nom, ev)" :evenement="resultatsEv.evenement" />
        </div>

        <!-- Liste événements -->
        <div v-else>
          <v-card v-for="ev in evenements" :key="ev.id" variant="outlined" class="mb-3 pa-4">
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
          <v-alert v-if="!loadingEv && evenements.length === 0" type="info" variant="tonal">
            Aucun événement disponible.
          </v-alert>
        </div>

      </v-window-item>

      <!-- ══════════ TAB 2 — Matching offres global ══════════ -->
      <v-window-item value="global">

        <!-- Formulaire -->
        <div v-if="!resultatsGlobal">
          <p class="text-body-2 text-medium-emphasis mb-4">
            Trouvez les offres les plus adaptées à votre profil parmi toutes les offres disponibles sur la plateforme.
          </p>
          <MatchingForm
            ref="matchingFormGlobalRef"
            v-model="formGlobal"
            :activity-sectors="activitySectors"
            :parsing-cv="parsingCvGlobal"
            @cv-change="onCvChangeGlobal"
            @submit="lancerMatchingGlobal"
            :loading="loadingGlobal"
          />
        </div>

        <!-- Résultats -->
        <div v-else>
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h3 class="text-h6">{{ resultatsGlobal.resultats?.length }} offres matchées</h3>
              <p class="text-caption text-medium-emphasis">
                {{ resultatsGlobal.total_offres_analysees }} offres comparées · poste : {{ resultatsGlobal.poste_recherche }}
              </p>
            </div>
            <v-btn variant="text" size="small" @click="resultatsGlobal = null">
              <v-icon size="14" class="mr-1">mdi-arrow-left</v-icon> Nouveau
            </v-btn>
          </div>
          <MatchingResultsOffres :resultats="resultatsGlobal.resultats" />
        </div>

      </v-window-item>
    </v-window>

    <v-alert v-if="error" type="error" variant="tonal" class="mt-3">{{ error }}</v-alert>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import evenementService from '../../services/talent/evenementService.js'
import api from '../../services/api.js'

// Sous-composants inline (définis plus bas dans ce fichier via defineComponent n'est pas possible
// en SFC — on les extrait en composants séparés, mais ici on les intègre directement)
import MatchingForm from './MatchingForm.vue'
import MatchingResultsEvenement from './MatchingResultsEvenement.vue'
import MatchingResultsOffres from './MatchingResultsOffres.vue'

defineEmits(['demanderRdv'])

// ── Tabs ──────────────────────────────────────────────────────────────────────
const activeTab = ref('evenement')

// ── Référentiels ──────────────────────────────────────────────────────────────
const evenements     = ref([])
const activitySectors = ref([])
const error          = ref('')

// ── État matching événement ───────────────────────────────────────────────────
const selectedEvenement = ref(null)
const resultatsEv       = ref(null)
const loadingEv         = ref(false)
const parsingCvEv       = ref(false)
const formEv            = ref(defaultForm())
const matchingFormEvRef = ref(null)   // ref vers le composant MatchingForm (tab événement)

// ── État matching global ──────────────────────────────────────────────────────
const resultatsGlobal      = ref(null)
const loadingGlobal        = ref(false)
const parsingCvGlobal      = ref(false)
const formGlobal           = ref(defaultForm())
const matchingFormGlobalRef = ref(null) // ref vers le composant MatchingForm (tab global)

function defaultForm() {
  return {
    poste_recherche:     '',
    competences:         '',        // texte libre extrait du CV ou saisi
    pays_souhaites:      [],
    villes_souhaitees:   [],
    secteur_souhaite_id: null,
    cvFile:              null,
    cvPath:              null,      // chemin retourné par /cv/parse
  }
}

// ── Chargement initial ────────────────────────────────────────────────────────
onMounted(async () => {
  loadingEv.value = true
  try {
    const [evRes, sectorsRes] = await Promise.all([
      evenementService.getAll(),
      api.get('/activity-sectors'),
    ])
    evenements.value     = evRes.data
    activitySectors.value = sectorsRes.data
  } catch {
    error.value = 'Erreur chargement'
  } finally {
    loadingEv.value = false
  }
})

// ── Upload CV → extraction compétences ───────────────────────────────────────
async function parseCvAndFill(file, form, parsingRef, formRef) {
  if (!file) return
  parsingRef.value = true
  try {
    const fd = new FormData()
    fd.append('cv', file)
    const res = await evenementService.parseCv(fd)
    form.cvPath = res.data.cv_path ?? null
    if (res.data.competences?.length) {
      form.competences = res.data.competences.join(', ')
    }
  } catch {
    // silencieux — le talent peut saisir manuellement
  } finally {
    parsingRef.value = false
    formRef?.value?.markCvParsed?.()
  }
}

const onCvChangeEv     = (file) => { formEv.value.cvFile = file; parseCvAndFill(file, formEv.value, parsingCvEv, matchingFormEvRef) }
const onCvChangeGlobal = (file) => { formGlobal.value.cvFile = file; parseCvAndFill(file, formGlobal.value, parsingCvGlobal, matchingFormGlobalRef) }

// ── Matching événement ────────────────────────────────────────────────────────
const ouvrirMatchingEv = (ev) => {
  selectedEvenement.value = ev
  resultatsEv.value = null
  formEv.value = defaultForm()
  error.value = ''
}

const lancerMatchingEv = async () => {
  loadingEv.value = true; error.value = ''
  try {
    const fd = buildFormData(formEv.value)
    const res = await evenementService.matching(selectedEvenement.value.id, fd)
    resultatsEv.value = res.data
    selectedEvenement.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du matching.'
  } finally {
    loadingEv.value = false
  }
}

// ── Matching global ───────────────────────────────────────────────────────────
const lancerMatchingGlobal = async () => {
  loadingGlobal.value = true; error.value = ''
  try {
    const fd = buildFormData(formGlobal.value)
    const res = await evenementService.matchingOffresGlobal(fd)
    resultatsGlobal.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du matching global.'
  } finally {
    loadingGlobal.value = false
  }
}

// ── Helper FormData ───────────────────────────────────────────────────────────
function buildFormData(form) {
  const fd = new FormData()
  fd.append('poste_recherche', form.poste_recherche)
  if (form.competences)        fd.append('competences', form.competences)
  if (form.cvFile && !form.cvPath) fd.append('cv', form.cvFile)
  if (form.cvPath)             fd.append('cv_path', form.cvPath)
  if (form.pays_souhaites?.length) {
    form.pays_souhaites.forEach(p => fd.append('pays_souhaites[]', p))
  }
  if (form.villes_souhaitees?.length) {
    form.villes_souhaitees.forEach(v => fd.append('villes_souhaitees[]', v))
  }
  if (form.secteur_souhaite_id) fd.append('secteur_souhaite_id', form.secteur_souhaite_id)
  return fd
}
</script>
