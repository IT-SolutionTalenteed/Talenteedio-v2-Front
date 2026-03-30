<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-calendar-check" class="mr-2" />
      <v-toolbar-title>Entretiens par stand</v-toolbar-title>
      <template v-if="selectedEvenement" #append>
        <v-chip color="primary" size="small" class="mr-2">
          <v-icon start icon="mdi-calendar" />
          {{ selectedEvenement.titre }}
        </v-chip>
        <v-btn
          v-if="!featuredEvenement || selectedEvenement.id !== featuredEvenement.id"
          size="small"
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="backToList"
        >
          Changer d'événement
        </v-btn>
      </template>
    </v-toolbar>

    <v-card-text>

      <!-- ══ VUE 1 : Liste des événements (si pas de featured OU si on a cliqué "Changer") ══ -->
      <div v-if="view === 'list'">
        <p class="text-body-2 text-medium-emphasis mb-4">
          Aucun événement mis en avant. Sélectionnez un événement pour consulter ses entretiens.
        </p>
        <v-progress-linear v-if="loadingInit" indeterminate color="primary" class="mb-4" />
        <div v-else-if="evenements.length" class="evenements-grid">
          <v-card
            v-for="ev in evenements"
            :key="ev.id"
            variant="outlined"
            rounded="lg"
            class="evenement-card"
            :class="{ 'evenement-card--featured': ev.is_featured }"
            hover
            @click="selectEvenement(ev)"
          >
            <v-card-text class="pa-4">
              <div class="d-flex align-center gap-2 mb-1">
                <v-icon icon="mdi-calendar-star" :color="ev.is_featured ? 'orange' : 'primary'" size="18" />
                <span class="text-body-2 font-weight-bold text-truncate">{{ ev.titre }}</span>
                <v-chip v-if="ev.is_featured" size="x-small" color="orange" class="ml-auto flex-shrink-0">Mis en avant</v-chip>
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ formatDate(ev.date_debut) }}
                <template v-if="ev.date_fin && ev.date_fin !== ev.date_debut"> → {{ formatDate(ev.date_fin) }}</template>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <v-alert v-else type="info" variant="tonal" density="compact">Aucun événement trouvé.</v-alert>
      </div>

      <!-- ══ VUE 2 : Entretiens de l'événement sélectionné ══ -->
      <div v-else-if="view === 'entretiens'">
        <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

        <template v-else-if="stands.length">
          <v-card
            v-for="stand in stands"
            :key="stand.entreprise.id"
            variant="outlined"
            rounded="lg"
            class="mb-4"
          >
            <v-toolbar color="transparent" border="b" density="compact" class="px-3">
              <v-icon icon="mdi-domain" class="mr-2" />
              <v-toolbar-title class="text-body-1 font-weight-bold">
                Stand : {{ stand.entreprise.nom }}
              </v-toolbar-title>
              <template #append>
                <v-chip size="small" variant="tonal">
                  {{ stand.entretiens.length }} entretien{{ stand.entretiens.length > 1 ? 's' : '' }}
                </v-chip>
              </template>
            </v-toolbar>

            <v-data-table
              :headers="standHeaders"
              :items="stand.entretiens"
              density="comfortable"
              hide-default-footer
              :items-per-page="-1"
            >
              <template #item.talent="{ item }">
                <div class="font-weight-bold">{{ item.talent?.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.talent?.email }}</div>
              </template>
              <template #item.heure="{ item }">
                {{ item.heure_debut }} – {{ item.heure_fin }}
              </template>
              <template #item.statut="{ item }">
                <v-chip size="small" :color="statutColor(item.statut)">
                  {{ statutLabel(item.statut) }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </template>

        <v-alert v-else type="info" variant="tonal" density="compact">
          Aucun entretien pour cet événement.
        </v-alert>
      </div>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

// ── State ────────────────────────────────────────────
const view               = ref('entretiens') // 'list' | 'entretiens'
const evenements         = ref([])
const featuredEvenement  = ref(null)
const selectedEvenement  = ref(null)
const stands             = ref([])
const loadingInit        = ref(false)
const loading            = ref(false)

const snackbar  = ref(false)
const snackMsg  = ref('')
const snackColor = ref('success')
const showSnack  = (msg, color = 'success') => { snackMsg.value = msg; snackColor.value = color; snackbar.value = true }

// ── Headers table ────────────────────────────────────
const standHeaders = [
  { title: 'Talent',  key: 'talent',  sortable: false },
  { title: 'Date',    key: 'date',    width: '130px' },
  { title: 'Heure',   key: 'heure',   sortable: false, width: '150px' },
  { title: 'Statut',  key: 'statut',  width: '130px' },
]

// ── Helpers ──────────────────────────────────────────
const statutColor = (s) => ({ confirme: 'success', refuse: 'error', en_attente: 'secondary', annule: 'warning' }[s] ?? 'default')
const statutLabel = (s) => ({ en_attente: 'En attente', confirme: 'Confirmé', refuse: 'Refusé', annule: 'Annulé' }[s] ?? s)
const formatDate  = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

// ── Chargement entretiens d'un événement ─────────────
const loadEntretiens = async (evenementId) => {
  loading.value = true
  stands.value  = []
  try {
    const res   = await api.get('/admin/entretiens', { params: { evenement_id: evenementId } })
    stands.value = res.data
  } catch { showSnack('Erreur chargement entretiens', 'error') }
  finally   { loading.value = false }
}

// ── Sélection depuis la liste des événements ─────────
const selectEvenement = (ev) => {
  selectedEvenement.value = ev
  view.value = 'entretiens'
  loadEntretiens(ev.id)
}

// ── Retour à la liste ─────────────────────────────────
const backToList = () => {
  view.value = 'list'
  selectedEvenement.value = null
  stands.value = []
}

// ── Init ─────────────────────────────────────────────
onMounted(async () => {
  loadingInit.value = true
  try {
    // 1. Chercher l'événement featured
    const featRes = await api.get('/admin/entretiens-featured-evenement')
    featuredEvenement.value = featRes.data  // null si aucun

    if (featuredEvenement.value) {
      // Cas nominal : charger directement les entretiens du featured
      selectedEvenement.value = featuredEvenement.value
      view.value = 'entretiens'
      await loadEntretiens(featuredEvenement.value.id)
    } else {
      // Pas de featured : afficher la liste des événements
      const listRes = await api.get('/admin/entretiens-evenements')
      evenements.value = listRes.data
      view.value = 'list'
    }
  } catch { showSnack('Erreur lors de l\'initialisation', 'error') }
  finally   { loadingInit.value = false }
})
</script>

<style scoped>
.evenements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.evenement-card {
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.evenement-card:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.evenement-card--featured {
  border-color: #f29f1f !important;
  background: #fffbf2;
}
</style>
