<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <v-card-title class="text-h5 pa-0">Mes Offres d'emploi</v-card-title>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="openCreate">
        Publier une offre
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Formulaire inline (avec WysiwygEditor) -->
    <v-expand-transition>
      <v-card v-if="showForm || editingItem" rounded="lg" border elevation="0" class="mb-6 pa-4">
        <v-card-title class="text-h6 pa-0 mb-4">{{ editingItem ? 'Modifier' : 'Nouvelle' }} offre</v-card-title>
        <form @submit.prevent="save">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.titre"
                label="Titre *"
                variant="outlined"
                density="comfortable"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.localisation"
                label="Localisation"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.fourchette_salariale"
                label="Fourchette salariale"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.date_limite"
                label="Date limite"
                type="date"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-1">Mission</div>
            <WysiwygEditor v-model="form.mission" />
          </div>
          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-1">Profil recherché</div>
            <WysiwygEditor v-model="form.profil_recherche" />
          </div>
          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-1">Description</div>
            <WysiwygEditor v-model="form.description" />
          </div>

          <v-row>
            <v-col cols="12" md="4">
              <div class="text-body-2 font-weight-medium mb-2">Contrats de travail</div>
              <v-checkbox
                v-for="c in referentiels.job_contracts"
                :key="c.id"
                :label="c.name"
                :value="c.id"
                v-model="form.job_contract_ids"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-body-2 font-weight-medium mb-2">Modes de travail</div>
              <v-checkbox
                v-for="m in referentiels.job_modes"
                :key="m.id"
                :label="m.name"
                :value="m.id"
                v-model="form.job_mode_ids"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-body-2 font-weight-medium mb-2">Compétences</div>
              <v-checkbox
                v-for="s in referentiels.skills"
                :key="s.id"
                :label="s.name"
                :value="s.id"
                v-model="form.skill_ids"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-end gap-2 mt-4">
            <v-btn variant="text" @click="cancelForm">Annuler</v-btn>
            <v-btn type="submit" color="primary" variant="tonal" :disabled="loading" :loading="loading">
              Enregistrer
            </v-btn>
          </div>
        </form>
      </v-card>
    </v-expand-transition>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="editItem(item)" />
        <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="deleteItem(item.id)" />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucune offre publiée.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/entreprise/offreService.js'
import WysiwygEditor from '../WysiwygEditor.vue'

const items = ref([])
const referentiels = ref({ job_contracts: [], job_modes: [], skills: [], study_levels: [], experiences: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Titre', key: 'titre' },
  { title: 'Localisation', key: 'localisation' },
  { title: 'Date limite', key: 'date_limite' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const emptyForm = () => ({
  titre: '', mission: '', profil_recherche: '', description: '',
  localisation: '', fourchette_salariale: '', date_limite: '',
  job_contract_ids: [], job_mode_ids: [], skill_ids: [], study_level_ids: [], experience_ids: []
})
const form = ref(emptyForm())

const load = async () => {
  loading.value = true
  try {
    const res = await offreService.getAll()
    items.value = res.data
  } catch { error.value = 'Erreur chargement'; showSnack('Erreur chargement', 'error') }
  finally { loading.value = false }
}

const loadRef = async () => {
  try {
    const res = await offreService.getReferentiels()
    referentiels.value = res.data
  } catch {}
}

const openCreate = () => { editingItem.value = null; form.value = emptyForm(); showForm.value = true }

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    titre: item.titre, mission: item.mission || '', profil_recherche: item.profil_recherche || '',
    description: item.description || '', localisation: item.localisation || '',
    fourchette_salariale: item.fourchette_salariale || '', date_limite: item.date_limite || '',
    job_contract_ids: item.job_contracts?.map(c => c.id) || [],
    job_mode_ids: item.job_modes?.map(m => m.id) || [],
    skill_ids: item.skills?.map(s => s.id) || [],
    study_level_ids: item.study_levels?.map(s => s.id) || [],
    experience_ids: item.experiences?.map(e => e.id) || [],
  }
  showForm.value = false
}

const save = async () => {
  loading.value = true; error.value = ''; success.value = ''
  try {
    if (editingItem.value) {
      await offreService.update(editingItem.value.id, form.value)
      success.value = 'Offre modifiée'
      showSnack('Offre modifiée')
    } else {
      await offreService.create(form.value)
      success.value = 'Offre publiée'
      showSnack('Offre publiée')
    }
    await load(); cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur enregistrement"
    showSnack(error.value, 'error')
  } finally { loading.value = false }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette offre ?')) return
  loading.value = true
  try {
    await offreService.delete(id); success.value = 'Offre supprimée'; showSnack('Offre supprimée'); await load()
  } catch { error.value = 'Erreur suppression'; showSnack('Erreur suppression', 'error') }
  finally { loading.value = false }
}

const cancelForm = () => { showForm.value = false; editingItem.value = null; form.value = emptyForm() }

onMounted(() => { load(); loadRef() })
</script>
