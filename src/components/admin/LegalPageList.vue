<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-file-document-outline" class="mr-2" />
      <v-toolbar-title>Gestion des CGU / Mentions légales</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
        Ajouter une page légale
      </v-btn>
    </v-toolbar>

    <!-- Dialog formulaire (fullscreen — contient WysiwygEditor) -->
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" scrollable>
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="cancelForm" />
          <v-toolbar-title class="text-body-1 font-weight-medium">
            {{ editingItem ? 'Modifier' : 'Créer' }} une page légale
          </v-toolbar-title>
          <template #append>
            <v-btn variant="flat" color="white" class="text-primary" :loading="loading" @click="save">
              Enregistrer
            </v-btn>
          </template>
        </v-toolbar>
        <v-card-text class="pa-6">
          <form @submit.prevent="save">
            <v-text-field
              v-model="form.title"
              label="Titre *"
              variant="outlined"
              density="compact"
              required
              class="mb-4"
            />
            <div class="mb-4">
              <div class="text-body-2 mb-1">Contenu</div>
              <WysiwygEditor v-model="form.description" />
            </div>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="editItem(item)" />
        <v-btn icon="mdi-trash-can" size="small" color="error" variant="text" @click="deleteItem(item.id)" />
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">
      {{ snackMsg }}
    </v-snackbar>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import legalPageService from '../../services/legalPageService.js'
import WysiwygEditor from '../WysiwygEditor.vue'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const form = ref({ title: '', description: '' })
const dialog = ref(false)

const confirmRef = ref(null)

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
  { title: 'Titre', key: 'title' },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
]

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await legalPageService.getAll()
    items.value = response.data
  } catch (err) {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const save = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    if (editingItem.value) {
      await legalPageService.update(editingItem.value.id, form.value)
      showSnack('Page légale modifiée avec succès')
    } else {
      await legalPageService.create(form.value)
      showSnack('Page légale créée avec succès')
    }
    await load()
    cancelForm()
  } catch (err) {
    showSnack(err.response?.data?.message || "Erreur lors de l'enregistrement", 'error')
  } finally {
    loading.value = false
  }
}

const editItem = (item) => {
  editingItem.value = item
  form.value = { title: item.title, description: item.description }
  showForm.value = false
  dialog.value = true
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer cette page légale ?' })
  if (!ok) return
  loading.value = true
  error.value = ''
  try {
    await legalPageService.delete(id)
    showSnack('Page légale supprimée avec succès')
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
  form.value = { title: '', description: '' }
  dialog.value = false
}

onMounted(load)
</script>
