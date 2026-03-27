<template>
  <v-card rounded="xl" border elevation="0">
    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Header -->
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-calendar-star</v-icon>
      <v-toolbar-title>Gestion des Événements</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">Ajouter un événement</v-btn>
      </template>
    </v-toolbar>

    <!-- Avertissement catégories manquantes -->
    <v-alert
      v-if="referentiels.categories?.length === 0"
      type="warning"
      variant="tonal"
      class="ma-4"
      prepend-icon="mdi-alert-triangle"
    >
      Aucune catégorie d'événement disponible. Créez-en une d'abord dans "Catégories d'événement".
    </v-alert>

    <!-- Fullscreen dialog formulaire événement -->
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" scrollable>
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="cancelForm" />
          <v-toolbar-title class="text-body-1 font-weight-medium">
            {{ editingItem ? 'Modifier' : 'Créer' }} un événement
          </v-toolbar-title>
          <template #append>
            <v-btn variant="flat" color="white" class="text-primary" :loading="loading" @click="save">
              <v-icon start>mdi-content-save-outline</v-icon>
              Enregistrer
            </v-btn>
          </template>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field v-model="form.titre" label="Titre *" variant="outlined" density="compact" required />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.categorie_evenement_id"
                label="Catégorie"
                variant="outlined"
                density="compact"
                :items="[{titre:'-- Aucune --',id:''},...referentiels.categories]"
                item-title="titre"
                item-value="id"
              />
            </v-col>

            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Image mise en avant</div>
              <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" style="display:block;width:100%;" />
              <v-avatar v-if="imagePreview" size="80" rounded="lg" class="mt-2">
                <img :src="imagePreview" style="object-fit:cover;width:100%;height:100%" />
              </v-avatar>
              <v-avatar v-else-if="editingItem?.image_mise_en_avant_url" size="80" rounded="lg" class="mt-2">
                <img :src="editingItem.image_mise_en_avant_url" style="object-fit:cover;width:100%;height:100%" />
              </v-avatar>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field v-model="form.date_debut" label="Date début *" type="date" variant="outlined" density="compact" required />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="form.date_fin" label="Date fin *" type="date" variant="outlined" density="compact" required />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="form.heure_debut_journee" label="Heure début *" type="time" variant="outlined" density="compact" required />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="form.heure_fin_journee" label="Heure fin *" type="time" variant="outlined" density="compact" required />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field v-model="form.pays" label="Pays" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.ville" label="Ville" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.adresse" label="Adresse" variant="outlined" density="compact" />
            </v-col>

            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Description</div>
              <WysiwygEditor v-model="form.description" />
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">Détails supplémentaires</div>
              <WysiwygEditor v-model="form.details_supplementaires" />
            </v-col>

            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis mb-1">Entreprises participantes</div>
              <select v-model="form.entreprise_ids" multiple size="5" style="width:100%;padding:8px;border:1px solid rgba(0,0,0,0.23);border-radius:4px;">
                <option v-for="e in referentiels.entreprises" :key="e.id" :value="e.id">{{ e.nom }}</option>
              </select>
              <div class="text-caption text-medium-emphasis mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs</div>
            </v-col>

            <v-col cols="12" md="6" class="d-flex align-center">
              <v-checkbox v-model="form.is_featured" label="Mise en avant" density="compact" hide-details />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Tableau -->
    <v-data-table
      :headers="headers"
      :items="evenements"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.image="{ item }">
        <v-avatar size="36" rounded="lg">
          <img :src="item.image_mise_en_avant_url || '/placeholder.png'" style="object-fit:cover;width:100%;height:100%" />
        </v-avatar>
      </template>

      <template #item.titre="{ item }">
        <div class="font-weight-bold">{{ item.titre }}</div>
        <div v-if="item.ville" class="text-caption text-medium-emphasis">{{ item.ville }}</div>
      </template>

      <template #item.dates="{ item }">
        <span class="text-medium-emphasis">{{ formatDate(item.date_debut) }} → {{ formatDate(item.date_fin) }}</span>
      </template>

      <template #item.is_featured="{ item }">
        <v-btn
          :icon="item.is_featured ? 'mdi-star' : 'mdi-star-outline'"
          :color="item.is_featured ? 'warning' : 'default'"
          variant="text"
          size="small"
          @click="toggleFeatured(item)"
        />
      </template>

      <template #item.entreprises="{ item }">
        <v-chip size="small">{{ item.entreprises?.length || 0 }}</v-chip>
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

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import evenementService from '../../services/evenementService.js'
import WysiwygEditor from '../WysiwygEditor.vue'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const evenements = ref([])
const referentiels = ref({ categories: [], entreprises: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const imageFile = ref(null)
const imagePreview = ref(null)
const pagination = ref({ current_page: 1, last_page: 1 })
const dialog = ref(false)
const confirmRef = ref(null)

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
  { title: 'Image', key: 'image', sortable: false, width: '60px' },
  { title: 'Titre / Ville', key: 'titre', sortable: true },
  { title: 'Dates', key: 'dates', sortable: false },
  { title: 'Mis en avant', key: 'is_featured', sortable: false },
  { title: 'Entreprises', key: 'entreprises', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const emptyForm = () => ({
  titre: '', description: '', details_supplementaires: '',
  date_debut: '', date_fin: '',
  heure_debut_journee: '09:00', heure_fin_journee: '18:00',
  categorie_evenement_id: '', pays: '', ville: '', adresse: '',
  is_featured: false, entreprise_ids: []
})
const form = ref(emptyForm())

const loadPage = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const res = await evenementService.getAll(page)
    evenements.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch (err) {
    error.value = 'Erreur lors du chargement'
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const res = await evenementService.getReferentiels()
    referentiels.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const buildFormData = () => {
  const fd = new FormData()
  const fields = ['titre', 'description', 'details_supplementaires', 'date_debut', 'date_fin',
    'heure_debut_journee', 'heure_fin_journee', 'pays', 'ville', 'adresse']
  fields.forEach(f => { if (form.value[f]) fd.append(f, form.value[f]) })
  if (form.value.categorie_evenement_id) fd.append('categorie_evenement_id', form.value.categorie_evenement_id)
  fd.append('is_featured', form.value.is_featured ? '1' : '0')
  form.value.entreprise_ids.forEach(id => fd.append('entreprise_ids[]', id))
  if (imageFile.value) fd.append('image_mise_en_avant', imageFile.value)
  return fd
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  imageFile.value = null
  imagePreview.value = null
  showForm.value = true
  dialog.value = true
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      await evenementService.update(editingItem.value.id, fd)
      success.value = 'Événement modifié avec succès'
    } else {
      await evenementService.create(fd)
      success.value = 'Événement créé avec succès'
    }
    showSnack(success.value)
    await loadPage(pagination.value.current_page)
    cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement"
    showSnack(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const editItem = (ev) => {
  editingItem.value = { ...ev }
  form.value = {
    titre: ev.titre,
    description: ev.description || '',
    details_supplementaires: ev.details_supplementaires || '',
    date_debut: ev.date_debut ? ev.date_debut.substring(0, 10) : '',
    date_fin: ev.date_fin ? ev.date_fin.substring(0, 10) : '',
    heure_debut_journee: (ev.heure_debut_journee || '09:00').substring(0, 5),
    heure_fin_journee: (ev.heure_fin_journee || '18:00').substring(0, 5),
    categorie_evenement_id: ev.categorie_evenement_id || '',
    pays: ev.pays || '',
    ville: ev.ville || '',
    adresse: ev.adresse || '',
    is_featured: ev.is_featured,
    entreprise_ids: ev.entreprises?.map(e => e.id) || []
  }
  imageFile.value = null
  imagePreview.value = null
  showForm.value = false
  dialog.value = true
}

const toggleFeatured = async (ev) => {
  try {
    await evenementService.toggleFeatured(ev.id)
    await loadPage(pagination.value.current_page)
  } catch {
    error.value = 'Erreur lors de la mise à jour'
    showSnack('Erreur lors de la mise à jour', 'error')
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer cet événement ?' })
  if (!ok) return
  loading.value = true
  error.value = ''
  try {
    await evenementService.delete(id)
    success.value = 'Événement supprimé avec succès'
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
  dialog.value = false
  editingItem.value = null
  form.value = emptyForm()
  imageFile.value = null
  imagePreview.value = null
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'

onMounted(() => {
  loadPage()
  loadReferentiels()
})
</script>
