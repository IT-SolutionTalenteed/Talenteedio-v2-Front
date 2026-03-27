<template>
  <v-card rounded="xl" border elevation="0">
    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Header -->
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-briefcase</v-icon>
      <v-toolbar-title>Gestion des Offres d'emploi</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">Ajouter une offre</v-btn>
      </template>
    </v-toolbar>

    <!-- Formulaire -->
    <v-expand-transition>
      <div v-if="showForm || editingItem">
        <v-card variant="outlined" class="ma-4 mb-0">
          <v-card-title class="text-subtitle-1 pa-4 pb-2">
            {{ editingItem ? 'Modifier' : 'Créer' }} une offre
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="save">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.titre" label="Titre *" variant="outlined" density="compact" required />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.client" label="Client" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.localisation" label="Localisation" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.fourchette_salariale" label="Fourchette salariale" placeholder="ex: 35k€ - 45k€" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.date_mise_en_ligne" label="Date de mise en ligne" type="date" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.date_limite" label="Date limite" type="date" variant="outlined" density="compact" />
                </v-col>

                <v-col cols="12">
                  <div class="text-caption text-medium-emphasis mb-1">Mission</div>
                  <WysiwygEditor v-model="form.mission" />
                </v-col>
                <v-col cols="12">
                  <div class="text-caption text-medium-emphasis mb-1">Profil recherché</div>
                  <WysiwygEditor v-model="form.profil_recherche" />
                </v-col>
                <v-col cols="12">
                  <div class="text-caption text-medium-emphasis mb-1">À propos</div>
                  <WysiwygEditor v-model="form.a_propos" />
                </v-col>
                <v-col cols="12">
                  <div class="text-caption text-medium-emphasis mb-1">Description</div>
                  <WysiwygEditor v-model="form.description" />
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">Contrats de travail</div>
                  <select class="w-100 pa-2 border rounded" v-model="form.job_contract_ids" multiple size="4" style="width:100%;padding:8px;border:1px solid rgba(0,0,0,0.23);border-radius:4px;">
                    <option v-for="item in referentiels.job_contracts" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select>
                  <div class="text-caption text-medium-emphasis mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs</div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-medium-emphasis mb-1">Modes de travail</div>
                  <select v-model="form.job_mode_ids" multiple size="4" style="width:100%;padding:8px;border:1px solid rgba(0,0,0,0.23);border-radius:4px;">
                    <option v-for="item in referentiels.job_modes" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select>
                </v-col>

                <v-col cols="12" md="4">
                  <div class="text-caption text-medium-emphasis mb-1">Compétences requises</div>
                  <select v-model="form.skill_ids" multiple size="4" style="width:100%;padding:8px;border:1px solid rgba(0,0,0,0.23);border-radius:4px;">
                    <option v-for="item in referentiels.skills" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select>
                </v-col>

                <v-col cols="12" md="4">
                  <div class="text-caption text-medium-emphasis mb-1">Formations requises</div>
                  <select v-model="form.study_level_ids" multiple size="4" style="width:100%;padding:8px;border:1px solid rgba(0,0,0,0.23);border-radius:4px;">
                    <option v-for="item in referentiels.study_levels" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select>
                </v-col>

                <v-col cols="12" md="4">
                  <div class="text-caption text-medium-emphasis mb-1">Expériences requises</div>
                  <select v-model="form.experience_ids" multiple size="4" style="width:100%;padding:8px;border:1px solid rgba(0,0,0,0.23);border-radius:4px;">
                    <option v-for="item in referentiels.experiences" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select>
                </v-col>
              </v-row>

              <div class="d-flex gap-2 mt-2">
                <v-btn type="submit" color="primary" :loading="loading">Enregistrer</v-btn>
                <v-btn variant="tonal" @click="cancelForm">Annuler</v-btn>
              </div>
            </form>
          </v-card-text>
        </v-card>
      </div>
    </v-expand-transition>

    <!-- Tableau -->
    <v-data-table
      :headers="headers"
      :items="offres"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.titre="{ item }">
        <div class="font-weight-bold">{{ item.titre }}</div>
        <div v-if="item.fourchette_salariale" class="text-caption text-medium-emphasis">{{ item.fourchette_salariale }}</div>
      </template>

      <template #item.date_limite="{ item }">
        {{ item.date_limite ? formatDate(item.date_limite) : '—' }}
      </template>

      <template #item.job_contracts="{ item }">
        <template v-if="item.job_contracts?.length">
          <v-chip v-for="c in item.job_contracts" :key="c.id" size="x-small" class="mr-1">{{ c.name }}</v-chip>
        </template>
        <span v-else class="text-medium-emphasis">—</span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="editItem(item)" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" />
        </div>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <v-pagination
      v-if="pagination.last_page > 1"
      v-model="pagination.current_page"
      :length="pagination.last_page"
      @update:model-value="loadPage"
      class="mt-2"
    />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/offreService.js'
