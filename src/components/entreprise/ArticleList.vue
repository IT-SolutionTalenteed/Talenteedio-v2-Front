<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <v-card-title class="text-h5 pa-0">Mes Articles</v-card-title>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="openCreate">
        Rédiger un article
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Formulaire inline (avec WysiwygEditor) -->
    <v-expand-transition>
      <v-card v-if="showForm || editingItem" rounded="lg" border elevation="0" class="mb-6 pa-4">
        <v-card-title class="text-h6 pa-0 mb-4">{{ editingItem ? 'Modifier' : 'Nouvel' }} article</v-card-title>
        <form @submit.prevent="save">
          <v-text-field
            v-model="form.title"
            label="Titre *"
            variant="outlined"
            density="comfortable"
            required
            class="mb-4"
          />

          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-1">Contenu *</div>
            <WysiwygEditor v-model="form.content" />
          </div>

          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-1">Image</div>
            <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" />
            <div v-if="editingItem?.image_url" class="mt-2">
              <img :src="editingItem.image_url" style="max-width:120px; border-radius:8px;" />
            </div>
          </div>

          <v-checkbox
            v-model="form.is_published"
            label="Publier"
            density="compact"
            hide-details
            class="mb-4"
          />

          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-2">Catégories</div>
            <v-row>
              <v-col
                v-for="c in referentiels.media_categories"
                :key="c.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-checkbox
                  :label="c.name"
                  :value="c.id"
                  v-model="form.category_ids"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
          </div>

          <div class="d-flex justify-end gap-2 mt-2">
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
      <template #item.image_url="{ item }">
        <img v-if="item.image_url" :src="item.image_url" style="max-width:60px; border-radius:6px; display:block;" />
        <span v-else>-</span>
      </template>

      <template #item.is_published="{ item }">
        <v-chip size="small" :color="item.is_published ? 'success' : 'default'">
          {{ item.is_published ? 'Publié' : 'Brouillon' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="editItem(item)" />
        <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="deleteItem(item.id)" />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucun article.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import articleService from '../../services/entreprise/articleService.js'
import WysiwygEditor from '../WysiwygEditor.vue'

const items = ref([])
const referentiels = ref({ media_categories: [] })
const loading = ref(false)
const error = ref('')
const success = ref('')
const showForm = ref(false)
const editingItem = ref(null)
const imageFile = ref(null)

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Image', key: 'image_url', sortable: false },
  { title: 'Titre', key: 'title' },
  { title: 'Publié', key: 'is_published' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const emptyForm = () => ({ title: '', content: '', is_published: false, category_ids: [] })
const form = ref(emptyForm())

const load = async () => {
  loading.value = true
  try { const res = await articleService.getAll(); items.value = res.data }
  catch { error.value = 'Erreur chargement'; showSnack('Erreur chargement', 'error') }
  finally { loading.value = false }
}

const loadRef = async () => {
  try { const res = await articleService.getReferentiels(); referentiels.value = res.data }
  catch {}
}

const buildFormData = () => {
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('content', form.value.content)
  fd.append('is_published', form.value.is_published ? '1' : '0')
  form.value.category_ids.forEach(id => fd.append('category_ids[]', id))
  if (imageFile.value) fd.append('image', imageFile.value)
  return fd
}

const openCreate = () => { editingItem.value = null; form.value = emptyForm(); imageFile.value = null; showForm.value = true }

const editItem = (item) => {
  editingItem.value = { ...item }
  form.value = {
    title: item.title, content: item.content,
    is_published: item.is_published,
    category_ids: item.media_categories?.map(c => c.id) || [],
  }
  imageFile.value = null; showForm.value = false
}

const save = async () => {
  loading.value = true; error.value = ''; success.value = ''
  try {
    const fd = buildFormData()
    if (editingItem.value) {
      fd.append('_method', 'PUT')
      await articleService.update(editingItem.value.id, fd)
      success.value = 'Article modifié'
      showSnack('Article modifié')
    } else {
      await articleService.create(fd)
      success.value = 'Article créé'
      showSnack('Article créé')
    }
    await load(); cancelForm()
  } catch (err) {
    const errs = err.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' | ') : "Erreur enregistrement"
    showSnack(error.value, 'error')
  } finally { loading.value = false }
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cet article ?')) return
  loading.value = true
  try { await articleService.delete(id); success.value = 'Article supprimé'; showSnack('Article supprimé'); await load() }
  catch { error.value = 'Erreur suppression'; showSnack('Erreur suppression', 'error') }
  finally { loading.value = false }
}

const cancelForm = () => { showForm.value = false; editingItem.value = null; form.value = emptyForm(); imageFile.value = null }

onMounted(() => { load(); loadRef() })
</script>
