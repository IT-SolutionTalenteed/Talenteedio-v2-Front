<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-domain" class="mr-2" />
      <v-toolbar-title>Gestion des Entreprises</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
        Ajouter une entreprise
      </v-btn>
    </v-toolbar>

    <!-- Formulaire -->
    <v-expand-transition>
      <div v-if="showForm || editingItem">
        <v-card-text class="border-b">
          <div class="text-subtitle-1 font-weight-bold mb-4">
            {{ editingItem ? 'Modifier' : 'Créer' }} une entreprise
          </div>
          <form @submit.prevent="save">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.nom"
                  label="Nom *"
                  variant="outlined"
                  density="compact"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Email *"
                  type="email"
                  variant="outlined"
                  density="compact"
                  required
                  :disabled="!!editingItem"
                  :hint="!editingItem ? 'Un email avec les identifiants sera envoyé à cette adresse.' : ''"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-body-2 mb-1">Logo</div>
                <input type="file" accept="image/*" @change="e => logoFile = e.target.files[0]" style="display:block;margin-bottom:8px" />
                <v-avatar v-if="editingItem?.logo_url" size="48" class="mt-1">
                  <img :src="editingItem.logo_url" style="width:100%;height:100%;object-fit:cover" />
                </v-avatar>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.activity_sector_id"
                  :items="referentiels.activity_sectors"
                  item-title="name"
                  item-value="id"
                  label="Secteur d'activité"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="Description"
                  variant="outlined"
                  density="compact"
                  rows="4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.site_web"
                  label="Site web"
                  variant="outlined"
                  density="compact"
                  placeholder="https://..."
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.telephone"
                  label="Téléphone"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.adresse"
                  label="Adresse"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.ville"
                  label="Ville"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.pays"
                  label="Pays"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
            <div class="d-flex gap-2 mt-2">
              <v-btn type="submit" color="primary" :loading="loading">
                Enregistrer
              </v-btn>
              <v-btn type="button" variant="text" @click="cancelForm">Annuler</v-btn>
            </div>
          </form>
        </v-card-text>
      </div>
    </v-expand-transition>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.logo_nom="{ item }">
        <div class="d-flex align-center gap-2">
          <v-avatar size="32">
            <img v-if="item.logo_url" :src="item.logo_url" style="width:100%;height:100%;object-fit:cover" />
            <span v-else>{{ item.nom?.charAt(0) }}</span>
          </v-avatar>
          <div>
            <div class="font-weight-bold">{{ item.nom }}</div>
            <div v-if="item.ville" class="text-caption text-medium-emphasis">{{ item.ville }}</div>
          </div>
        </div>
      </template>
      <template #item.email="{ item }">
        {{ item.user?.email || '-' }}
      </template>
      <template #item.ville="{ item }">
        {{ item.ville || '-' }}
      </template>
      <template #item.activity_sector="{ item }">
        <v-chip v-if="item.activity_sector" size="small" color="info">
          {{ item.activity_sector.name }}
        </v-chip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="editItem(item)" />
        <v-btn icon="mdi-trash-can" size="small" color="error" variant="text" @click="deleteItem(item.id)" />
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">
      {{ snackMsg }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import entrepriseService from '../../services/entrepriseService.js'

const items = ref([])
const referentiels = ref({ activity_sectors: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const logoFile = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Logo / Nom', key: 'logo_nom', sortable: false },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Ville', key: 'ville' },
  { title: 'Secteur', key: 'activity_sector', sortable: false },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
]

const emptyForm = () => ({
  nom: '', email: '', description: '', site_web: '',
  telephone: '', adresse: '', ville: '', pays: '', activity_sector_id: ''
})
const form = ref(emptyForm())

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await entrepriseService.getAll()
    items.value = res.data
  } catch (err) {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const loadReferentiels = async () => {
  try {
    const res = await entrepriseService.getReferentiels()
    referentiels.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const buildFormData = () => {
  const fd = new FormData()
  fd.append('nom', form.value.nom)
  fd.append('email', form.value.email)
  const textFields = ['description', 'site_web', 'telephone', 'adresse', 'ville', 'pays']
  textFields.forEach(f => { if (form.value[f]) fd.append(f, form.value[f]) })
  if (form.value.activity_sector_id) fd.append('activity_sector_id', form.value.activity_sector_id)
  if (logoFile.value) fd.append('logo', logoFile.value)
  return fd
}

const openCreate = () => {
  editingItem.value = null
  form.value = emptyForm()
  logoFile.value = null
  showForm.value = true
}

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    nom: item.nom,
    email: item.user?.email || '',
    description: item.description || '',
    site_web: item.site_web || '',
    telephone: item.telephone || '',
    adresse: item.adresse || '',
    ville: item.ville || '',
    pays: item.pays || '',
    activity_sector_id: item.activity_sector_id || '',
  }
  logoFile.value = null
  showForm.value = false
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      fd.append('_method', 'PUT')
      await entrepriseService.updateFormData(editingItem.value.id, fd)
      showSnack('Entreprise modifiée avec succès')
    } else {
      await entrepriseService.create(fd)
      showSnack('Entreprise créée — identifiants envoyés par email')
    }
    await load()
    cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    showSnack(errs ? Object.values(errs).flat().join(' | ') : "Erreur lors de l'enregistrement", 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette entreprise et son compte utilisateur ?')) return
  loading.value = true
  error.value = ''
  try {
    await entrepriseService.delete(id)
    showSnack('Entreprise supprimée avec succès')
    await load()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  showForm.value = false
  editingItem.value = null
  form.value = emptyForm()
  logoFile.value = null
}

onMounted(() => {
  load()
  loadReferentiels()
})
</script>

<style scoped>
.avatar {
  object-fit: cover;
}
</style>