import WysiwygEditor from '../WysiwygEditor.vue'

const offres = ref([])
const referentiels = ref({ job_contracts: [], job_modes: [], skills: [], study_levels: [], experiences: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const pagination = ref({ current_page: 1, last_page: 1 })

const snackbar  = ref(false)
const snackMsg  = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value   = msg
  snackColor.value = color
  snackbar.value   = true
}

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '60px' },
  { title: 'Titre / Salaire', key: 'titre', sortable: true },
  { title: 'Client', key: 'client', sortable: true },
  { title: 'Localisation', key: 'localisation', sortable: false },
  { title: 'Date limite', key: 'date_limite', sortable: true },
  { title: 'Contrats', key: 'job_contracts', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const emptyForm = () => ({
  titre: '', client: '', localisation: '', salaire: '', fourchette_salariale: '',
  date_mise_en_ligne: '', date_limite: '', mission: '', profil_recherche: '',
  a_propos: '', liste_offre: '', description: '',
  job_contract_ids: [], job_mode_ids: [], skill_ids: [], study_level_ids: [], experience_ids: []
})

const form = ref(emptyForm())

const loadPage = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const response = await offreService.getAll(page)
    offres.value = response.data.data
    pagination.value = { current_page: response.data.current_page, last_page: response.data.last_page }
  } catch (err) {
    error.value = 'Erreur lors du chargement'
    showSnack('Erreur lors du chargement', 'error')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const response = await offreService.getReferentiels()
    referentiels.value = response.data
  } catch (err) {
    console.error('Erreur chargement référentiels:', err)
  }
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  showForm.value = true
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    if (editingItem.value) {
      await offreService.update(editingItem.value.id, form.value)
      success.value = 'Offre modifiée avec succès'
    } else {
      await offreService.create(form.value)
      success.value = 'Offre créée avec succès'
    }
    showSnack(success.value)
    await loadPage(pagination.value.current_page)
    cancelForm()
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'enregistrement"
    if (err.response?.data?.errors) {
      const msgs = Object.values(err.response.data.errors).flat()
      error.value = msgs.join(' | ')
    }
    showSnack(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const editItem = (offre) => {
  editingItem.value = offre
  form.value = {
    titre: offre.titre,
    client: offre.client || '',
    localisation: offre.localisation || '',
    salaire: offre.salaire || '',
    fourchette_salariale: offre.fourchette_salariale || '',
    date_mise_en_ligne: offre.date_mise_en_ligne ? offre.date_mise_en_ligne.substring(0, 10) : '',
    date_limite: offre.date_limite ? offre.date_limite.substring(0, 10) : '',
    mission: offre.mission || '',
    profil_recherche: offre.profil_recherche || '',
    a_propos: offre.a_propos || '',
    liste_offre: offre.liste_offre || '',
    description: offre.description || '',
    job_contract_ids: offre.job_contracts?.map(c => c.id) || [],
    job_mode_ids: offre.job_modes?.map(c => c.id) || [],
    skill_ids: offre.skills?.map(c => c.id) || [],
    study_level_ids: offre.study_levels?.map(c => c.id) || [],
    experience_ids: offre.experiences?.map(c => c.id) || [],
  }
  showForm.value = false
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette offre ?')) return
  loading.value = true
  error.value = ''
  try {
    await offreService.delete(id)
    success.value = 'Offre supprimée avec succès'
    showSnack(success.value)
    await loadPage(pagination.value.current_page)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la suppression'
    showSnack(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  showForm.value = false
  editingItem.value = null
  form.value = emptyForm()
}

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR')

onMounted(() => {
  loadPage()
  loadReferentiels()
})
</script>
